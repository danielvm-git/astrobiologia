<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { deLocalizeHref, localizeHref } from '$lib/paraglide/runtime';
    import { 
        LayoutDashboard, 
        FileText, 
        Settings, 
        LogOut, 
        Menu, 
        X, 
        Telescope,
        ChevronRight,
        Search
    } from 'lucide-svelte';
	import type { LayoutData } from './$types';
    import { cn } from '$lib/utils';

	let { children, data }: { children: any; data: LayoutData } = $props();
	let isSidebarOpen = $state(true);
    let isMobileOpen = $state(false);

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Artigos', href: '/admin/artigos', icon: FileText },
        { name: 'Busca (SEO)', href: '/admin/seo', icon: Search },
        { name: 'Configurações', href: '/admin/settings', icon: Settings },
    ];

    const currentPath = $derived(deLocalizeHref(page.url.pathname));
</script>

<div class="min-h-screen bg-[#f8fafc] flex">
	{#if !currentPath.includes('/login')}
		<!-- Desktop Sidebar -->
		<aside 
            class={cn(
                "hidden md:flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 z-50",
                isSidebarOpen ? "w-64" : "w-20"
            )}
        >
            <div class="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 overflow-hidden">
                <a href={localizeHref('/admin/dashboard')} class="flex items-center gap-3 shrink-0">
                    <Telescope class="w-8 h-8 text-accent shrink-0" />
                    {#if isSidebarOpen}
                        <span class="font-black text-lg tracking-tighter text-white uppercase truncate">Astro Admin</span>
                    {/if}
                </a>
            </div>

            <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {#each menuItems as item}
                    <a
                        href={localizeHref(item.href)}
                        class={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                            currentPath.startsWith(item.href) 
                                ? "bg-accent/10 text-accent font-bold shadow-[0_0_15px_rgba(251,188,5,0.1)]" 
                                : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon class={cn("w-5 h-5 shrink-0 transition-transform", currentPath.startsWith(item.href) ? "scale-110" : "group-hover:scale-110")} />
                        {#if isSidebarOpen}
                            <span class="text-sm tracking-wide">{item.name}</span>
                            {#if currentPath.startsWith(item.href)}
                                <ChevronRight class="w-4 h-4 ml-auto" />
                            {/if}
                        {/if}
                        
                        {#if !isSidebarOpen}
                            <div class="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                {item.name}
                            </div>
                        {/if}
                    </a>
                {/each}
            </nav>

            <div class="p-4 border-t border-slate-800 space-y-2">
                {#if isSidebarOpen && data.user}
                    <div class="flex items-center gap-3 px-2 py-3 bg-slate-800/50 rounded-xl mb-4">
                        <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-xs">
                            {data.user.name?.[0] || data.user.email[0].toUpperCase()}
                        </div>
                        <div class="min-w-0">
                            <p class="text-xs font-black text-white truncate uppercase tracking-widest">{data.user.name || 'Admin'}</p>
                            <p class="text-[10px] text-slate-500 truncate">{data.user.email}</p>
                        </div>
                    </div>
                {/if}

                <form method="POST" action={localizeHref('/admin/logout')} use:enhance>
                    <button
                        type="submit"
                        class={cn(
                            "flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut class="w-5 h-5 shrink-0" />
                        {#if isSidebarOpen}
                            <span class="text-sm font-bold uppercase tracking-widest">Sair</span>
                        {/if}
                    </button>
                </form>
                
                <button 
                    onclick={() => (isSidebarOpen = !isSidebarOpen)}
                    class="hidden md:flex items-center justify-center w-full py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                >
                    {#if isSidebarOpen}
                        <X class="w-4 h-4" />
                    {:else}
                        <Menu class="w-4 h-4" />
                    {/if}
                </button>
            </div>
		</aside>

		<!-- Mobile Header -->
		<header class="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40">
			<a href={localizeHref('/admin/dashboard')} class="flex items-center gap-2">
				<Telescope class="w-6 h-6 text-primary" />
				<span class="font-black text-sm tracking-tighter uppercase">Astro Admin</span>
			</a>
			<button 
                onclick={() => (isMobileOpen = !isMobileOpen)}
                class="p-2 hover:bg-slate-100 rounded-lg"
            >
				<Menu class="w-6 h-6 text-slate-600" />
			</button>
		</header>

		<!-- Main Content Wrapper -->
		<div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <!-- Global Top Bar (Desktop) -->
            <header class="hidden md:flex h-16 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 z-30">
                <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Ambiente</span>
                    <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded border border-green-200">Produção</span>
                </div>
                
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Appwrite Online</span>
                    </div>
                    <button class="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Settings class="w-5 h-5" />
                    </button>
                </div>
            </header>

			<main class="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-slate-50/50">
				{@render children()}
			</main>
		</div>

		<!-- Mobile Menu -->
		{#if isMobileOpen}
            <!-- Backdrop -->
			<button 
                class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden w-full h-full border-none" 
                onclick={() => (isMobileOpen = false)}
                aria-label="Fechar menu"
            ></button>

            <!-- Sidebar -->
            <div class="fixed inset-y-0 left-0 w-72 bg-slate-900 flex flex-col z-[70] md:hidden shadow-2xl animate-in slide-in-from-left duration-300">
                <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <span class="font-black text-white uppercase tracking-widest">Menu</span>
                    <button onclick={() => (isMobileOpen = false)} class="text-slate-400 p-2">
                        <X class="w-6 h-6" />
                    </button>
                </div>
                <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                    {#each menuItems as item}
                        <a
                            href={localizeHref(item.href)}
                            onclick={() => (isMobileOpen = false)}
                            class={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                currentPath.startsWith(item.href) ? "bg-accent text-accent-foreground font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon class="w-5 h-5" />
                            <span>{item.name}</span>
                        </a>
                    {/each}
                </nav>
                <div class="p-6 border-t border-slate-800">
                    <form method="POST" action={localizeHref('/admin/logout')} use:enhance>
                        <button type="submit" class="flex items-center gap-3 text-red-400 font-bold uppercase tracking-widest text-xs">
                            <LogOut class="w-4 h-4" />
                            Sair da Sessão
                        </button>
                    </form>
                </div>
            </div>
		{/if}
	{:else}
		{@render children()}
	{/if}
</div>

<style>
    :global(body) {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
