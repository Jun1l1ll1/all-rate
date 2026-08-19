<script lang="ts">
    import { goto } from '$app/navigation';
    import NewButton from '$lib/components/NewButton.svelte';

    const favorites = [
        {
            cid: 'C2',
            title: 'Title 2'
        }
    ]

    const collections = [
        {
            cid: 'C1',
            title: 'Title 1'
        },
        {
            cid: 'C2',
            title: 'Title 2'
        },
        {
            cid: 'C3',
            title: 'Title 3'
        },
        {
            cid: 'C4',
            title: 'Title 4'
        },
        {
            cid: 'C5',
            title: 'Title 5'
        },
        {
            cid: 'C6',
            title: 'Title 6'
        },
        {
            cid: 'C7',
            title: 'Title 7'
        }
    ]
</script>


{#if favorites}
    <h2>Favorites</h2>

    <div class="grid" style="--min-cell-w: 10rem; --gap: 10px">
        {#each favorites as favCol}
            <div class="col-grid-item">
                <button class="collection" onclick={() => goto('/collection?cid=' + favCol.cid)}>
                    <h3>{favCol.title}</h3>
                </button>
            </div>
        {/each}
    </div>

    <hr />
    <h2>All collections</h2>
{/if}

<div class="grid" style="--min-cell-w: 10rem; --gap: 10px">
    {#each collections as col}
        <div class="col-grid-item">
            <button class="collection" onclick={() => goto('/collection?cid=' + col.cid)}>
                <h3>{col.title}</h3>
            </button>
        </div>
    {/each}
</div>

<NewButton type="collection" />


<!-- <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

<style>

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
