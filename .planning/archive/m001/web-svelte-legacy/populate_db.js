import { Client, Databases, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("69e4fa480024f7667b95")
  .setKey(
    "standard_ef6e1acdf96cd0c63ece4eec29ef4852c9424e33648343521aa130f3ce1f9a993991d507deb2525257a0f5b74a4544cf24a5578aa1dc6fafd94604a3046c391579fc48a9347ec5a36512f964c1162bbdf88563316e9791806522df975f8649b6d782c6c71ff6d0d08e77a039b9fcc0e8e918cf44f3cfc04a3582b0bf41161581"
  );

const databases = new Databases(client);
const DATABASE_ID = "69e464fb0006a1b3c4eb";
const COLLECTION_ID = "articles";

const articles = [
  {
    title:
      "Experimentos avançam na manipulação das interações entre ondas acústicas e de luz",
    excerpt:
      "Controlar as interações entre fônons e fótons pode gerar lasers mais refinados e facilitar o processamento de informação quântica",
    content:
      '<p>Quando se propaga por um material, um feixe de laser de intensidade significativa modifica ligeiramente a densidade do meio físico e gera ínfimas vibrações. Essas oscilações acústicas distorcem o material e podem causar alterações nas características originais da luz. Dois artigos científicos recentes, com participação de físicos brasileiros, apresentam progressos experimentais no controle das interações entre ondas de luz (fótons) e ondas acústicas ou mecânicas (fônons) no interior de um meio físico. Os trabalhos mostram avanços que podem auxiliar no desenvolvimento de dispositivos para sistemas de comunicação quântica.</p>\n\n<p>O primeiro artigo apresenta um cristal de silício bidimensional com estruturas em formatos que os pesquisadores chamam de "bumerangues" e "adagas". Esse design visa dissipar o calor rapidamente e aumentar a eficiência no processamento de informação baseada em qubits — as unidades de informação dos computadores quânticos. O estudo foi publicado na revista <em>Nature Communications</em> em março de 2025, e contou com participação de pesquisadores da Unicamp.</p>\n\n<p>O segundo trabalho, publicado no <em>Physical Review Letters</em> também em março de 2025, demonstra a manipulação da polarização da luz utilizando guias de onda de niobato de lítio. O resultado pode levar ao desenvolvimento de lasers com maior precisão espectral para transmissão de dados em redes de comunicação quântica. "Os trabalhos mostram avanços que podem auxiliar no desenvolvimento de dispositivos para sistemas de comunicação quântica", destacaram os pesquisadores envolvidos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/05/RPF-informacao-quantica-2025-05-800.jpg" alt="Representação de interações entre ondas acústicas e de luz em sistemas quânticos" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/05/RPF-informacaoquantica-2025-05-info-760.png" alt="Infográfico sobre comunicação quântica com fótons e fônons" />\n</figure>\n\n<p>A interação entre fótons e fônons — conhecida como espalhamento de Brillouin — é um fenômeno estudado há décadas, mas o controle preciso dessas interações em escala nanométrica representa um dos maiores desafios da física moderna. Os novos experimentos representam passos concretos rumo a dispositivos quânticos estáveis e eficientes, um requisito fundamental para a computação e a comunicação quântica do futuro.</p>',
    category: "noticias",
    publishedAt: "2025-05-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/05/RPF-informacao-quantica-2025-05-800.jpg",
    featuredImageAlt:
      "Interações entre ondas acústicas e de luz em sistemas quânticos",
    status: "published",
    featured: true,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "experimentos-interacoes-luz-acustica",
    tags: ["física", "quântica", "laser", "comunicação quântica"],
    metaTitle:
      "Experimentos avançam na manipulação das interações entre ondas acústicas e de luz",
    metaDescription:
      "Controlar as interações entre fônons e fótons pode gerar lasers mais refinados e facilitar o processamento de informação quântica",
  },
  {
    title: "A Nova República chega aos 40 anos",
    excerpt:
      "Período de redemocratização tem entre suas marcas os avanços sociais e os planos econômicos para controle da hiperinflação",
    content:
      '<p>Tancredo Neves morreu em 21 de abril de 1985, antes de tomar posse. Com sua morte, o vice José Sarney assumiu a presidência, inaugurando oficialmente a Nova República — o período democrático que se estende até hoje. Quatro décadas depois, o balanço revela avanços significativos convivendo com contradições estruturais ainda não superadas.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/rpf-nova-republica-351-1140-Abre.jpg" alt="Ilustração comemorativa dos 40 anos da Nova República" />\n</figure>\n\n<p>A democracia brasileira se caracterizou pela resolução de conflitos com arranjos consensuais entre a elite política — o que os pesquisadores chamam de "democracia negociada". Esse modelo garantiu a transição pacífica da ditadura, mas limitou reformas estruturais mais profundas nas relações de propriedade e poder. Entre os livros que analisam o período, destaca-se <em>Democracia negociada</em> (FGV Editora, 2024), de Weller e Limongi.</p>\n\n<p>Apesar do crescimento econômico modesto, os indicadores sociais melhoraram significativamente: a extrema pobreza caiu de 25% em 1985 para 3,5% em 2022. A cobertura universal de saúde pelo SUS e a expansão do ensino superior são conquistas consolidadas do período. O processo de redemocratização é analisado desde o governo Geisel, passando pela campanha das Diretas Já até a eleição de Tancredo Neves.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/rpf-nova-republica-351-1140.jpg" alt="Manifestações populares pela redemocratização do Brasil" />\n</figure>\n\n<p>O período foi marcado por múltiplos planos de estabilização — Cruzado, Bresser, Verão, Collor e Real — para controlar a hiperinflação que chegou a 2.477% ao ano em 1993. A estabilidade econômica conquistada com o Plano Real em 1994 abriu um período de desenvolvimento que durou até cerca de 2013. A Constituição de 1988, chamada de Cidadã, criou um Estado de bem-estar social híbrido que expandiu direitos sem promover redistribuição substantiva da renda e da propriedade — contradição que ajuda a explicar por que o Brasil permanece como uma das economias mais desiguais do mundo.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/rpf-nova-republica-351-1140d.jpg" alt="Brasil democrático: conquistas e desafios em quatro décadas" />\n</figure>',
    category: "analises",
    publishedAt: "2025-04-27T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/rpf-nova-republica-351-1140-Abre.jpg",
    featuredImageAlt: "40 anos da Nova República brasileira",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "nova-republica-40-anos",
    tags: ["política", "história", "brasil", "democracia", "redemocratização"],
    metaTitle: "A Nova República chega aos 40 anos",
    metaDescription:
      "Período de redemocratização tem entre suas marcas os avanços sociais e os planos econômicos para controle da hiperinflação",
  },
  {
    title: "Costa Ribeiro descobriu fontes inesperadas de eletricidade",
    excerpt:
      "Em 1944, o engenheiro e físico carioca identificou na cera de carnaúba um fenômeno de formação de corrente elétrica usado hoje em celulares e computadores",
    content:
      '<p>Joaquim da Costa Ribeiro (1906–1960) descobriu o efeito termodielétrico em 1944 enquanto trabalhava com cera de carnaúba no laboratório do Instituto Nacional de Tecnologia, no Rio de Janeiro. O fenômeno descreve a capacidade de alguns materiais de gerarem corrente elétrica ao passarem de um estado físico para outro — de sólido para líquido, ou vice-versa. A descoberta era tão inesperada que levou anos para ser aceita pela comunidade científica internacional.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/RPF-memoria-costa-ribeiro-cachimbo-2025-04-1140.jpg" alt="Joaquim da Costa Ribeiro em seu laboratório" />\n</figure>\n\n<p>Costa Ribeiro havia chegado à cera de carnaúba após testar sistematicamente outros materiais dielétricos — parafina, naftaleno, alcatrão — em busca de fenômenos elétricos durante transições de fase. A cera de carnaúba, abundante no Nordeste brasileiro e amplamente usada na indústria de polimento, revelou o efeito de forma clara e reproduzível. A descoberta deu origem aos eletretos — materiais que mantêm carga elétrica permanente —, hoje presentes nos microfones de celulares, computadores e inúmeros outros dispositivos eletrônicos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/RPF-memoria-costa-ribeiro-aparelho-2025-04-800.jpg" alt="Aparelho utilizado por Costa Ribeiro em seus experimentos sobre o efeito termodielétrico" />\n</figure>\n\n<p>Além da descoberta científica, Costa Ribeiro foi cofundador do Centro Brasileiro de Pesquisas Físicas (CBPF) em 1949 e do Conselho Nacional de Pesquisa (CNPq) em 1951, onde atuou como primeiro diretor científico. Em 1950, os físicos americanos Workman e Reynolds publicaram resultados semelhantes, gerando uma disputa de nomenclatura: nos EUA, o fenômeno ficou conhecido como "efeito Workman-Reynolds", enquanto o restante do mundo adotou "efeito termodielétrico". Em 2024, sua neta Ana Costa Ribeiro lançou o documentário <em>Termodielétrico</em>, resgatando sua memória para o público contemporâneo.</p>',
    category: "pesquisas-brasileiras",
    publishedAt: "2025-04-15T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/04/RPF-memoria-costa-ribeiro-cachimbo-2025-04-1140.jpg",
    featuredImageAlt:
      "Joaquim da Costa Ribeiro, físico brasileiro descobridor do efeito termodielétrico",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "costa-ribeiro-efeito-termodielétrico",
    tags: ["física", "história da ciência", "eletretos", "CBPF", "CNPq"],
    metaTitle: "Costa Ribeiro descobriu fontes inesperadas de eletricidade",
    metaDescription:
      "Em 1944, o físico carioca identificou na cera de carnaúba um fenômeno de formação de corrente elétrica usado hoje em celulares e computadores",
  },
  {
    title: "Radar em drone facilita monitoramento agrícola",
    excerpt:
      "Aparelho criado por startup paulista também faz análise de solos e é capaz de localizar jazidas minerais, formigueiros e ossadas no subsolo",
    content:
      '<p>A startup Radaz, nascida na Unicamp em 2017, desenvolveu uma versão miniaturizada do radar de abertura sintética (SAR) — tecnologia antes restrita a satélites e aeronaves de grande porte — para ser acoplada em drones pequenos. O sistema opera em três bandas espectrais (C, L e P) e permite análises que vão da vegetação ao subsolo, com capacidade de detectar estruturas enterradas até 100 metros de profundidade.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-tomografo-radar-2025-03-1140.jpg" alt="Drone equipado com radar de abertura sintética desenvolvido pela startup Radaz" />\n</figure>\n\n<p>As aplicações são variadas: monitoramento de lavouras e estimativa de produtividade, localização de formigueiros e erosões no subsolo, detecção de jazidas minerais e até identificação de ossadas. O faturamento da empresa saltou de R$ 1,1 milhão em 2022 para R$ 17,3 milhões em 2024, com forte demanda internacional de países como Estados Unidos, Austrália e Emirados Árabes Unidos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-tomografosolo-2025-03-info-760-MOBILE.png" alt="Infográfico mostrando capacidade de penetração do radar SAR no subsolo agrícola" />\n</figure>\n\n<p>O equipamento custa mais de R$ 1 milhão, o que limita a adoção por pequenos produtores. Tecnologias alternativas — câmeras RGB, multiespectrais e Lidar — são mais acessíveis e estão consolidadas no mercado. Parte dos produtores rurais brasileiros ainda resiste à adoção de tecnologias de precisão, preferindo métodos tradicionais de gestão da lavoura.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-tomografo-radar-drone-2025-03-1140b.jpg" alt="Imagem de satélite comparada com imagem de radar SAR em drone sobre área agrícola" />\n</figure>',
    category: "pesquisas-brasileiras",
    publishedAt: "2025-03-26T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-tomografo-radar-2025-03-1140.jpg",
    featuredImageAlt:
      "Drone equipado com radar SAR para monitoramento agrícola",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "radar-drone-monitoramento-agricola",
    tags: [
      "tecnologia",
      "agronegócio",
      "inovação",
      "drone",
      "radar SAR",
      "Unicamp",
    ],
    metaTitle: "Radar em drone facilita monitoramento agrícola",
    metaDescription:
      "Startup paulista criou radar SAR miniaturizado para drones que analisa solos e localiza jazidas minerais, formigueiros e ossadas no subsolo",
  },
  {
    title:
      "Átomos gigantes podem ser a base de sensores quânticos mais refinados",
    excerpt:
      "Pesquisadores brasileiros encontraram evidências de uma interação quântica inédita entre átomos de Rydberg, estruturas superexcitadas mil vezes maiores que átomos normais",
    content:
      '<p>Pesquisadores brasileiros coordenados por Luis Gustavo Marcassa, do Instituto de Física de São Carlos da Universidade de São Paulo (IFSC-USP), descobriram evidências de uma interação quântica ainda não comprovada envolvendo átomos de Rydberg. Utilizando lasers e campos de micro-ondas, a equipe observou que dois átomos de rubídio podem dividir um mesmo fóton para fazer uma transição de energia — uma observação inédita, segundo Jorge Massayuki Kondo, da Universidade Federal de Santa Catarina (UFSC), que participou do estudo.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-rydberg-2025-03-info-760.png" alt="Infográfico explicando os átomos de Rydberg e suas aplicações em sensores quânticos" />\n</figure>\n\n<p>Os átomos de Rydberg são estruturas superexcitadas e gigantes — podem ser até mil vezes maiores que átomos normais no estado fundamental. Nesse estado, um elétron é excitado para um nível de energia muito alto, mas ainda permanece ligado ao átomo, fazendo-o expandir enormemente. Por serem extremamente sensíveis a campos eletromagnéticos, são promissores para o desenvolvimento de sensores quânticos em computação e telecomunicação.</p>\n\n<p>Os resultados foram publicados na revista <em>Physical Review Letters</em> e contaram com financiamento da FAPESP (R$ 145.756,68). A descoberta abre perspectivas para uma nova geração de dispositivos quânticos de alta precisão, com aplicações que vão de medições ultra-sensíveis de campos elétricos a novos protocolos de comunicação quântica.</p>',
    category: "pesquisas-brasileiras",
    publishedAt: "2025-03-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-rydberg-2025-03-info-760.png",
    featuredImageAlt:
      "Infográfico sobre átomos de Rydberg e sensores quânticos",
    status: "published",
    featured: true,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "atomos-rydberg-sensores-quanticos",
    tags: [
      "física quântica",
      "átomos de Rydberg",
      "sensores quânticos",
      "USP",
      "FAPESP",
    ],
    metaTitle:
      "Átomos gigantes podem ser a base de sensores quânticos mais refinados",
    metaDescription:
      "Pesquisadores brasileiros encontraram evidências de uma interação quântica inédita entre átomos de Rydberg, estruturas mil vezes maiores que átomos normais",
  },
  {
    title:
      "Desordenamento em estado da matéria gera novo tipo de supercondutor",
    excerpt:
      "Perturbação na fase nemática de compostos de seleneto de ferro deu origem a um terceiro mecanismo de supercondutividade, distinto dos dois tipos já conhecidos",
    content:
      '<p>Uma equipe de quatro físicos brasileiros e nove pesquisadores internacionais descobriu evidências de um terceiro mecanismo para gerar supercondutividade — a propriedade de conduzir eletricidade sem resistência. Os dois mecanismos já conhecidos são a mediação por fônons (vibrações da rede cristalina) e as interações antiferromagnéticas. O novo mecanismo envolve as chamadas flutuações nemáticas.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-supercondutividade-2025-02-ilustraabre-1140.png" alt="Ilustração artística representando o novo mecanismo de supercondutividade por flutuações nemáticas" />\n</figure>\n\n<p>Os pesquisadores descobriram que ao perturbar a fase nemática em cristais de seleneto de ferro dopados com enxofre (FeSe₁₋ₓSₓ) — resfriados a 4 Kelvin, ou cerca de −269 °C — é possível induzir supercondutividade. A fase nemática é um estado da matéria em que as moléculas estão orientadas em uma direção preferencial, sem organização posicional — o mesmo estado presente em certas telas de cristal líquido. "As flutuações nemáticas seriam o terceiro tipo de interação" que permite a formação de pares de Cooper — duplas de elétrons que conduzem corrente sem perdas — afirmou um dos coordenadores da pesquisa.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-supercondutividade-2025-02-info-760.png" alt="Infográfico sobre os três mecanismos de supercondutividade e a fase nemática" />\n</figure>\n\n<p>Os resultados foram publicados na revista <em>Nature Physics</em> em novembro de 2024. O projeto "Materiais quânticos correlacionados", financiado pela FAPESP (processo 22/15453-0), viabilizou a pesquisa do lado brasileiro. A descoberta abre perspectivas para o desenvolvimento de novos materiais supercondutores e para a compreensão das transições de fase em sistemas quânticos complexos.</p>',
    category: "noticias",
    publishedAt: "2025-02-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2025/02/RPF-supercondutividade-2025-02-ilustraabre-1140.png",
    featuredImageAlt:
      "Representação artística da supercondutividade por flutuações nemáticas",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "fase-nematica-supercondutor",
    tags: [
      "supercondutividade",
      "física quântica",
      "materiais quânticos",
      "Nature Physics",
      "FAPESP",
    ],
    metaTitle:
      "Desordenamento em estado da matéria gera novo tipo de supercondutor",
    metaDescription:
      "Perturbação na fase nemática de compostos de seleneto de ferro deu origem a um terceiro mecanismo de supercondutividade",
  },
  {
    title:
      "Fenômeno misterioso da água também pode ser produzido em sistemas quânticos",
    excerpt:
      "Efeito Mpemba — em que líquidos mais quentes congelam antes dos mais frios — foi observado teoricamente em sistemas quânticos, com potencial aplicação no resfriamento de computadores quânticos",
    content:
      '<p>O efeito Mpemba — fenômeno em que líquidos mais quentes podem congelar antes dos mais frios em determinadas condições — foi observado pela primeira vez por Aristóteles. Séculos depois, Francis Bacon e René Descartes também o descreveram. Apesar de desafiar a lei do resfriamento de Newton, o efeito permaneceu sem explicação consensual por séculos. Agora, um estudo teórico propõe uma versão quântica do fenômeno.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/10/rpf-Efeito-Mpemba-gelo-2024-11-1140.jpg" alt="Cubos de gelo ilustrando o efeito Mpemba, em que líquidos mais quentes congelam antes dos mais frios" />\n</figure>\n\n<p>A pesquisa, publicada na <em>Physical Review Letters</em>, foi liderada por Krissia Zawadzki, do Instituto de Física de São Carlos da Universidade de São Paulo (IFSC-USP), em colaboração com uma equipe do Trinity College Dublin. O estudo sugere que, em sistemas quânticos, "um estado inicial com maior desequilíbrio atinge o equilíbrio mais rapidamente" do que estados menos perturbados — uma analogia quântica direta do efeito Mpemba clássico.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/10/rpf-Efeito-Mpemba-agua-2024-11-1140.jpg" alt="Água em diferentes estados de temperatura ilustrando o paradoxo do efeito Mpemba em sistemas quânticos" />\n</figure>\n\n<p>As implicações práticas são significativas: o fenômeno pode ser explorado para o resfriamento mais eficiente de computadores quânticos — um dos maiores desafios técnicos da computação quântica — e para o desenvolvimento de baterias quânticas com ciclos de carregamento mais rápidos. A pesquisa representa um avanço na compreensão dos princípios fundamentais da termodinâmica quântica.</p>',
    category: "noticias",
    publishedAt: "2024-11-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2024/10/rpf-Efeito-Mpemba-gelo-2024-11-1140.jpg",
    featuredImageAlt: "Cubos de gelo ilustrando o efeito Mpemba",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "efeito-mpemba-sistemas-quanticos",
    tags: [
      "física quântica",
      "efeito Mpemba",
      "computação quântica",
      "termodinâmica",
      "USP",
    ],
    metaTitle:
      "Fenômeno misterioso da água também pode ser produzido em sistemas quânticos",
    metaDescription:
      "Efeito Mpemba, em que líquidos mais quentes congelam antes dos mais frios, foi observado em sistemas quânticos com aplicações em computação quântica",
  },
  {
    title:
      "Estudo aponta que 25 dos 35 sinais vitais da Terra estão em estado crítico",
    excerpt:
      "Pesquisa anual publicada em BioScience monitora 35 indicadores planetários e constata que 25 deles atingiram níveis recordes de deterioração em 2024",
    content:
      '<p>A análise anual coordenada pelo ecólogo William Ripple, da Universidade Estadual do Oregon, publicada em <em>BioScience</em> em 8 de outubro de 2024, constatou que 25 dos 35 indicadores do estado do planeta atingiram níveis recordes de deterioração — aumento em relação aos 20 indicadores críticos reportados em 2023. A concentração atmosférica de dióxido de carbono ultrapassou 420 partes por milhão (ppm), o que representa 50% acima dos níveis pré-industriais.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/11/RPF-sinais-vitais-enchente-espanha-2024-12-800b.jpg" alt="Rua de Valência, Espanha, devastada pelas enchentes de outubro de 2024, que mataram mais de 200 pessoas" />\n  <figcaption>Rua de Valência, Espanha, após as enchentes de outubro de 2024, que mataram mais de 200 pessoas</figcaption>\n</figure>\n\n<p>Entre os indicadores em estado crítico estão: temperaturas médias globais em níveis históricos; aumento da acidez oceânica; degelo acelerado na Groenlândia e na Antártida; perda de biodiversidade; e um aumento de 1,5% no consumo de combustíveis fósseis em 2023. As enchentes que devastaram Valência, Espanha, em outubro de 2024, matando mais de 200 pessoas, exemplificam concretamente os extremos climáticos previstos pelos modelos científicos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/11/RPF-sinaisvitais-2024-12-info-760-MOBILE-1.png" alt="Infográfico com os 35 sinais vitais da Terra e seu estado atual" />\n</figure>\n\n<p>Pesquisadores brasileiros como Cássio Cardoso Pereira (UFMG), Mauro Galetti (Unesp) e Philip Fearnside (Inpa) comentaram as consequências ecológicas e climáticas para o Brasil, destacando o papel central da Amazônia como reguladora do clima global e alertando para os riscos dos pontos de inflexão irreversíveis — as chamadas <em>tipping points</em> — no sistema climático terrestre.</p>',
    category: "analises",
    publishedAt: "2024-12-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2024/11/RPF-sinais-vitais-enchente-espanha-2024-12-800b.jpg",
    featuredImageAlt: "Enchentes em Valência, Espanha, outubro de 2024",
    status: "published",
    featured: true,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "sinais-vitais-terra-estado-critico",
    tags: [
      "mudanças climáticas",
      "crise ambiental",
      "CO2",
      "biodiversidade",
      "aquecimento global",
    ],
    metaTitle:
      "Estudo aponta que 25 dos 35 sinais vitais da Terra estão em estado crítico",
    metaDescription:
      "Pesquisa anual em BioScience constata que 25 dos 35 indicadores planetários atingiram níveis recordes de deterioração em 2024",
  },
  {
    title: "Cerveja gelada por mais tempo",
    excerpt:
      "Engenheiro mecânico modelou matematicamente o copo ideal para retardar o aquecimento de bebidas e concluiu que a circunferência deve aumentar progressivamente da base para a boca",
    content:
      '<p>O engenheiro mecânico Cláudio Pellegrini, da Universidade Federal de São João del-Rei, aplicou princípios de mecânica dos fluidos para determinar a forma ideal de um copo de cerveja — aquela que mantém a bebida gelada por mais tempo durante o consumo. Sua modelagem matemática chegou a uma conclusão contraintuitiva: "a circunferência do copo deve aumentar progressivamente da base para a boca", seguindo uma função matemática monotônica crescente.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/rpf_copo-cerveja-2024-12-800jpg.jpg" alt="Desenho do copo ideal para manter a cerveja gelada por mais tempo, com formato de corneta e base estreita" />\n  <figcaption>Desenho do copo ideal: base estreita e boca alargada no formato de corneta reduz a troca de calor com o ambiente</figcaption>\n</figure>\n\n<p>O princípio físico por trás do resultado é simples: a troca de calor entre a bebida e o ambiente ocorre principalmente na superfície de contato. Um copo com base estreita mantém a cerveja por mais tempo na região de menor diâmetro — onde a área de contato com o calor externo é menor. O formato ideal lembra uma corneta ou trompete, com base muito estreita e boca progressivamente alargada.</p>\n\n<p>As tulipas brasileiras tradicionais, com barriga saliente e base relativamente larga, são subótimas para esse objetivo. O copo estilo pilsen — cilíndrico com leve alargamento superior — é o modelo comercial que mais se aproxima do ideal calculado. A pesquisa demonstra como conhecimentos consolidados de física podem ser aplicados para resolver desafios práticos do cotidiano — ainda que o resultado dependa também da temperatura ambiente, da espessura do vidro e da quantidade de cerveja servida.</p>',
    category: "noticias",
    publishedAt: "2025-01-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/rpf_copo-cerveja-2024-12-800jpg.jpg",
    featuredImageAlt:
      "Copo de formato ideal para manter a cerveja gelada por mais tempo",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "cerveja-gelada-mais-tempo",
    tags: [
      "física aplicada",
      "termodinâmica",
      "design",
      "engenharia",
      "pesquisa brasileira",
    ],
    metaTitle: "Cerveja gelada por mais tempo",
    metaDescription:
      "Engenheiro mecânico modelou matematicamente o copo ideal para retardar o aquecimento de bebidas",
  },
  {
    title: "Um motor da ciência brasileira",
    excerpt:
      "Rogério Cezar de Cerqueira Leite (1931–2024) foi peça fundamental na criação do síncrotron Sirius, do LNLS e da Ilum, e colaborou por mais de quatro décadas com a Folha de S.Paulo",
    content:
      '<p>O físico e engenheiro elétrico Rogério Cezar de Cerqueira Leite (1931–2024) morreu em 1º de dezembro de 2024, aos 93 anos. Sua trajetória representa um dos mais importantes legados para a ciência e a tecnologia brasileiras do século XX e XXI. Formado em engenharia elétrica pela Escola Politécnica da USP e doutor em física pelo MIT, trabalhou nos laboratórios Bell Labs de 1962 a 1970, onde publicou pesquisas em física do estado sólido e espectroscopia Raman.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-obituario_-cerqueira-leite-2025-01-800.jpg" alt="O físico Cerqueira Leite em sua casa em Campinas, em 2017" />\n  <figcaption>O físico Cerqueira Leite em sua casa em Campinas (2017). Foto: Keiny Andrade/Folhapress</figcaption>\n</figure>\n\n<p>Cerqueira Leite foi peça fundamental na criação de algumas das mais importantes infraestruturas científicas do Brasil. Presidiu o conselho administrativo do CNPEM (Centro Nacional de Pesquisa em Energia e Materiais), que supervisiona o síncrotron Sirius — o maior acelerador de partículas do hemisfério sul. Liderou o desenvolvimento do Laboratório Nacional de Luz Síncrotron (LNLS), inaugurado em 1997, e fundou a Ilum, instituição de ciência interdisciplinar inaugurada em 2022. Também criou a Codetec e a Ciatec, incubadoras de tecnologia em Campinas.</p>\n\n<p>Publicou 80 artigos científicos revisados por pares, com mais de 3.000 citações, e foi autor de 15 livros. Colaborou regularmente com o conselho editorial da <em>Folha de S.Paulo</em> de 1978 a 2021 — mais de quatro décadas de divulgação científica para o grande público. Defendia investimentos concentrados em pesquisa de grande escala e a autonomia tecnológica do Brasil, acreditando que o país precisava de instituições robustas e duradouras, não de projetos fragmentados.</p>',
    category: "analises",
    publishedAt: "2025-01-06T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-obituario_-cerqueira-leite-2025-01-800.jpg",
    featuredImageAlt:
      "Rogério Cezar de Cerqueira Leite, físico brasileiro, em sua casa em Campinas em 2017",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "motor-ciencia-brasileira-cerqueira-leite",
    tags: [
      "física",
      "síncrotron",
      "LNLS",
      "Sirius",
      "CNPEM",
      "história da ciência",
      "Brasil",
    ],
    metaTitle:
      "Um motor da ciência brasileira: Rogério Cezar de Cerqueira Leite",
    metaDescription:
      "Cerqueira Leite foi peça fundamental na criação do síncrotron Sirius, do LNLS e da Ilum, e publicou 80 artigos com mais de 3.000 citações",
  },
  {
    title: "Austregésilo Lima, à sombra de Freud",
    excerpt:
      "O neurologista pernambucano Antônio Austregésilo Rodrigues Lima (1876–1960) desenvolveu uma teoria psicológica alternativa a Freud e pioneirou a terapia por diálogo no Brasil",
    content:
      '<p>Antônio Austregésilo Rodrigues Lima (1876–1960) foi um dos mais importantes neurologistas e psiquiatras brasileiros do início do século XX — e um dos poucos a desafiar abertamente a hegemonia de Freud na teoria psicológica da época. Nascido no Recife, formou-se em medicina no Rio de Janeiro e tornou-se professor de neurologia na Faculdade Nacional de Medicina.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-memoria-austregesilo-histeria-2025-01-1140.jpg" alt="A Lição Clínica na Salpêtrière, pintura de André Brouillet (1887) mostrando Jean-Martin Charcot demonstrando a histeria" />\n  <figcaption>"A Lição Clínica na Salpêtrière" (1887), pintura de André Brouillet mostrando Charcot demonstrando histeria — fenômeno central na obra de Austregésilo</figcaption>\n</figure>\n\n<p>Austregésilo propôs uma estrutura psicológica alternativa baseada em três elementos: <em>fames</em> (necessidades básicas de sobrevivência), libido e ego. Diferentemente de Freud, entendia que a libido era apenas um dos impulsos humanos, não o motor central de toda a psique. Refiniu o diagnóstico de histeria, distinguindo-a de pseudo-histeria e de outras condições. Desenvolveu o sinal de Austregésilo-Esposel, indicador neurológico diagnóstico ainda em uso. Publicou extensamente sobre sexualidade e defendeu a educação sexual nas escolas numa época de grande conservadorismo.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-memoria-austregesilo-fardao-2025-01-800.jpg" alt="Austregésilo Lima com o fardão da Academia Brasileira de Letras, para a qual foi eleito em 1914" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-memoria-austregesilo-juliano-moreira-2025-01-800.jpg" alt="Juliano Moreira, diretor do Hospital Nacional de Alienados (1903–1930), colaborador de Austregésilo" />\n</figure>\n\n<p>Austregésilo colaborou com o psiquiatra Juliano Moreira no Hospital Nacional de Alienados — o primeiro hospital psiquiátrico do Brasil. Em 1914, foi eleito para a Academia Brasileira de Letras. Suas abordagens terapêuticas baseadas em diálogo com os pacientes anteciparam o que hoje chamamos de terapias cognitivo-comportamentais — uma visão revolucionária em um contexto onde a psiquiatria ainda recorria amplamente à internação e a tratamentos invasivos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-memoria-austregesilo-hospital-nacional-alienados-2025-01-1140.jpg" alt="Hospital Nacional de Alienados, inaugurado entre 1859 e 1861, primeiro hospital psiquiátrico do Brasil" />\n</figure>',
    category: "analises",
    publishedAt: "2025-01-05T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2024/12/RPF-memoria-austregesilo-histeria-2025-01-1140.jpg",
    featuredImageAlt:
      "A Lição Clínica na Salpêtrière, pintura de André Brouillet, 1887",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "austregesilo-lima-sombra-freud",
    tags: [
      "psiquiatria",
      "neurologia",
      "história da medicina",
      "Brasil",
      "Freud",
      "histeria",
    ],
    metaTitle: "Austregésilo Lima, à sombra de Freud",
    metaDescription:
      "O neurologista pernambucano Antônio Austregésilo Lima desenvolveu uma teoria psicológica alternativa a Freud e pioneirou a terapia por diálogo no Brasil",
  },
  {
    title: "O céu visto das Missões",
    excerpt:
      "O jesuíta Buenaventura Suárez (1679–1750) construiu seus próprios telescópios com artesãos guaranis e fez 147 observações dos satélites de Júpiter, publicando na Royal Society",
    content:
      '<p>No coração das Missões guaraníticas do século XVIII, o jesuíta Buenaventura Suárez (1679–1750) realizou um feito notável: sem os instrumentos fornecidos pela ordem jesuíta espanhola, construiu seus próprios telescópios com a ajuda de artesãos indígenas guaranis e produziu observações astronômicas de precisão surpreendente para a época.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/05/RPF-memoria-igreja-sao-miguel-arcanjo-2023-05-site-1140.jpg" alt="Desenho das ruínas da Igreja de São Miguel Arcanjo, nas Missões Guaraníticas, feito por Alfred Demersay em 1846" />\n  <figcaption>Desenho das ruínas da Igreja de São Miguel Arcanjo, nas Missões Guaraníticas, feito por Alfred Demersay em 1846</figcaption>\n</figure>\n\n<p>Com um telescópio refrator de 3 metros de comprimento — construído nas próprias missões — Suárez realizou 147 observações sistemáticas dos quatro maiores satélites de Júpiter ao longo de 13 anos. Registrou com precisão eclipses lunares e solares e determinou as coordenadas de longitude de todas as 30 missões guaraníticas usando dados dos satélites galileanos. Seus resultados foram publicados nas <em>Philosophical Transactions</em> da Royal Society entre 1749 e 1750, colocando-o em correspondência com cientistas como Anders Celsius, Pehr Wilhelm Wargentin e Jacob de Castro Sarmento.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/05/RPF-memoria-buenaventura-2023-05-site-1140.jpg" alt="Ilustração anônima de Buenaventura Suárez, astrônomo jesuíta das Missões Guaraníticas" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/05/RPF-memoria-jesuita-mapa-Cardiel-2023-05-site-800.jpg" alt="Mapa de 1768 das Missões Guaraníticas com os dados de Suárez" />\n  <figcaption>Mapa de 1768 das Missões Guaraníticas com dados astronômicos levantados por Suárez</figcaption>\n</figure>\n\n<p>Em 1740, Suárez publicou o <em>Lunario de un siglo</em>, obra que previa eclipses e fases da lua para um século inteiro. O relógio de sol que construiu em São Cosme ainda existe e é considerado um dos mais antigos objetos científicos preservados na América do Sul.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/05/RPF-memoria-lunario-2-2023-05-site-1140.jpg" alt="Tabelas do Lunario de un siglo, de Buenaventura Suárez, com previsões astronômicas para 1740 a 1841" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/05/RPF-memoria-relogio-2023-05-site-1140.jpg" alt="Relógio de sol construído por Buenaventura Suárez em São Cosme, considerado um dos mais antigos da América do Sul" />\n</figure>',
    category: "analises",
    publishedAt: "2023-05-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/05/RPF-memoria-igreja-sao-miguel-arcanjo-2023-05-site-1140.jpg",
    featuredImageAlt:
      "Ruínas da Igreja de São Miguel Arcanjo nas Missões Guaraníticas",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "ceu-visto-missoes",
    tags: [
      "astronomia",
      "história da ciência",
      "jesuítas",
      "missões guaraníticas",
      "Royal Society",
    ],
    metaTitle: "O céu visto das Missões",
    metaDescription:
      "O jesuíta Buenaventura Suárez construiu telescópios com artesãos guaranis e fez 147 observações dos satélites de Júpiter, publicando na Royal Society",
  },
  {
    title: "As raízes da fome",
    excerpt:
      "Josué de Castro (1908–1973) foi pioneiro ao identificar a fome como fenômeno estrutural, enraizado em desigualdades econômicas e sociais, não em escassez natural",
    content:
      '<p>Quase 50 anos após a morte do médico pernambucano Josué de Castro (1908–1973), o Brasil voltou ao Mapa da Fome da ONU em 2022, com 33 milhões de pessoas em situação de insegurança alimentar grave. A obra de Castro — que distinguiu a fome endêmica da fome epidêmica e identificou suas raízes econômicas e sociais — permanece mais atual do que nunca.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-josue-de-castro-retrato-1963-2023-02-site-700.jpg" alt="Retrato de Josué de Castro em 1963" />\n  <figcaption>Josué de Castro em 1963, médico e geógrafo pernambucano que revelou as raízes econômicas da fome</figcaption>\n</figure>\n\n<p>Em 1946, Castro publicou <em>Geografia da fome</em>, obra que dividiu o Brasil em cinco regiões com padrões alimentares e deficiências nutricionais distintos. O livro tornou-se referência internacional, traduzido para mais de 25 idiomas. Nele, Castro identificou a monocultura e a concentração fundiária como causas centrais da desnutrição nordestina — uma análise que desafiava a visão dominante de que a fome era resultado inevitável da superpopulação ou da escassez de recursos naturais.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-josue-de-castro-mapa-carencias-2023-02-site-1140.jpg" alt="Mapas de \'Geografia da Fome\' mostrando a situação alimentar do Brasil no fim dos anos 1940" />\n  <figcaption>Mapas de <em>Geografia da Fome</em> mostrando a situação alimentar do Brasil no fim dos anos 1940</figcaption>\n</figure>\n\n<p>Castro estudou as condições alimentares internacionalmente na década de 1940 e publicou <em>Geopolítica da fome</em> em 1951. Presidiu o Conselho Executivo da FAO entre 1952 e 1956 e foi eleito deputado federal por Pernambuco em 1954. Com o golpe militar de 1964, foi exilado para a França, onde fundou o Centro Internacional de Desenvolvimento até sua morte em 1973.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-josue-de-castro-estados-unidos-2023-02-site-800.jpg" alt="Josué de Castro em viagem de estudos aos Estados Unidos em 1943" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-josue-de-castro-mangue-2023-02-site-1140.jpg" alt="Área de mangue no Recife em 1967" />\n</figure>',
    category: "analises",
    publishedAt: "2023-02-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-josue-de-castro-retrato-1963-2023-02-site-700.jpg",
    featuredImageAlt: "Josué de Castro em 1963, médico e geógrafo pernambucano",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "raizes-da-fome",
    tags: [
      "segurança alimentar",
      "fome",
      "história",
      "desigualdade",
      "Brasil",
      "FAO",
    ],
    metaTitle: "As raízes da fome",
    metaDescription:
      "Josué de Castro foi pioneiro ao identificar a fome como fenômeno estrutural, enraizado em desigualdades econômicas, não em escassez natural",
  },
  {
    title: "A grande dama da botânica",
    excerpt:
      "Graziela Maciel Barroso (1912–2003) identificou 11 novos gêneros e 132 novas espécies de plantas, formou centenas de pesquisadores e foi a primeira mulher a fazer concurso no Jardim Botânico do Rio",
    content:
      '<p>Graziela Maciel Barroso (1912–2003) é considerada a maior botânica brasileira do século XX. Nascida em Corumbá, Mato Grosso do Sul, ela percorreu um caminho extraordinário que desafiou as limitações impostas às mulheres de sua época, tornando-se um pilar da botânica nacional.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/06/RPF-memoria-graziela-2023-06-site-00-1140.jpg" alt="Graziela Barroso plantando uma árvore no Jardim Botânico do Rio de Janeiro com colegas e o botânico catalão padre Raulino Reitz" />\n  <figcaption>Graziela Barroso plantando uma árvore no Jardim Botânico do Rio de Janeiro</figcaption>\n</figure>\n\n<p>Graziela começou a se dedicar à botânica aos 30 anos. Em 1946, tornou-se a primeira mulher a fazer concurso público no Jardim Botânico do Rio de Janeiro. Obteve sua graduação em biologia aos 47 anos e o doutorado aos 61. Ao longo de sua carreira, identificou 11 novos gêneros vegetais e descreveu 132 novas espécies de plantas, publicou 65 artigos científicos e escreveu textos fundamentais sobre sistemática vegetal — ainda utilizados em universidades brasileiras.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/06/RPF-memoria-graziela-2023-06-site-01-800.jpg" alt="Graziela Barroso no campus da UnB em 1967" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/06/RPF-memoria-graziela-2023-06-site-02-1140.jpg" alt="Graziela Barroso em expedição de coleta de plantas no Sul do Brasil em 1964" />\n</figure>\n\n<p>Quatro gêneros e 83 espécies de plantas foram batizados em sua homenagem. Em 1999, recebeu o Prêmio Milênio em Botânica. Formou centenas de pesquisadores em todo o país e insistia que seus alunos observassem as plantas com atenção: "Até a menor flor tem características admiráveis. Coloque-a sob a lupa e você vai ver como ela é maravilhosa." Continuou pesquisando e orientando até os 90 anos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/06/RPF-memoria-graziela-2023-06-site-05-1140.jpg" alt="Duas espécies de plantas batizadas em homenagem a Graziela Barroso: Aspilia grazielae e Philodendron grazielae" />\n  <figcaption>Espécies batizadas em sua homenagem: <em>Aspilia grazielae</em> e <em>Philodendron grazielae</em></figcaption>\n</figure>',
    category: "analises",
    publishedAt: "2023-06-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/06/RPF-memoria-graziela-2023-06-site-00-1140.jpg",
    featuredImageAlt:
      "Graziela Maciel Barroso no Jardim Botânico do Rio de Janeiro",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "grande-dama-botanica",
    tags: [
      "botânica",
      "mulheres na ciência",
      "biodiversidade",
      "história da ciência",
      "Jardim Botânico",
    ],
    metaTitle: "A grande dama da botânica",
    metaDescription:
      "Graziela Barroso identificou 132 novas espécies de plantas, formou centenas de pesquisadores e foi a primeira mulher a fazer concurso no Jardim Botânico do Rio",
  },
  {
    title: "O rebelde da ciência",
    excerpt:
      "Maurício Oscar da Rocha e Silva (1910–1983) descobriu a bradicinina em 1947 ao estudar veneno de cobra, abrindo caminho para o captopril e desafiando o provincianismo científico brasileiro",
    content:
      '<p>Em dezembro de 1947, enquanto pesquisava os efeitos do veneno de jararaca no Instituto Biológico de São Paulo, o farmacologista Maurício Oscar da Rocha e Silva (1910–1983), com seus colaboradores Wilson Beraldo e Gastão Rosenfeld, identificou a bradicinina — uma substância que dilata vasos sanguíneos e reduz a pressão arterial. A descoberta nasceu de forma inesperada: o veneno provocava uma queda de pressão que os mecanismos conhecidos da época não explicavam.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-rocha-e-silva-laboratorio-2023-01-1140.jpg" alt="Maurício Oscar da Rocha e Silva em seu laboratório no Instituto Biológico, década de 1940" />\n  <figcaption>Rocha e Silva em seu laboratório no Instituto Biológico, década de 1940</figcaption>\n</figure>\n\n<p>A descoberta da bradicinina abriu caminho para o desenvolvimento do captopril em 1977 — um dos medicamentos anti-hipertensivos mais utilizados no mundo até hoje. Rocha e Silva era conhecido por criticar o "provincianismo científico" brasileiro e as hierarquias acadêmicas rígidas. Recusava-se a aceitar um papel subordinado na ciência global e lutava por um Brasil que contribuísse com pesquisa original de nível internacional.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-rocha-e-silva-instituto-biologico-2023-01-1140.jpg" alt="Rocha e Silva (o quarto da esquerda para a direita) com outros pesquisadores do Instituto Biológico, década de 1950" />\n  <figcaption>Rocha e Silva (quarto da esquerda) com pesquisadores do Instituto Biológico, década de 1950</figcaption>\n</figure>\n\n<p>Em 1948, foi um dos fundadores da Sociedade Brasileira para o Progresso da Ciência (SBPC). Nos últimos anos de vida, dedicou-se à filosofia da ciência, defendendo que o conhecimento científico deveria ser acessível a todos. Publicou <em>Diálogo sobre a lógica da ciência</em> em 1968.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-rocha-e-silva-discurso-2023-01-1140.jpg" alt="Rocha e Silva em pé, lendo um discurso na 22ª Reunião Anual da SBPC, em Salvador, Bahia, 1970" />\n  <figcaption>Rocha e Silva na 22ª Reunião Anual da SBPC, Salvador, Bahia, 1970</figcaption>\n</figure>',
    category: "pesquisas-brasileiras",
    publishedAt: "2023-01-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/01/RPF-memoria-rocha-e-silva-laboratorio-2023-01-1140.jpg",
    featuredImageAlt:
      "Maurício Oscar da Rocha e Silva em laboratório no Instituto Biológico, anos 1940",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "rebelde-da-ciencia",
    tags: [
      "farmacologia",
      "bradicinina",
      "captopril",
      "história da ciência",
      "SBPC",
      "Brasil",
    ],
    metaTitle: "O rebelde da ciência",
    metaDescription:
      "Maurício Rocha e Silva descobriu a bradicinina em 1947 estudando veneno de cobra, abrindo caminho para o captopril e combatendo o provincianismo científico",
  },
  {
    title: "O físico que construía pontes",
    excerpt:
      "Nascido em Danzig e exilado pelo nazismo, Jean Meyer tornou-se pioneiro em energia alternativa e física de partículas no Brasil, atuando na Unicamp, no CERN e na FAPESP",
    content:
      '<p>A história de Jean Meyer (1925–2010) — nascido Hans Albert em Danzig, hoje Gdańsk — é a história de um refugiado que se tornou um dos mais importantes físicos do Brasil. Fugindo da perseguição nazista com sua família para a França em 1935 e depois para o Brasil em 1940, construiu uma carreira extraordinária que atravessou continentes.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/04/RPF-memoria-meyer-retrato-cachimbo-2023-04-site-1140.jpg" alt="Jean Meyer aos 40 anos na França, com seu característico cachimbo" />\n  <figcaption>Jean Meyer aos 40 anos na França</figcaption>\n</figure>\n\n<p>Meyer entrou no universo da física sem o diploma formal exigido pelas universidades. Foi a intervenção de Gleb Wataghin, o grande impulsionador da física brasileira, que abriu as portas da USP para o jovem refugiado. Depois de 13 anos no centro de pesquisa nuclear de Saclay, na França, e 6,5 anos no CERN em Genebra, retornou ao Brasil. Na Unicamp, nos anos 1970, liderou pesquisas pioneiras em energia alternativa, incluindo secagem solar de grãos e um veículo híbrido diesel-hidrogênio.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/04/RPF-memoria-meyer-cern-2023-04-site-1140.jpg" alt="Câmara de bolhas desenvolvida no Saclay/CERN nos anos 1960, área em que Jean Meyer trabalhou" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/04/RPF-memoria-meyer-unicamp-2023-04-site-1140.jpg" alt="Jean Meyer na Unicamp em 1975, liderando pesquisas em energia alternativa" />\n</figure>\n\n<p>Meyer atuou como diretor da FAPESP de 1976 a 1980 e facilitou a importação de equipamentos para o laboratório síncrotron LNLS, conectando cientistas brasileiros com o diretor do CERN Carlo Rubbia. Sua vida exemplifica como refugiados podem enriquecer a ciência dos países que os acolhem.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/04/RPF-memoria-meyer-sincroton-2023-04-site-1140.jpg" alt="Jean Meyer e Roberto Salmeron no Síncrotron em 1990" />\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/04/RPF-memoria-meyer-carro-hibrido-2023-04-site-1140.jpg" alt="Protótipo de veículo híbrido desenvolvido por Meyer e equipe, apresentado no Salão do Automóvel de 1995" />\n  <figcaption>Protótipo de veículo híbrido no Salão do Automóvel de 1995</figcaption>\n</figure>',
    category: "analises",
    publishedAt: "2023-04-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/04/RPF-memoria-meyer-retrato-cachimbo-2023-04-site-1140.jpg",
    featuredImageAlt:
      "Jean Meyer, físico brasileiro nascido em Danzig, aos 40 anos na França",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "fisico-que-construia-pontes",
    tags: [
      "física",
      "energia alternativa",
      "história da ciência",
      "CERN",
      "Unicamp",
      "FAPESP",
      "exílio",
    ],
    metaTitle: "O físico que construía pontes",
    metaDescription:
      "Jean Meyer, exilado pelo nazismo, tornou-se pioneiro em energia alternativa no Brasil, atuando na Unicamp, no CERN e na FAPESP",
  },
  {
    title: "As primeiras trilhas do estudo do comportamento animal no Brasil",
    excerpt:
      "Walter Hugo de Andrade Cunha (1929–2022) fundou a etologia como disciplina formal no Brasil ao observar o comportamento de formigas loucas e criou o primeiro laboratório de psicologia comparada da USP",
    content:
      '<p>Walter Hugo de Andrade Cunha (1929–2022) foi o pioneiro que estabeleceu as bases do estudo científico do comportamento animal no Brasil. Sua trajetória começou com uma observação aparentemente simples: o comportamento das formigas loucas (<em>Nylanderia fulva</em>) ao encontrar uma companheira esmagada. Cunha descreveu como algumas "voltavam ao ninho, tremendo e desorientadas, enquanto outras reduziam o passo e desviavam da trilha em marcha ondulatória" — reações que ele sistematizou como respostas comportamentais a estímulos químicos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2022/11/RPF-Obituario-Walter-Cunha-2022-11-site-00-1140.jpg" alt="Walter Hugo de Andrade Cunha em 2015, fundador da etologia como disciplina formal no Brasil" />\n  <figcaption>Walter Cunha em 2015</figcaption>\n</figure>\n\n<p>Cunha fundou o Laboratório de Psicologia Comparada da USP e criou o primeiro programa de pós-graduação em etologia e comportamento animal do Brasil. Sua visão da etologia como disciplina que dialoga com psicologia, neurociência e ecologia — e que só pode ser compreendida em seu contexto evolutivo — é hoje considerada fundacional para a biologia comportamental moderna.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2022/11/RPF-Obituario-Walter-Cunha-Nylanderia-2022-11-site-01-1140.jpg" alt="Exemplar de Nylanderia fulva, a formiga louca cujo comportamento levou Cunha a fundar a etologia no Brasil" />\n  <figcaption>Exemplar de <em>Nylanderia fulva</em>, a formiga louca que despertou a vocação de Cunha para a etologia. Foto: Jesse Rorabaugh</figcaption>\n</figure>\n\n<p>Entre seus orientados estão nomes como César Ades, que se tornou referência nacional em comportamento animal, e Vera Lúcia Imperatriz Fonseca. Cunha influenciou também o neurocientista Gilberto Fernando Xavier. Antes da biologia, havia estudado filosofia e foi particularmente marcado por Schopenhauer — uma influência que transparece em sua visão dos comportamentos animais como expressões de impulsos profundos.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2022/11/RPF-Obituario-Walter-Cunha-2022-11-site-02-800.jpg" alt="Walter Cunha na formatura da USP em 1953" />\n  <figcaption>Walter Cunha na formatura da USP em 1953</figcaption>\n</figure>',
    category: "analises",
    publishedAt: "2022-11-18T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2022/11/RPF-Obituario-Walter-Cunha-2022-11-site-00-1140.jpg",
    featuredImageAlt: "Walter Hugo de Andrade Cunha em 2015",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "primeiras-trilhas-comportamento-animal",
    tags: [
      "etologia",
      "comportamento animal",
      "USP",
      "história da ciência",
      "biologia",
      "zoologia",
    ],
    metaTitle:
      "As primeiras trilhas do estudo do comportamento animal no Brasil",
    metaDescription:
      "Walter Cunha fundou a etologia como disciplina formal no Brasil ao observar o comportamento de formigas loucas e criou o primeiro laboratório de psicologia comparada da USP",
  },
  {
    title: "Tensões geopolíticas aumentam gastos militares",
    excerpt:
      "Pela primeira vez na história, os gastos militares globais ultrapassaram US$ 2 trilhões em 2021, com EUA e China respondendo por 52% do total",
    content:
      '<p>O Instituto Internacional de Pesquisa para a Paz de Estocolmo (Sipri) divulgou dados revelando que os gastos militares globais superaram US$ 2 trilhões em 2021 pela primeira vez na história — um aumento de 0,7% em termos reais comparado ao ano anterior. Ao longo de 25 anos, os gastos militares dobraram: eram de US$ 1,06 trilhão em 1996.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2022/05/SITE_316_GastosMilitares-0-1140.jpg" alt="Tanque norte-americano; o orçamento militar dos EUA representa a maior fatia dos gastos militares globais" />\n  <figcaption>Tanque norte-americano; os EUA respondem por 38% dos gastos militares globais</figcaption>\n</figure>\n\n<p>Os Estados Unidos respondem por 38% de todo o gasto militar mundial, e junto com a China representam 52% das despesas globais de defesa. A Europa elevou seus orçamentos de defesa em 4,8% em 2021 — o sétimo ano consecutivo de crescimento —, reflexo direto das tensões com a Rússia desde a anexação da Crimeia em 2014. Um dado revelador: os EUA aumentaram os gastos militares em pesquisa e desenvolvimento em 24% desde 2012, enquanto as compras de armamentos caíram 6,4% — indicando a priorização de tecnologias emergentes como inteligência artificial, drones e guerra cibernética.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2022/05/SITE_316_GastosMilitares-1-1140.jpg" alt="Sistema de defesa aérea japonês; o Japão ocupou o 9º lugar nos gastos militares globais em 2021" />\n  <figcaption>Sistema de defesa aérea japonês; o Japão foi o 9º maior gasto militar em 2021</figcaption>\n</figure>\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2022/05/SITE_316_GastosMilitares-2-1140.jpg" alt="Mísseis terra-ar em Moscou; a Rússia investiu 4% do PIB em defesa em 2021" />\n  <figcaption>Mísseis terra-ar em Moscou; a Rússia investiu 4% do PIB em defesa em 2021</figcaption>\n</figure>',
    category: "analises",
    publishedAt: "2022-05-20T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2022/05/SITE_316_GastosMilitares-0-1140.jpg",
    featuredImageAlt: "Tanque norte-americano em exercício militar",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "tensoes-geopoliticas-gastos-militares",
    tags: [
      "geopolítica",
      "defesa",
      "gastos militares",
      "EUA",
      "China",
      "OTAN",
      "Sipri",
    ],
    metaTitle: "Tensões geopolíticas aumentam gastos militares",
    metaDescription:
      "Pela primeira vez, gastos militares globais ultrapassaram US$ 2 trilhões em 2021, com EUA e China respondendo por 52% do total",
  },
  {
    title: "Ciência, atividade coletiva",
    excerpt:
      "O parasitologista Erney Plessmann de Camargo (1935–2023) dedicou décadas ao combate à doença de Chagas e à malária, e presidiu o CNPq de 2003 a 2007",
    content:
      '<p>O parasitologista Erney Plessmann de Camargo (1935–2023) morreu em 3 de março de 2023, aos 87 anos. Reconhecido internacionalmente por seu trabalho no estudo de parasitas causadores de doenças tropicais, ele via a ciência como "uma atividade coletiva" voltada ao benefício da sociedade — não como uma carreira individual.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/03/RPF-Erney-Plessmann-site-800.jpg" alt="O parasitologista Erney Plessmann de Camargo" />\n  <figcaption>O parasitologista Erney Plessmann de Camargo. Foto: Eduardo Cesar/Pesquisa FAPESP</figcaption>\n</figure>\n\n<p>Em 1964, Camargo desenvolveu um meio de cultura eficiente para o <em>Trypanosoma cruzi</em>, parasita causador da doença de Chagas — um avanço que facilitou décadas de pesquisa sobre a doença. Depois do golpe militar, quando o Departamento de Parasitologia da USP foi desmantelado, ele liderou a reconstrução da área. Coordenou pesquisas de combate à malária e à doença de Chagas na Amazônia e na África, contribuindo para o desenvolvimento de estratégias de controle dessas doenças que afetam principalmente populações vulneráveis.</p>\n\n<p>Presidiu o CNPq de 2003 a 2007 e dirigiu o Instituto Butantan de 2002 a 2003. Durante sua gestão no CNPq, estabeleceu plataformas de pesquisa que permanecem como infraestrutura estratégica para a ciência brasileira. Teve quatro filhos, todos cientistas — um legado que ele considerava tão significativo quanto sua obra científica.</p>',
    category: "analises",
    publishedAt: "2023-04-01T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/03/RPF-Erney-Plessmann-site-800.jpg",
    featuredImageAlt: "O parasitologista Erney Plessmann de Camargo",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "ciencia-atividade-coletiva",
    tags: [
      "parasitologia",
      "doença de Chagas",
      "malária",
      "saúde pública",
      "CNPq",
      "Brasil",
    ],
    metaTitle:
      "Ciência, atividade coletiva: o legado de Erney Plessmann de Camargo",
    metaDescription:
      "O parasitologista Erney Plessmann de Camargo dedicou décadas ao combate à doença de Chagas e à malária e presidiu o CNPq de 2003 a 2007",
  },
  {
    title: "Uma vida dedicada a compreender os rins",
    excerpt:
      "Gerhard Malnic (1933–2023) publicou continuamente de 1959 a 2022 e elucidou processos fundamentais da função renal, tornando-se referência mundial em fisiologia dos rins",
    content:
      '<p>O fisiologista renal Gerhard Malnic (1933–2023) publicou artigos científicos continuamente de 1959 a 2022, ao longo de mais de seis décadas de pesquisa ativa. Suas descobertas elucidaram processos críticos para a manutenção da composição química dos mamíferos — tornando-o uma referência mundial em fisiologia dos rins.</p>\n\n<figure>\n  <img src="https://revistapesquisa.fapesp.br/wp-content/uploads/2023/03/RPF-obituario-Gerhard-Malnic-2023-02-site_1140.jpg" alt="Gerhard Malnic, professor do Departamento de Fisiologia e Biofísica do Instituto de Ciências Biomédicas da USP" />\n  <figcaption>Gerhard Malnic, professor da USP. Foto: Carol Quintanilha</figcaption>\n</figure>\n\n<p>Nascido em Milão em uma família austríaca, Malnic emigrou para o Brasil em 1937. Iniciou sua formação médica na USP em 1952, especializando-se em pesquisa fisiológica. Com apoio da Fundação Rockefeller, fez pós-doutorado nos Estados Unidos em 1961, onde aprendeu técnicas de micropunção para estudo dos rins — metodologia que trouxe ao Brasil e aprimorou ao longo de décadas.</p>\n\n<p>Desenvolveu equipamentos e técnicas laboratoriais inovadoras para a pesquisa renal e ocupou posições de liderança em diversas sociedades científicas brasileiras. Colegas descreviam-o como humilde, acessível e igualmente apaixonado pela pesquisa experimental e pela música clássica — uma combinação que personificava o ideal do cientista humanista.</p>',
    category: "analises",
    publishedAt: "2023-04-06T12:00:00Z",
    featuredImage:
      "https://revistapesquisa.fapesp.br/wp-content/uploads/2023/03/RPF-obituario-Gerhard-Malnic-2023-02-site_1140.jpg",
    featuredImageAlt: "Gerhard Malnic, fisiologista renal da USP",
    status: "published",
    featured: false,
    authorId: "danilo_albergaria",
    authorName: "Danilo Albergaria",
    slug: "vida-dedicada-compreender-rins",
    tags: [
      "fisiologia",
      "rins",
      "medicina",
      "USP",
      "história da ciência",
      "pesquisa brasileira",
    ],
    metaTitle: "Uma vida dedicada a compreender os rins",
    metaDescription:
      "Gerhard Malnic publicou de 1959 a 2022 e elucidou processos fundamentais da função renal, tornando-se referência mundial em fisiologia dos rins",
  },
];

async function populate() {
  console.log(`\nIniciando população do banco de dados...`);
  console.log(`Total de artigos: ${articles.length}\n`);

  let created = 0;
  let errors = 0;

  for (const article of articles) {
    try {
      process.stdout.write(`Criando: ${article.title.substring(0, 60)}... `);
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        article
      );
      console.log("✓");
      created++;
      // Aguarda 1 segundo para evitar limite de taxa (Rate Limit) do Appwrite
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log("✗");
      console.error(`  Erro: ${error?.message || error}`);
      errors++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Concluído! Criados: ${created} | Erros: ${errors}`);
}

populate();
