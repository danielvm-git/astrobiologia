import { createAdminClient, DATABASE_ID } from "$lib/server/appwrite";
import { COLLECTIONS } from "$lib/appwrite";
import { ID } from "node-appwrite";
import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  save: async (event) => {
    const { request } = event;
    const { databases } = createAdminClient();

    try {
      const formData = await request.formData();
      const articleDataJson = formData.get("articleData") as string;
      const translationsJson = formData.get("translations") as string;

      const articleData = JSON.parse(articleDataJson);
      const translations = JSON.parse(translationsJson);

      // 1. Create master metadata
      const master = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        ID.unique(),
        articleData
      );

      // 2. Create translations
      for (const trans of translations) {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.ARTICLES_TRANSLATIONS,
          ID.unique(),
          {
            ...trans,
            article_id: master.$id,
          }
        );
      }

      return { success: true };
    } catch (err: any) {
      console.error("Create action error:", err);
      return { error: err.message || "Erro ao criar artigo" };
    }
  },
};
