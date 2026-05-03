/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    interface Locals {
      paraglide?: { lang: string };
      user: import("$lib/appwrite").User | null;
    }
    interface PageData {
      listLoadError?: boolean;
      user?: import("$lib/appwrite").User | null;
    }
  }
}

export {};
