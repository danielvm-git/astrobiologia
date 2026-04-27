import { createAdminClient, DATABASE_ID } from "$lib/server/appwrite";
import { COLLECTIONS } from "$lib/appwrite";
import { ID, Query } from "node-appwrite";
import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createLogger } from "$lib/server/logger";

const logger = createLogger("ADMIN-EDIT-SERVER");

export const load: PageServerLoad = async (event) => {
  const { params } = event;
  try {
    const { databases } = createAdminClient();

    const article = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      params.id
    );

    const transResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES_TRANSLATIONS,
      [Query.equal("article_id", params.id)]
    );

    return {
      article: JSON.parse(JSON.stringify(article)),
      translations: JSON.parse(JSON.stringify(transResponse.documents)),
    };
  } catch (err) {
    console.error("Error loading article:", err);
    throw error(404, "Article not found");
  }
};

export const actions: Actions = {
  save: async (event) => {
    const { params, request } = event;
    const { databases } = createAdminClient();

    try {
      const formData = await request.formData();
      const articleDataJson = formData.get("articleData") as string;
      const translationsJson = formData.get("translations") as string;

      const articleDataRaw = JSON.parse(articleDataJson);
      const translations = JSON.parse(translationsJson);

      logger.debug("Saving article", {
        id: params.id,
        translationsCount: translations.length,
      });

      // Sanitize function to remove Appwrite internal fields and unknown attributes
      const sanitize = (data: any) => {
        const clean: any = {};
        const forbidden = ["updatedAt", "createdAt"]; // Known problematic non-dollar fields
        for (const key in data) {
          if (!key.startsWith("$") && !forbidden.includes(key)) {
            clean[key] = data[key];
          }
        }
        return clean;
      };

      const articleData = sanitize(articleDataRaw);
      logger.debug("Sanitized article data", articleData);

      // 1. Update master metadata
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        params.id as string,
        articleData
      );

      // 2. Fetch existing translations
      const existingTrans = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ARTICLES_TRANSLATIONS,
        [Query.equal("article_id", params.id as string)]
      );

      logger.debug("Existing translations found", {
        count: existingTrans.total,
      });

      // 3. Upsert translations
      for (const trans of translations) {
        const existing = existingTrans.documents.find(
          (t: any) => t.language === trans.language
        );
        const cleanTrans = sanitize(trans);

        logger.debug("Upserting translation", {
          language: trans.language,
          isUpdate: !!existing,
          id: existing?.$id,
        });

        if (existing) {
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.ARTICLES_TRANSLATIONS,
            existing.$id,
            cleanTrans
          );
        } else {
          await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.ARTICLES_TRANSLATIONS,
            ID.unique(),
            {
              ...cleanTrans,
              article_id: params.id,
            }
          );
        }
      }

      return { success: true };
    } catch (err: any) {
      logger.error("Save action error", err);
      return { error: err.message || "Erro ao salvar" };
    }
  },
};
