<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, locales, localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';
	import { Languages, ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Props {
		variant?: 'header' | 'footer' | 'mobile';
		class?: string;
	}

	let { variant = 'header', class: className }: Props = $props();
	let isOpen = $state(false);

	const currentLang = $derived.by(() => {
		// Access page.url to ensure this derived value re-runs on navigation
		const _ = page.url;
		return getLocale();
	});

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}
</script>

{#if variant === 'header'}
	<div class={cn('relative', className)}>
		<button
			type="button"
			onclick={toggleMenu}
			class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-slate-50"
			aria-expanded={isOpen}
		>
			<Languages class="h-3.5 w-3.5" />
			{currentLang}
			<ChevronDown class={cn('h-3 w-3 transition-transform duration-200', isOpen && 'rotate-180')} />
		</button>

		{#if isOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div 
				class="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-150"
				onclick={closeMenu}
			>
				{#each locales as tag}
					<a
						href={localizeHref(deLocalizeHref(page.url.pathname), { locale: tag })}
						class={cn(
							'block px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50',
							currentLang === tag ? 'text-primary' : 'text-slate-500'
						)}
					>
						{tag === 'pt-br' ? 'Português' : 'English'}
					</a>
				{/each}
			</div>
			<!-- Backdrop for closing -->
			<button 
				class="fixed inset-0 z-[-1] cursor-default bg-transparent w-full h-full border-none" 
				onclick={closeMenu}
				aria-label="Fechar menu"
			></button>
		{/if}
	</div>
{:else if variant === 'mobile'}
	<div class={cn('flex flex-col gap-4 py-2', className)}>
		<span class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Idioma</span>
		<div class="flex flex-wrap gap-2 px-3">
			{#each locales as tag}
				<a
					href={localizeHref(deLocalizeHref(page.url.pathname), { locale: tag })}
					class={cn(
						'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border',
						currentLang === tag 
							? 'bg-primary text-white border-primary shadow-md' 
							: 'bg-white text-slate-500 border-slate-100 hover:border-primary/20'
					)}
				>
					{tag === 'pt-br' ? 'Português' : 'English'}
				</a>
			{/each}
		</div>
	</div>
{:else if variant === 'footer'}
	<div class={cn('flex items-center gap-6', className)}>
		{#each locales as tag}
			<a
				href={localizeHref(deLocalizeHref(page.url.pathname), { locale: tag })}
				class={cn(
					'text-[10px] font-black uppercase tracking-widest transition-colors',
					currentLang === tag ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
				)}
			>
				{tag === 'pt-br' ? 'Português' : 'English'}
			</a>
		{/each}
	</div>
{/if}
