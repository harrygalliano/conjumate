<script lang="ts">
	import ArticleGuidePage from '$lib/components/learn/ArticleGuidePage.svelte';
	import { definiteArticleGuide, indefiniteArticleGuide } from '$lib/data/learn/articles';
</script>

<ArticleGuidePage guide={definiteArticleGuide} companion={indefiniteArticleGuide} />
