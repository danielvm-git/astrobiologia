import { Client, Databases, ID, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('69e462f20036d39192ba')
    .setKey('standard_ef6e1acdf96cd0c63ece4eec29ef4852c9424e33648343521aa130f3ce1f9a993991d507deb2525257a0f5b74a4544cf24a5578aa1dc6fafd94604a3046c391579fc48a9347ec5a36512f964c1162bbdf88563316e9791806522df975f8649b6d782c6c71ff6d0d08e77a039b9fcc0e8e918cf44f3cfc04a3582b0bf41161581');

const databases = new Databases(client);
const DATABASE_ID = '69e464fb0006a1b3c4eb';
const COLLECTION_ID = 'articles';

const articles = [
    {
        "title": "A Nova República chega aos 40 anos",
        "excerpt": "Período de redemocratização tem entre suas marcas os avanços sociais e os planos econômicos",
        "content": "<p>Há 40 anos, em 21 de abril de 1985, morria Tancredo Neves (1910-1985). Não fosse por uma infecção generalizada, o político mineiro teria sido o primeiro civil a assumir Presidência da República após 21 anos de ditadura militar. Três meses antes, ele havia vencido a eleição presidencial indireta no Congresso Nacional, numa chapa costurada com um antigo apoiador do regime, o político maranhense José Sarney, que acabou assumindo o cargo. De maneira tortuosa, o processo de redemocratização manteve no poder políticos que haviam dado sustentação à ditadura. Conciliador e conservador, Tancredo apaziguava as inquietações dos militares que, de saída do Palácio do Planalto, temiam a ascensão da oposição ao poder. Durante sua campanha presidencial foi cunhada a expressão “Nova República” para designar um sistema democrático marcado pela conciliação, em que um acerto de contas com os abusos ditatoriais estava fora de questão.</p><p>“Em um original jogo de palavras, lançado para sinalizar que não perseguiria as Forças Armadas, [Tancredo] apresentou sua candidatura como ‘mudancista’ ao invés de ‘oposicionista’.” Essa passagem emblemática da redemocratização brasileira, marcada por rupturas e continuidades com o passado autoritário, está descrita no livro Democracia negociada: Política partidária no Brasil da Nova República (FGV Editora, 2024). Nele, o historiador Leonardo Weller, professor da Escola de Economia de São Paulo da Fundação Getulio Vargas de São Paulo (EESP-FGV), e o cientista político Fernando Limongi, docente na mesma instituição e também na Universidade de São Paulo (USP), oferecem uma síntese da história política brasileira das últimas quatro décadas. Em meio a outros pontos, mostram que a democracia brasileira nesse período se caracterizou pela resolução de conflitos com arranjos consensuais entre a elite política, o que garantiu duas décadas de estabilidade econômica e política entre 1994 e 2013. Além disso, eles procuram explicar como um sistema baseado em negociações com representantes de interesses conflitantes foi capaz de produzir mudanças sociais significativas e sem precedentes na história do país.</p><p>De acordo com Limongi, o próprio sucesso das democracias em promover soluções negociadas pode gerar insatisfação por parecer um grande acordo entre elites que buscam preservar seus interesses. “Mas, quando olhamos os dados, vemos que a democracia se move, produz mudança, ainda que mais lenta do que gostaríamos que fosse”, avalia o pesquisador. “Desde a década de 1980 o Brasil cresceu pouco, mas os indicadores sociais melhoraram muito e um estado de bem-estar social, mesmo imperfeito, passou a funcionar”, acrescenta Weller. Segundo o Banco Mundial, a extrema pobreza atingia 25% da população brasileira em 1985. Trinta e sete anos após a redemocratização, em 2022, esse índice se encontrava em 3,5%.</p>",
        "category": "noticias",
        "publishedAt": "2025-04-27T12:00:00Z",
        "featuredImage": "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/rpf-nova-republica-351-1140-Abre.jpg",
        "featuredImageAlt": "Ilustração de Veridiana Scarpelli para a reportagem sobre os 40 anos da Nova República",
        "status": "published",
        "featured": true,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "nova-republica-40-anos",
        "tags": ["história", "política", "brasil"]
    },
    {
        "title": "Costa Ribeiro descobriu fontes inesperadas de eletricidade",
        "excerpt": "Em 1944, o engenheiro e físico carioca identificou na cera de carnaúba um fenômeno de formação de corrente elétrica usado hoje em celulares e computadores",
        "content": "<p>Nas noites frias dos anos 1950 em Teresópolis, no Rio de Janeiro, o engenheiro e físico carioca Joaquim da Costa Ribeiro (1906-1960), com seus nove filhos, enrolados em cobertores no gramado do casarão onde passavam as férias de verão, tinha por hábito observar o céu estrelado. “O céu, descrito por ele de forma poética, era um infinito maravilhoso”, lembra a antropóloga Yvonne Maggie de Leers Costa Ribeiro, da Universidade Federal do Rio de Janeiro (UFRJ), ao se lembrar de como seu pai mostrava as constelações e explicava a origem de seus nomes.</p><p>Com cartas, fotos e filmes, o documentário Termodielétrico, lançado em outubro de 2024, dirigido e narrado pela cineasta Ana Costa Ribeiro, uma de suas netas, retoma a trajetória pessoal e científica do avô, descobridor do fenômeno conhecido como efeito termodielétrico. Definida como a capacidade de alguns materiais gerarem corrente elétrica ao passarem de um estado físico para outro – do sólido para o líquido ou vice-versa –, essa propriedade foi identificada pela primeira vez na cera de carnaúba. Em consequência dessa transformação, produziam-se materiais com carga elétrica permanente, os chamados eletretos, empregados em componentes de aparelhos eletrônicos.</p><p>Costa Ribeiro não é tão conhecido quanto outros físicos brasileiros de sua época, como César Lattes (1924-2005) e Mário Schenberg (1914-1990), embora tenha contribuído para o avanço da pesquisa e a estruturação da ciência nacional. Um dos pioneiros na área atualmente chamada de física da matéria condensada, que estuda as propriedades da matéria e seus elementos, como átomos e elétrons, ele foi um dos fundadores do Centro Brasileiro de Pesquisas Físicas (CBPF), em 1949, e do Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq), em 1951, do qual foi o primeiro diretor científico.</p>",
        "category": "noticias",
        "publishedAt": "2025-04-10T12:00:00Z",
        "featuredImage": "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/RPF-memoria-costa-ribeiro-cachimbo-2025-04-1140.jpg",
        "featuredImageAlt": "O descobridor do efeito termodielétrico no laboratório de física da Universidade do Brasil. Acervo Costa Ribeiro – MAST",
        "status": "published",
        "featured": false,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "costa-ribeiro-eletricidade",
        "tags": ["biografia", "física", "história da ciência"]
    },
    {
        "title": "Experimentos avançam na manipulação das interações entre ondas acústicas e de luz",
        "excerpt": "Controlar as interações entre fônons e fótons pode gerar lasers mais refinados e facilitar o processamento de informação quântica",
        "content": "<p>Quando se propaga por um material, um feixe de laser de intensidade significativa modifica ligeiramente a densidade do meio físico e gera ínfimas vibrações. Essas oscilações acústicas distorcem o material e podem causar alterações nas características originais da luz. Dois artigos científicos recentes, com participação de físicos brasileiros, apresentam progressos experimentais no controle das interações entre ondas de luz (fótons) e ondas acústicas ou mecânicas (fônons) no interior de um meio físico.</p><p>“Os trabalhos mostram avanços que podem auxiliar no desenvolvimento de dispositivos para sistemas de comunicação quântica”, diz Gustavo Wiederhecker, do Instituto de Física Gleb Wataghin da Universidade Estadual de Campinas (IFGW-Unicamp). O pesquisador é coautor de um dos artigos e coordena o Programa FAPESP QuTIa em Tecnologias Quânticas, no âmbito do qual os estudos foram realizados.</p><p>O primeiro artigo saiu em 15 de março na revista Nature Communications. Ele apresenta um cristal de silício com um design que tem como objetivo dissipar o calor muito rapidamente e aumentar a eficiência no processamento de informação baseada em qubits (bits quânticos). O segundo estudo, disponibilizado on-line em 21 de março no periódico Physical Review Letters, relata uma nova estratégia para manipular a polarização da luz, isto é, o plano (vertical ou horizontal) em que vibram suas ondas eletromagnéticas.</p>",
        "category": "noticias",
        "publishedAt": "2025-05-01T12:00:00Z",
        "featuredImage": "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/rpf-transducao-351-1140-630.jpg",
        "featuredImageAlt": "Representação de interações entre fônons e fótons. Ilustração de Alexandre Affonso/Revista Pesquisa FAPESP",
        "status": "published",
        "featured": false,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "experimentos-interacoes-luz-acustica",
        "tags": ["física", "quântica", "tecnologia"]
    },
    {
        "title": "Danilo Albergaria: Tantos sóis, tantos mundos",
        "excerpt": "Pesquisador analisa o caminho percorrido para explicar a formação do Sistema Solar, tema de seu livro 'Tantos sóis, tantos mundos, tantas hipóteses'.",
        "content": "<h2>O Progresso na História da Ciência Planetária</h2><p>O trabalho é uma análise do caminho percorrido por filósofos naturais e cientistas para explicar a formação do Sistema Solar, que desembocou na atual busca sistemática por uma explicação geral para a formação de sistemas planetários. Minha tese principal é a de que, apesar de ainda não haver uma teoria que dê conta de explicar consistentemente todos os processos de formação planetária, a área tem feito avanços significativos na compreensão do problema.</p><p>Há um conjunto teórico e empírico muito bem articulado e promissor, que justifica a confiança atual em torno da concepção de que os planetas se formam em discos de gás e poeira ao redor de estrelas nascentes. Sugere, também, a vitória da concepção de pluralidade dos mundos: um universo em que planetas são subprodutos da formação de estrelas é um universo abarrotado de sistemas planetários. Eu defendo que é possível identificar marcas de progresso científico nessa história.</p><h2>A Crítica ao Modelo de Stephen G. Brush</h2><p>Nisso, questiono a interpretação do principal historiador do tema, o norte-americano Stephen G. Brush. Em meados da década de 1990, em sua seminal trilogia sobre a história desse campo, Brush afirmou que a área não havia progredido nem mesmo com relação à pergunta mais elementar: o Sistema Solar se formou por si só ou sua formação precisou da interação entre o Sol e uma entidade externa? Em meu trabalho, mostro que essa pergunta foi deixando de fazer sentido ao longo do século 20.</p><h2>Impacto dos Novos Instrumentos de Observação</h2><p>O impacto foi muito grande e talvez tenha sido decisivo para a área. No começo dos anos 1980, com o IRAS (Infrared Astronomical Satellite), pela primeira vez foi possível observar discos de poeira e gás ao redor de estrelas relativamente jovens e próximas, como Fomalhaut e Beta Pictoris. Na década seguinte, com o telescópio espacial Hubble, foi possível observar discos de gás e poeira ao redor de estrelas nascentes em uma zona de formação estelar (a nebulosa de Orion).</p>",
        "category": "entrevistas",
        "publishedAt": "2024-06-01T12:00:00Z",
        "featuredImage": "https://www.fcw.org.br/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F86fdf06e8m8v%2F2Yx9Q8XW7Yx9Q8XW7Yx9Q8%2F7f8f7f8f7f8f7f8f7f8f7f8f7f8f7f8f%2Fdanilo_albergaria.jpg&w=1920&q=75",
        "featuredImageAlt": "Danilo Albergaria em Leiden, Holanda. Foto: Arquivo Pessoal",
        "status": "published",
        "featured": true,
        "authorId": "danilo_albergaria",
        "authorName": "Danilo Albergaria",
        "slug": "entrevista-danilo-albergaria-formacao-planetaria",
        "tags": ["história da ciência", "exoplanetas", "astronomia"]
    }
];

async function populate() {
    console.log('Starting cleaning and population...');
    
    try {
        // Clear existing articles
        const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        for (const doc of existing.documents) {
            console.log(`Deleting existing article: ${doc.title}`);
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
        }
        console.log('Database cleared.');

        // Insert new articles
        for (const article of articles) {
            console.log(`Creating article: ${article.title}`);
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                article
            );
            console.log(`Successfully created: ${article.title}`);
        }
    } catch (error) {
        console.error('Population error:', error);
    }
    
    console.log('Process finished.');
}

populate();
