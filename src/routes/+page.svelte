<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { longpress, uncheckAllEditCheckboxes, toggleEditItem } from '$lib/scripts/common';

    import NewButton from '$lib/components/NewButton.svelte';

    let { data } = $props();
    
    let editMode = $state(false);

    function toggleEditMode(enabled?: boolean) {
        if (enabled === undefined) editMode = !editMode;
        else editMode = enabled;
        
        if (!editMode) uncheckAllEditCheckboxes();
    }

    function longselectCollection(node: HTMLElement) {
        const editChbx = document.getElementById('edit-chbx') as HTMLInputElement | null;
        if (editChbx) editChbx.checked = true;
        toggleEditItem(node, true);
        toggleEditMode(true);
    }

</script>


{#if !data.user}
    <p><a href={resolve('/auth')}>Sign in to manage your collections.</a></p>

{:else}
    <div class="flex-row top-menu">
        <div>
        
        </div>
        <div>
            <input
                type="checkbox"
                name="edit-chbx"
                id="edit-chbx"
                onchange={(e) => {
                    if (e.target instanceof HTMLInputElement) toggleEditMode(e.target.checked);
                }}
            />
        </div>
    </div>

    <div class="main-content">
        {#if data.favorites.length > 0}
            <h2>Favorites</h2>

            <div class="col-grid" style="--min-cell-w: 10rem; --gap: 10px">
                {#each data.favorites as favCol (favCol.id)}
                    <div class="col-grid-item">
                        <label class="collection {editMode ? 'outline' : ''}" use:longpress={{ threshold: 500, callback: (ele) => longselectCollection(ele) }}>
                            <input type="checkbox" class="edit-checkbox remove" />
                            <button onclick={() => !editMode ? goto(resolve(`/collection?cid=${favCol.id}`)) : undefined}>
                                <h3>{favCol.title}</h3>
                            </button>
                        </label>
                    </div>
                {/each}
            </div>
        {/if}

        <h2>All collections</h2>
        {#if data.collections.length === 0}
            <p>Create a collection with the + button.</p>
        {/if}

        <div class="col-grid" style="--min-cell-w: 10rem; --gap: 10px">
            {#each data.collections as col (col.id)}
                <div class="col-grid-item">
                    <button class="collection {editMode ? 'outline' : ''}"
                        use:longpress={{ threshold: 500, callback: (ele) => longselectCollection(ele) }}
                        onclick={(event) => !editMode ? goto(resolve(`/collection?cid=${col.id}`)) : toggleEditItem(event.currentTarget as HTMLElement)}
                    >
                        <input type="checkbox" class="edit-checkbox remove"/>
                        <h3>{col.title}</h3>
                    </button>
                </div>
            {/each}
        </div>
    </div>
{/if}

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

        &:has(> .edit-checkbox:checked) {
            outline: var(--g-outline-size) solid var(--g-highlight-color);
        }
    }
</style>
