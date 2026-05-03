import { json } from "@sveltejs/kit";
import { databases, DATABASE_ID, COLLECTIONS } from "$lib/appwrite";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    // Attempt to list collections as a connectivity check
    const startTime = Date.now();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      []
    );
    const duration = Date.now() - startTime;

    return json({
      status: "ok",
      database: "connected",
      latency: `${duration}ms`,
      message: "Appwrite Cloud connection verified",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Health check failed:", err);
    return json(
      {
        status: "error",
        database: "disconnected",
        error: err.message || "Unknown error during connection check",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
