import { Client, Databases, Query } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("69e4fa480024f7667b95")
  .setKey(
    "standard_ef6e1acdf96cd0c63ece4eec29ef4852c9424e33648343521aa130f3ce1f9a993991d507deb2525257a0f5b74a4544cf24a5578aa1dc6fafd94604a3046c391579fc48a9347ec5a36512f964c1162bbdf88563316e9791806522df975f8649b6d782c6c71ff6d0d08e77a039b9fcc0e8e918cf44f3cfc04a3582b0bf41161581"
  );

const databases = new Databases(client);
const DATABASE_ID = "69e464fb0006a1b3c4eb";
const COLLECTION_ID = "articles";

async function wipe() {
  console.log("Buscando documentos para deletar...");
  let docs;
  do {
    docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100),
    ]);

    for (const doc of docs.documents) {
      console.log(`Deletando: ${doc.$id}`);
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
    }
  } while (docs.documents.length > 0);
  console.log("Todos os documentos foram deletados.");
}

wipe();
