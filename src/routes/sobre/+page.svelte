<script lang="ts">
	import { goto } from '$app/navigation';
	import { Microscope, Globe, Telescope, Newspaper, Search, BookOpen } from 'lucide-svelte';

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

<main class="min-h-screen bg-background pt-20">
	<!-- Hero Section -->
	<section class="relative py-24 md:py-48 overflow-hidden bg-[#0a0a0c]">
		<div class="absolute inset-0 z-0 opacity-40">
			<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/20 rounded-full blur-[150px]"></div>
		</div>
		
		<div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent text-white text-[10px] font-bold mb-10 uppercase tracking-[0.2em]">
				O Projeto
			</div>
			<h1 class="text-5xl md:text-8xl font-black text-white mb-10 font-sans tracking-tight leading-[0.95]">Explorando a Vida no Universo</h1>
			<p class="text-xl md:text-3xl text-slate-400 font-serif leading-relaxed italic max-w-3xl mx-auto">
				"Uma ponte entre a ciência de ponta e o público, comunicando as descobertas que redefinem nosso lugar no cosmos."
			</p>
		</div>
	</section>

	<!-- About Danilo -->
	<section class="py-24 md:py-40 border-b border-slate-100">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
				<div class="lg:col-span-7">
					<div class="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">O Autor</div>
					<h2 class="text-5xl md:text-7xl font-black text-slate-900 mb-12 font-sans tracking-tight uppercase leading-none">
						Danilo <br/> Albergaria
					</h2>
					<div class="space-y-8 text-xl md:text-2xl text-slate-600 font-serif leading-loose italic">
						<p>
							Danilo Albergaria é pós-doutorando e jornalista no <span class="text-slate-900 font-bold not-italic">Laboratório de Astrobiologia da Universidade de São Paulo (USP)</span>, pesquisador associado da <span class="text-slate-900 font-bold not-italic">Universidade de Leiden (Holanda)</span> e membro da Força Tarefa da Estratégia Decenal de Pesquisa e Exploração em Astrobiologia da <span class="text-slate-900 font-bold not-italic">NASA</span>.
						</p>
						<p>
							Com financiamento da <span class="text-slate-900 font-bold not-italic">FAPESP</span>, ele lidera o projeto “Pontes interdisciplinares para a compreensão da vida no Universo: o Núcleo de Apoio à Pesquisa e Inovação em Astrobiologia e o Laboratório de Astrobiologia da USP".
						</p>
						<p>
							Especialista em comunicação da busca por vida fora da Terra, Danilo une o rigor acadêmico ao faro jornalístico para traduzir a complexidade do cosmos em narrativas acessíveis e inspiradoras.
						</p>
					</div>
				</div>
				
				<div class="lg:col-span-5 sticky top-32">
					<div class="relative">
						<div class="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
						<div class="relative bg-white p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center justify-center text-center">
							<div class="w-40 h-40 md:w-56 md:h-56 bg-slate-50 rounded-full flex items-center justify-center text-8xl mb-12 border border-slate-100 shadow-inner grayscale opacity-50">
								🔭
							</div>
							<h3 class="text-3xl font-black text-slate-900 mb-2 font-sans uppercase tracking-tight">Danilo Albergaria</h3>
							<p class="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-10 font-sans">Jornalista & Pesquisador</p>
							
							<div class="flex flex-wrap justify-center gap-4">
								<span class="bg-slate-50 text-slate-400 px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-100">USP</span>
								<span class="bg-slate-50 text-slate-400 px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-100">Leiden</span>
								<span class="bg-slate-50 text-slate-400 px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-100">NASA</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Mission Section -->
	<section class="py-24 md:py-40 bg-slate-50/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-24">
				<div class="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Nossos Pilares</div>
				<h2 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-sans tracking-tight uppercase">Missão Jornalística</h2>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-16">
				<div class="group">
					<div class="w-16 h-16 bg-white text-primary border border-slate-100 shadow-sm flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
						<Newspaper class="w-8 h-8" />
					</div>
					<h3 class="text-2xl font-black text-slate-900 mb-6 font-sans uppercase tracking-tight">Informar</h3>
					<p class="text-lg text-slate-600 font-serif leading-relaxed italic">
						Trazer notícias precisas e atualizadas sobre as descobertas mais recentes na astrobiologia global e brasileira.
					</p>
				</div>
				
				<div class="group">
					<div class="w-16 h-16 bg-white text-primary border border-slate-100 shadow-sm flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
						<Search class="w-8 h-8" />
					</div>
					<h3 class="text-2xl font-black text-slate-900 mb-6 font-sans uppercase tracking-tight">Analisar</h3>
					<p class="text-lg text-slate-600 font-serif leading-relaxed italic">
						Oferecer profundidade e contexto para entender as implicações das pesquisas sobre a vida no cosmos.
					</p>
				</div>
				
				<div class="group">
					<div class="w-16 h-16 bg-white text-primary border border-slate-100 shadow-sm flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
						<Globe class="w-8 h-8" />
					</div>
					<h3 class="text-2xl font-black text-slate-900 mb-6 font-sans uppercase tracking-tight">Destacar</h3>
					<p class="text-lg text-slate-600 font-serif leading-relaxed italic">
						Dar visibilidade à ciência produzida no Brasil, fortalecendo a comunidade científica nacional frente ao mundo.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-24 md:py-48 bg-[#0a0a0c] relative overflow-hidden">
		<div class="absolute inset-0 bg-primary/5 pointer-events-none"></div>
		<div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
			<h2 class="text-4xl md:text-8xl font-black mb-12 font-sans tracking-tight leading-none uppercase">Acompanhe a <br/> Jornada</h2>
			<p class="text-xl md:text-3xl mb-16 text-slate-400 font-serif max-w-3xl mx-auto leading-relaxed italic">
				Receba as últimas descobertas sobre a vida no universo diretamente na sua fonte de informação preferida.
			</p>
			<div class="flex flex-wrap justify-center gap-8">
				<a
					href="/artigos"
					class="px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-accent hover:text-white transition-all duration-300"
				>
					Explorar Artigos
				</a>
				<a
					href="/#newsletter"
					class="px-12 py-6 bg-transparent text-white border border-white/20 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-300"
				>
					Assinar Newsletter
				</a>
			</div>
		</div>
	</section>
</main>
