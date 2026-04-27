export type RuntimeConfigStub = {
  appwriteApiKey: string;
  public: {
    appwriteEndpoint: string;
    appwriteProjectId: string;
    databaseId: string;
    articlesCollectionId: string;
    articleTranslationsCollectionId: string;
    categoriesCollectionId: string;
    storageBucketId: string;
  };
};
