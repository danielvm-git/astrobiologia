<script lang="ts">
	import { goto } from '$app/navigation';

	export let article: any = null;
	export let isLoading = false;
	export let onSave: (article: any) => Promise<void>;

	let title = article?.title || '';
	let slug = article?.slug || '';
	let description = article?.description || '';
	let content = article?.content || '';
	let category = article?.category || 'astrobiology';
	let tags = article?.tags?.join(', ') || '';
	let status = article?.status || 'draft';
	let featured = article?.featured || false;
	let author = article?.author || 'Danilo Couto';
	let featuredImageUrl = article?.featuredImage || '';

	const categories = [
		'astrobiology',
		'biology',
		'geology',
		'chemistry',
		'space-missions',
		'exoplanets',
		'other'
	];

	function generateSlug(title: string) {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleTitleChange() {
		if (!article) {
			slug = generateSlug(title);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		const articleData = {
			title,
			slug: slug || generateSlug(title),
			description,
			content,
			category,
			tags: tags.split(',').map((t) => t.trim()),
			status,
			featured,
			author,
			featuredImage: featuredImageUrl,
			publishedAt: article?.publishedAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		try {
			await onSave(articleData);
			await goto('/admin/articles');
		} catch (err) {
			console.error('Save error:', err);
			alert('Failed to save article. Please try again.');
		}
	}
</script>

<form on:submit={handleSubmit} class="space-y-8">
	<!-- Basic Info -->
	<div class="bg-white rounded-lg shadow p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Article Details</h2>

		<div class="space-y-6">
			<div>
				<label for="title" class="block text-sm font-medium text-slate-700 mb-2">
					Title *
				</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					on:change={handleTitleChange}
					required
					placeholder="Article title"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="slug" class="block text-sm font-medium text-slate-700 mb-2">
						Slug *
					</label>
					<input
						id="slug"
						type="text"
						bind:value={slug}
						required
						placeholder="article-slug"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-2">
						Category *
					</label>
					<select
						id="category"
						bind:value={category}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						{#each categories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-slate-700 mb-2">
					Description *
				</label>
				<textarea
					id="description"
					bind:value={description}
					required
					placeholder="Brief description for preview"
					rows="3"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="author" class="block text-sm font-medium text-slate-700 mb-2">
						Author
					</label>
					<input
						id="author"
						type="text"
						bind:value={author}
						placeholder="Danilo Couto"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="tags" class="block text-sm font-medium text-slate-700 mb-2">
						Tags (comma-separated)
					</label>
					<input
						id="tags"
						type="text"
						bind:value={tags}
						placeholder="tag1, tag2, tag3"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div>
				<label for="featuredImage" class="block text-sm font-medium text-slate-700 mb-2">
					Featured Image URL
				</label>
				<input
					id="featuredImage"
					type="url"
					bind:value={featuredImageUrl}
					placeholder="https://example.com/image.jpg"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="bg-white rounded-lg shadow p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Content</h2>

		<div>
			<label for="content" class="block text-sm font-medium text-slate-700 mb-2">
				Content (HTML supported) *
			</label>
			<textarea
				id="content"
				bind:value={content}
				required
				placeholder="Article content..."
				rows="15"
				class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
			/>
			<p class="text-sm text-slate-600 mt-2">
				You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;img&gt;, etc.
			</p>
		</div>
	</div>

	<!-- Publishing -->
	<div class="bg-white rounded-lg shadow p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Publishing</h2>

		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<label for="status" class="block text-sm font-medium text-slate-700">
					Status
				</label>
				<select
					id="status"
					bind:value={status}
					class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</select>
			</div>

			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={featured} class="w-4 h-4 rounded border-slate-300" />
				<span class="text-sm font-medium text-slate-700">Featured Article</span>
			</label>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-4">
		<button
			type="submit"
			disabled={isLoading}
			class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
		>
			{isLoading ? 'Saving...' : 'Save Article'}
		</button>
		<a
			href="/admin/articles"
			class="px-8 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
		>
			Cancel
		</a>
	</div>
</form>
