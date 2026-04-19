<script lang="ts">
	import { goto } from '$app/navigation';

	async function navigateToAdmin() {
		await goto('/admin/login');
	}
</script>

<svelte:head>
	<title>About Astrobiologia - Danilo Couto</title>
	<meta
		name="description"
		content="Learn about Danilo Couto and the mission of Astrobiologia to advance astrobiology education and research."
	/>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
	<!-- Hero Section -->
	<section class="relative py-20 md:py-32 overflow-hidden">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h1 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6">About Astrobiologia</h1>
			<p class="text-xl md:text-2xl text-slate-600 mb-8">
				Exploring the intersection of life and the cosmos
			</p>
		</div>
	</section>

	<!-- About Danilo -->
	<section class="py-16 md:py-24">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
				<div>
					<h2 class="text-4xl font-bold text-slate-900 mb-6">Danilo Couto</h2>
					<p class="text-lg text-slate-600 mb-4">
						Danilo Couto is a passionate researcher and educator dedicated to advancing the field of
						astrobiology. With years of experience in scientific research and communication, he has
						made it his mission to make complex astrobiological concepts accessible to everyone.
					</p>
					<p class="text-lg text-slate-600 mb-4">
						Through Astrobiologia, Danilo combines cutting-edge research with engaging storytelling
						to inspire the next generation of scientists and space enthusiasts.
					</p>
					<p class="text-lg text-slate-600">
						His work spans from exoplanet characterization to the origins of life, always with the
						goal of understanding our place in the universe.
					</p>
				</div>
				<div class="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg h-96 flex items-center justify-center">
					<div class="text-center text-white">
						<div class="text-6xl mb-4">🧬</div>
						<p class="text-xl font-semibold">Danilo Couto</p>
						<p class="text-sm">Astrobiology Researcher & Educator</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Mission Section -->
	<section class="py-16 md:py-24 bg-blue-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-4xl font-bold text-slate-900 mb-8 text-center">Our Mission</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="bg-white p-8 rounded-lg shadow-sm">
					<div class="text-4xl mb-4">📚</div>
					<h3 class="text-2xl font-bold text-slate-900 mb-4">Educate</h3>
					<p class="text-slate-600">
						Provide high-quality, accessible content about astrobiology and related sciences to
						scientists, students, and enthusiasts worldwide.
					</p>
				</div>
				<div class="bg-white p-8 rounded-lg shadow-sm">
					<div class="text-4xl mb-4">🔬</div>
					<h3 class="text-2xl font-bold text-slate-900 mb-4">Inspire</h3>
					<p class="text-slate-600">
						Spark curiosity about the fundamental questions: How did life begin? Is there life
						beyond Earth? What is our place in the cosmos?
					</p>
				</div>
				<div class="bg-white p-8 rounded-lg shadow-sm">
					<div class="text-4xl mb-4">🌌</div>
					<h3 class="text-2xl font-bold text-slate-900 mb-4">Connect</h3>
					<p class="text-slate-600">
						Build a community of scientists, researchers, and space enthusiasts united by a passion
						for understanding life in the universe.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Content Areas -->
	<section class="py-16 md:py-24">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-4xl font-bold text-slate-900 mb-12 text-center">What We Cover</h2>
			<div class="prose prose-lg max-w-none">
				<h3>Astrobiology</h3>
				<p>
					The study of life in the universe, including its origins, distribution, and future. We
					explore questions about habitable zones, extremophiles, and the search for extraterrestrial
					life.
				</p>

				<h3>Exoplanet Research</h3>
				<p>
					From detection methods to characterization, we cover the latest discoveries in exoplanet
					science and what they tell us about potential habitats for life.
				</p>

				<h3>Molecular Biology & Chemistry</h3>
				<p>
					Understanding the biochemical foundations of life, from nucleic acids to protein structures,
					and how these principles apply across the universe.
				</p>

				<h3>Space Missions</h3>
				<p>
					Coverage of current and upcoming space missions that search for signs of life, study
					potentially habitable worlds, and advance our understanding of the cosmos.
				</p>

				<h3>Evolution & Origins</h3>
				<p>
					The story of how life emerged on Earth and what we can learn to inform our search for life
					elsewhere in the universe.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
			<h2 class="text-4xl font-bold mb-6">Join the Journey</h2>
			<p class="text-xl mb-8 opacity-90">
				Stay updated with the latest in astrobiology research and discoveries
			</p>
			<button
				on:click={navigateToAdmin}
				class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
			>
				Subscribe & Admin Access
			</button>
		</div>
	</section>
</main>

<style>
	:global(.prose) {
		--tw-prose-body: rgb(51, 65, 85);
		--tw-prose-headings: rgb(15, 23, 42);
	}
</style>
