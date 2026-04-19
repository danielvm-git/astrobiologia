/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/appwrite').User | null;
		}
		interface PageData {
			user?: import('$lib/appwrite').User | null;
		}
	}
}

export {};
