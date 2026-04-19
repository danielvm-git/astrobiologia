const fs = require('fs');
const content = fs.readFileSync('/Volumes/be65_4aaa/populate_db.js', 'utf8');

// Find the articles array
const match = content.match(/const articles = (\[[\s\S]*?\]);\n\nasync function populate/);
if (!match) {
    console.error("Could not find articles array");
    process.exit(1);
}

// Evaluate the array
const articles = eval(match[1]);

// Remove duplicates by title
const uniqueArticles = [];
const titles = new Set();
for (const article of articles) {
    if (!titles.has(article.title)) {
        uniqueArticles.push(article);
        titles.add(article.title);
    }
}

// Take exactly 20
const top20 = uniqueArticles.slice(0, 20);

// Generate new file
const newFile = `import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('69e462f20036d39192ba')
    .setKey('standard_ef6e1acdf96cd0c63ece4eec29ef4852c9424e33648343521aa130f3ce1f9a993991d507deb2525257a0f5b74a4544cf24a5578aa1dc6fafd94604a3046c391579fc48a9347ec5a36512f964c1162bbdf88563316e9791806522df975f8649b6d782c6c71ff6d0d08e77a039b9fcc0e8e918cf44f3cfc04a3582b0bf41161581');

const databases = new Databases(client);
const DATABASE_ID = '69e464fb0006a1b3c4eb';
const COLLECTION_ID = 'articles';

const articles = ${JSON.stringify(top20, null, 4)};

async function populate() {
    console.log(\`\\nIniciando população do banco de dados...\`);
    console.log(\`Total de artigos: \${articles.length}\\n\`);

    let created = 0;
    let errors = 0;

    for (const article of articles) {
        try {
            process.stdout.write(\`Criando: \${article.title.substring(0, 60)}... \`);
            await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), article);
            console.log('✓');
            created++;
            // Aguarda 1 segundo para evitar limite de taxa (Rate Limit) do Appwrite
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.log('✗');
            console.error(\`  Erro: \${error?.message || error}\`);
            errors++;
        }
    }

    console.log(\`\\n\${'─'.repeat(60)}\`);
    console.log(\`Concluído! Criados: \${created} | Erros: \${errors}\`);
}

populate();
`;

fs.writeFileSync('populate_db.js', newFile);
console.log("Created populate_db.js with 20 articles and rate limit delay.");
