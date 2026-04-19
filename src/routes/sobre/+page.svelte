<script lang="ts">
	import { goto } from '$app/navigation';

	async function navigateToAdmin() {
		await goto('/admin/login');
	}
</script>

<svelte:head>
	<title>Sobre Danilo Albergaria - Astrobiologia.com.br</title>
	<meta
		name="description"
		content="Conheça Danilo Albergaria, jornalista e pesquisador em astrobiologia, e sua missão de comunicar a busca por vida no universo."
	/>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
	<!-- Hero Section -->
	<section class="relative py-20 md:py-32 overflow-hidden">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h1 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Sobre o Autor</h1>
			<p class="text-xl md:text-2xl text-slate-600 mb-8">
				Comunicação da ciência da vida no universo
			</p>
		</div>
	</section>

	<!-- About Danilo -->
	<section class="py-16 md:py-24">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
				<div>
					<h2 class="text-4xl font-bold text-slate-900 mb-6">Danilo Albergaria</h2>
					<p class="text-lg text-slate-600 mb-4 text-balance">
						Danilo Albergaria é pós-doutorando e jornalista no Laboratório de Astrobiologia da Universidade de São Paulo (USP), pesquisador associado da Universidade de Leiden (Holanda) e membro da Força Tarefa da Estratégia Decenal de Pesquisa e Exploração em Astrobiologia da NASA.
					</p>
					<p class="text-lg text-slate-600 mb-4 text-balance">
						Tem financiamento da FAPESP com o projeto “Pontes interdisciplinares para a compreensão da vida no Universo: o Núcleo de Apoio à Pesquisa e Inovação em Astrobiologia e o Laboratório de Astrobiologia da USP".
					</p>
					<p class="text-lg text-slate-600 text-balance">
						Especialista em comunicação da busca por vida fora da Terra, Danilo traz uma perspectiva única que une o rigor acadêmico ao faro jornalístico.
					</p>
				</div>
				<div class="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl h-96 flex flex-col items-center justify-center shadow-xl">
					<div class="text-center text-white p-8">
						<div class="text-7xl mb-6">🔭</div>
						<p class="text-2xl font-bold mb-2">Danilo Albergaria</p>
						<p class="text-blue-200">Jornalista & Pesquisador</p>
						<div class="mt-6 flex flex-wrap justify-center gap-3">
							<span class="bg-white/10 px-3 py-1 rounded-full text-xs">USP</span>
							<span class="bg-white/10 px-3 py-1 rounded-full text-xs">Leiden</span>
							<span class="bg-white/10 px-3 py-1 rounded-full text-xs">NASA Task Force</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Mission Section -->
	<section class="py-16 md:py-24 bg-slate-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-4xl font-bold text-slate-900 mb-12 text-center">Nossa Missão</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
					<div class="text-4xl mb-4">📰</div>
					<h3 class="text-xl font-bold text-slate-900 mb-4">Informar</h3>
					<p class="text-slate-600">
						Trazer notícias precisas e atualizadas sobre as descobertas mais recentes na astrobiologia global e brasileira.
					</p>
				</div>
				<div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
					<div class="text-4xl mb-4">🔬</div>
					<h3 class="text-xl font-bold text-slate-900 mb-4">Analisar</h3>
					<p class="text-slate-600">
						Oferecer profundidade e contexto para entender as implicações das pesquisas sobre a vida no cosmos.
					</p>
				</div>
				<div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
					<div class="text-4xl mb-4">🇧🇷</div>
					<h3 class="text-xl font-bold text-slate-900 mb-4">Destacar</h3>
					<p class="text-slate-600">
						Dar visibilidade à ciência produzida no Brasil, fortalecendo a comunidade científica nacional.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Content Areas -->
	<section class="py-16 md:py-24">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-4xl font-bold text-slate-900 mb-12 text-center">O que cobrimos</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700">
				<div class="space-y-4">
					<h3 class="text-2xl font-bold text-slate-900">Astrobiologia Brasileira</h3>
					<p>
						Acompanhamento de perto das pesquisas realizadas no Laboratório de Astrobiologia da USP e em outros centros de excelência no Brasil.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="text-2xl font-bold text-slate-900">Exoplanetas</h3>
					<p>
						A busca por mundos habitáveis e a caracterização de atmosferas em busca de sinais de vida (biossinaturas).
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="text-2xl font-bold text-slate-900">Origens da Vida</h3>
					<p>
						As investigações químicas e biológicas sobre como a vida surgiu na Terra e as possibilidades de processos similares em outros astros.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="text-2xl font-bold text-slate-900">Exploração Espacial</h3>
					<p>
						Missões da NASA, ESA e outras agências que buscam vida em Marte, Europa, Encélado e além.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-16 md:py-24 bg-slate-900">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
			<h2 class="text-4xl font-bold mb-6 text-balance">Acompanhe a Jornada</h2>
			<p class="text-xl mb-8 text-slate-400 text-balance">
				Fique por dentro das últimas descobertas sobre a vida no universo.
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<a
					href="/categorias/noticias"
					class="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition"
				>
					Ler Notícias
				</a>
				<a
					href="/#newsletter"
					class="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition"
				>
					Assinar Newsletter
				</a>
			</div>
		</div>
	</section>
</main>

<style>
	:global(.prose) {
		--tw-prose-body: rgb(51, 65, 85);
		--tw-prose-headings: rgb(15, 23, 42);
	}
</style>
