<script lang="ts">
	import { page } from '$app/state';
	import { Globe, Newspaper, Search } from 'lucide-svelte';
	import PageHeroShell from '$lib/components/PageHeroShell.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.nav_about()} — {m.site_title()}</title>
	<meta name="description" content={m.page_about_hero_quote()} />
</svelte:head>

<main class="min-h-screen bg-background">
	{#key page.url.pathname}
		<PageHeroShell
			kicker={m.page_about_kicker()}
			title={m.page_about_hero_title()}
			quote={m.page_about_hero_quote()}
		/>
	{/key}

	<!-- About Danilo -->
	<section class="border-t border-slate-200 py-24 md:py-32">
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
	<section class="border-t border-slate-200 bg-slate-50/80 py-24 md:py-32">
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
	<section class="relative overflow-hidden bg-slate-900 py-24 md:py-36">
		<div class="pointer-events-none absolute inset-0 bg-primary/5"></div>
		<div class="relative z-10 mx-auto max-w-5xl px-4 text-center text-white sm:px-6 lg:px-8">
			<h2 class="mb-12 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
				{m.continue_exploring()}
			</h2>
			<p class="mx-auto mb-16 max-w-3xl font-serif text-xl italic leading-relaxed text-slate-400 md:text-2xl">
				{m.newsletter_subtitle()}
			</p>
			<div class="flex flex-wrap justify-center gap-6">
				<a
					href={localizeHref('/artigos')}
					class="px-10 py-5 text-sm font-black uppercase tracking-widest text-slate-900 transition-all duration-300 bg-white hover:bg-accent hover:text-white"
				>
					{m.nav_articles()}
				</a>
				<a
					href={localizeHref('/#newsletter')}
					class="border border-white/25 bg-transparent px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-slate-900"
				>
					{m.newsletter_button()}
				</a>
			</div>
		</div>
	</section>
</main>
