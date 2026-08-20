<script lang="ts">
    import './../app.css';
    import { page } from '$app/state';
    import favicon from '$lib/assets/favicon.svg';

    function goBack() {
        if (window.history.length > 1) {
            history.back();
        } else {
            window.location.href = '/';
        }
    }

    let { children } = $props();

    const title = $derived(
        page.url.pathname === '/collection'
            ? page.url.searchParams.get('cid') //TODO Get the name of the collection from the collection id
            : null
    );
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{#if page.url.pathname !== '/'}
    <div class="flex-row" style="--gap: 10px">
        <button onclick={goBack} class="back-btn">&larr;</button>
        {#if title}
            <h1>{title}</h1>
        {/if}
    </div>
{/if}

{@render children()}
