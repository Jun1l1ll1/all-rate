<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import NewButton from '$lib/components/NewButton.svelte';

    let { data } = $props();
</script>

<div class="main-content">
    {#if !data.user}
        <p><a href={resolve('/auth')}>Sign in to manage your collections.</a></p>
    {:else}
        {#if data.favorites.length > 0}
            <h2>Favorites</h2>

            <div class="col-grid" style="--min-cell-w: 10rem; --gap: 10px">
                {#each data.favorites as favCol (favCol.id)}
                    <div class="col-grid-item">
                        <button
                            class="collection"
                            onclick={() => goto(resolve(`/collection?cid=${favCol.id}`))}
                        >
                            <h3>{favCol.title}</h3>
                        </button>
                    </div>
                {/each}
            </div>
        {/if}

        <h2>All collections</h2>
        {#if data.collections.length === 0}
            <p>No collections yet.</p>
        {/if}

        <div class="col-grid" style="--min-cell-w: 10rem; --gap: 10px">
            {#each data.collections as col (col.id)}
                <div class="col-grid-item">
                    <button
                        class="collection"
                        onclick={() => goto(resolve(`/collection?cid=${col.id}`))}
                    >
                        <h3>{col.title}</h3>
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if data.user}
    <NewButton type="collection" />
{/if}

<!-- <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

<style>
    .col-grid {
        --min-cell-w: 200px;
        --gap: 0px;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--min-cell-w), 1fr));
        gap: var(--gap);
    }

    .col-grid-item {
        display: flex;
        justify-content: center;
    }

    .collection {
        background-color: #333333;
        width: 10rem;
        max-width: 100%;
        aspect-ratio: 3/2;
    }
</style>
