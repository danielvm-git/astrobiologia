<script lang="ts">
	import { Telescope, Mail, Twitter, Github } from 'lucide-svelte';
	import { CATEGORIES } from '$lib/appwrite';

	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-border bg-muted/30">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div class="lg:col-span-1">
				<a href="/" class="flex items-center gap-2">
					<Telescope class="h-6 w-6 text-primary" />
					<span class="text-lg font-bold text-foreground">
						Astrobiologia<span class="text-primary">.com</span>
					</span>
				</a>
				<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
					Explorando as fronteiras da vida no universo. Conteúdo científico sobre astrobiologia, exoplanetas e a busca por vida extraterrestre.
				</p>
			</div>

			<!-- Categories -->
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wider text-foreground">Categorias</h3>
				<ul class="mt-4 flex flex-col gap-2">
					{#each CATEGORIES.slice(0, 4) as category}
						<li>
							<a
								href="/categorias/{category.slug}"
								class="text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{category.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Links -->
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wider text-foreground">Links</h3>
				<ul class="mt-4 flex flex-col gap-2">
					<li>
						<a href="/sobre" class="text-sm text-muted-foreground transition-colors hover:text-primary">
							Sobre o Autor
						</a>
					</li>
					<li>
						<a href="/artigos" class="text-sm text-muted-foreground transition-colors hover:text-primary">
							Todos os Artigos
						</a>
					</li>
					<li>
						<a href="/contato" class="text-sm text-muted-foreground transition-colors hover:text-primary">
							Contato
						</a>
					</li>
					<li>
						<a href="/privacidade" class="text-sm text-muted-foreground transition-colors hover:text-primary">
							Privacidade
						</a>
					</li>
				</ul>
			</div>

			<!-- Professional Links -->
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wider text-foreground">Links Profissionais</h3>
				<ul class="mt-4 flex flex-col gap-2">
					<li>
						<a href="https://www.universiteitleiden.nl/en/staffmembers/danilo-nogueira-albergaria-pereira" target="_blank" class="text-xs text-muted-foreground transition-colors hover:text-primary">
							Leiden University
						</a>
					</li>
					<li>
						<a href="https://bv.fapesp.br/pt/pesquisador/100833/danilo-nogueira-albergaria-pereira/" target="_blank" class="text-xs text-muted-foreground transition-colors hover:text-primary">
							Currículo FAPESP
						</a>
					</li>
					<li>
						<a href="https://revistapesquisa.fapesp.br/autor/danilo-albergaria/" target="_blank" class="text-xs text-muted-foreground transition-colors hover:text-primary">
							Revista Pesquisa FAPESP
						</a>
					</li>
					<li>
						<a href="https://scholar.google.com/citations?user=w9dLUbIAAAAJ&hl=pt-BR" target="_blank" class="text-xs text-muted-foreground transition-colors hover:text-primary">
							Google Scholar
						</a>
					</li>
				</ul>
			</div>

			<!-- Newsletter -->
			<div>
				<h3 id="newsletter" class="text-sm font-semibold uppercase tracking-wider text-foreground">Newsletter</h3>
				<p class="mt-4 text-sm text-muted-foreground">
					Receba as últimas novidades sobre astrobiologia diretamente no seu e-mail.
				</p>
				<form class="mt-4 flex gap-2">
					<input
						type="email"
						placeholder="seu@email.com"
						class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					/>
					<button
						type="submit"
						class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Assinar
					</button>
				</form>
			</div>
		</div>

		<!-- Bottom -->
		<div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
			<p class="text-sm text-muted-foreground">
				&copy; {currentYear} Astrobiologia.com.br - Danilo Albergaria.
			</p>
			<div class="flex items-center gap-4">
				<a
					href="mailto:danilo.albergaria@gmail.com"
					class="text-muted-foreground transition-colors hover:text-primary"
					aria-label="Email"
				>
					<Mail class="h-5 w-5" />
				</a>
				<a
					href="https://twitter.com/dalbergaria"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground transition-colors hover:text-primary"
					aria-label="Twitter"
				>
					<Twitter class="h-5 w-5" />
				</a>
			</div>
		</div>
	</div>
</footer>
