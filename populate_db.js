import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('69e462f20036d39192ba')
    .setKey('standard_ef6e1acdf96cd0c63ece4eec29ef4852c9424e33648343521aa130f3ce1f9a993991d507deb2525257a0f5b74a4544cf24a5578aa1dc6fafd94604a3046c391579fc48a9347ec5a36512f964c1162bbdf88563316e9791806522df975f8649b6d782c6c71ff6d0d08e77a039b9fcc0e8e918cf44f3cfc04a3582b0bf41161581');

const databases = new Databases(client);
const DATABASE_ID = '69e464fb0006a1b3c4eb';
const COLLECTION_ID = 'articles';

const articles = [
    {
        "title": "Experimentos avançam na manipulação das interações entre ondas acústicas e de luz",
        "excerpt": "Controlar as interações entre fônons e fótons pode gerar lasers mais refinados e facilitar o processamento de informação quântica",
        "content": "Quando se propaga por um material, um feixe de laser de intensidade significativa modifica ligeiramente a densidade do meio físico e gera ínfimas vibrações. Essas oscilações acústicas distorcem o material e podem causar alterações nas características originais da luz. Dois artigos científicos recentes, com participação de físicos brasileiros, apresentam progressos experimentais no controle das interações entre ondas de luz (fótons) e ondas acústicas ou mecânicas (fônons) no interior de um meio físico. Os trabalhos mostram avanços que podem auxiliar no desenvolvimento de dispositivos para sistemas de comunicação quântica. O primeiro artigo apresenta um cristal de silício com um design que visa dissipar o calor rapidamente e aumentar a eficiência no processamento de informação baseada em qubits.",
        "category": "noticias",
        "publishedAt": "2025-05-01T12:00:00Z",
        "featuredImageAlt": "Interações entre ondas acústicas e de luz",
        "status": "published",
        "featured": true,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "experimentos-interacoes-luz-acustica",
        "tags": ["física", "quântica", "laser"]
    },
    {
        "title": "A Nova República chega aos 40 anos",
        "excerpt": "Período de redemocratização tem entre suas marcas os avanços sociais e os planos econômicos",
        "content": "O livro 'A Nova República: 1985-2024' oferece uma síntese da história política brasileira das últimas quatro décadas. Os autores mostram que a democracia brasileira se caracterizou pela resolução de conflitos com arranjos consensuais entre a elite política, garantindo estabilidade econômica e política entre 1994 e 2013. Apesar do crescimento econômico modesto, os indicadores sociais melhoraram significativamente: a extrema pobreza caiu de 25% em 1985 para 3,5% em 2022. O processo de redemocratização é analisado desde o governo Geisel, passando pela campanha das Diretas Já até a eleição de Tancredo Neves e José Sarney.",
        "category": "noticias",
        "publishedAt": "2025-04-27T12:00:00Z",
        "featuredImageAlt": "40 anos da Nova República",
        "status": "published",
        "featured": false,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "nova-republica-40-anos",
        "tags": ["política", "história", "brasil"]
    },
    {
        "title": "Costa Ribeiro descobriu fontes inesperadas de eletricidade",
        "excerpt": "Em 1944, o engenheiro e físico carioca identificou na cera de carnaúba um fenômeno de formação de corrente elétrica usado hoje em celulares e computadores",
        "content": "Joaquim da Costa Ribeiro foi o descobridor do efeito termodielétrico, a capacidade de alguns materiais gerarem corrente elétrica ao passarem de um estado físico para outro. Identificado inicialmente na cera de carnaúba, esse fenômeno permitiu a criação de eletretos, componentes essenciais em diversos aparelhos eletrônicos modernos. O documentário 'Termodielétrico', lançado em 2024, resgata sua trajetória pessoal e científica, destacando sua importância para a física brasileira e internacional.",
        "category": "noticias",
        "publishedAt": "2025-04-15T12:00:00Z",
        "featuredImageAlt": "Joaquim da Costa Ribeiro",
        "status": "published",
        "featured": false,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "costa-ribeiro-eletricidade",
        "tags": ["física", "biografia", "história da ciência"]
    },
    {
        "title": "Radar em drone facilita monitoramento agrícola",
        "excerpt": "Aparelho criado por startup paulista também faz análise de solos e é capaz de localizar jazidas minerais, formigueiros e ossadas no subsolo",
        "content": "A startup Radaz, originada na Unicamp, aprimorou a tecnologia de radar de abertura sintética (SAR) para uso em drones de pequeno porte. O sistema permite um monitoramento agrícola detalhado, capaz de 'enxergar' através da vegetação e analisar o subsolo. Essa inovação facilita a identificação de erosões, jazidas e até ossadas, oferecendo uma resolução superior aos métodos tradicionais de sensoriamento remoto por satélite ou aviões, com menor custo e maior agilidade.",
        "category": "noticias",
        "publishedAt": "2025-03-26T12:00:00Z",
        "featuredImageAlt": "Radar em drone para agricultura",
        "status": "published",
        "featured": false,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "radar-drone-monitoramento-agricola",
        "tags": ["tecnologia", "agronegócio", "inovação"]
    }
];

async function populate() {
    console.log('Starting population...');
    for (const article of articles) {
        try {
            console.log(`Creating article: ${article.title}`);
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                article
            );
            console.log(`Successfully created: ${article.title}`);
        } catch (error) {
            console.error(`Error creating article ${article.title}:`, error);
        }
    }
    console.log('Population finished.');
}

populate();

