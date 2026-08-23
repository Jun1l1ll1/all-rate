<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { longpress, uncheckAllEditCheckboxes, toggleEditItem } from '$lib/scripts/common';

    import DiscreteErrorMessage from '$lib/components/DiscreteErrorMessage.svelte';
    import ConfirmPopup from '$lib/components/ConfirmPopup.svelte';
    import NewButton from '$lib/components/NewButton.svelte';
    import SideMenu from '$lib/components/SideMenu.svelte';

    let { data, form } = $props();
    
    let editMode = $state(false);
    let selectedCount = $state(0);

    function toggleEditMode(enabled?: boolean) {
        if (enabled === undefined) editMode = !editMode;
        else editMode = enabled;
        
        if (!editMode) {
            uncheckAllEditCheckboxes();
            selectedCount = 0;
        }
    }

    function longselectCollection(node: HTMLElement) {
        const chbx = document.getElementById('edit-chbx') as HTMLInputElement;
        if (!chbx.checked) {
            chbx.checked = true;
            updateSelectedCount(true);
            toggleEditItem(node, true);
            toggleEditMode(true);
        }
    }

    function openConfirmPopup(popupId: string) {
        const popup = document.getElementById(popupId) as HTMLDialogElement | null;
        if (popup) popup.showModal();
    }

    function collectionClicked(node: HTMLElement) {
        toggleEditItem(node);
        updateSelectedCount((node.querySelector('input') as HTMLInputElement).checked);
    }

    function updateSelectedCount(newCheckedStatus: boolean) {
        if (newCheckedStatus) selectedCount++;
        else selectedCount--;
    }

    function getSelectedIds() {
        const cidElements = document.getElementsByName('cid');
        let cids: string[] = [];
        cidElements.forEach(ele => {
            if (ele instanceof HTMLInputElement) cids.push(ele.value);
        });
        return cids;
    }

</script>


{#if !data.user}
    <div class="main-content">
        <p>You are not logged in.</p>
        <a href={resolve('/account')} class="btn" style="background-color: var(--g-primary-color);">Go to manage account</a>
    </div>

{:else}
<form method="POST">
    <ConfirmPopup id="delete-popup"
        msg="Are you sure you want to delete the selected collections?"
        submitBtnText="Delete"
        formAction="?/deleteCollections" />

    <div class="flex-row top-menu">
        <div>
            <SideMenu>
                <a href={resolve('/account')} class="btn">Manage account</a>
            </SideMenu>
        </div>
        <div>
            <button 
                type="submit"
                disabled={selectedCount < 1}
                formaction="?/favoriteCollections"
                class="{!editMode ? 'remove' : ''}">Favorite</button>
            <button 
                type="submit"
                disabled={selectedCount < 1}
                formaction="?/unFavoriteCollections"
                class="{!editMode ? 'remove' : ''}">Un-favorite</button>
            <button 
                type="button"
                disabled={selectedCount < 1}
                onclick={() => { openConfirmPopup('delete-popup') }}
                class="{!editMode ? 'remove' : ''}">Delete</button>
            <button 
                type="button"
                disabled={selectedCount !== 1}
                onclick={() => goto(resolve(`/update/collection?cid=${getSelectedIds()[0]}&from=/`))}
                class="{!editMode ? 'remove' : ''}">Edit selected</button>
            <label for="edit-chbx" class="btn">
                {#if editMode} Exit edit mode {:else} Edit {/if}
                <input id="edit-chbx"
                    type="checkbox"
                    name="edit-chbx"
                    class="remove"
                    onchange={(e) => {
                        if (e.target instanceof HTMLInputElement) toggleEditMode(e.target.checked);
                    }} />
            </label>
        </div>
    </div>

    <div class="main-content">
        {#if data.favorites.length > 0}
            <h2>Favorites</h2>

            <div class="col-grid" style="--min-cell-w: 10rem; --gap: 10px">
                {#each data.favorites as favCol (favCol.id)}
                    <div class="collection-container">
                        <button type="button" class="collection"
                            style="--bg-color: {favCol.collection_color};"
                            use:longpress={{ threshold: 500, callback: (ele) => longselectCollection(ele) }}
                            onclick={(event) => !editMode ? goto(resolve(`/collection?cid=${favCol.id}`)) : collectionClicked(event.currentTarget as HTMLElement)}>

                            <input type="checkbox" name="cid" value={favCol.id} class="edit-checkbox remove"/>
                            <h3>{favCol.title}</h3>
                        </button>

                        {#if editMode}
                            <svg class="collection-outline" viewBox="0 0 256 170" aria-hidden="true">
                                <path d="m8 0c0 0 85.31 0 91.14 0 6.13 0 8.32 2.94 9.63 6.68 2.04 5.83 5.83 16.04 5.83 16.04 1.46 5.25 5.25 6.41 9.46 6.54 0 0 117.68-0.13 123.22-0.13 5.54 0 8.72 3.5 8.72 9.04 0 6.42 0 123.83 0 123.83 0 4.42-3.58 8-8 8h-240c-4.42 0-8-3.58-8-8v-154c0-4.42 3.58-8 8-8z"/>
                            </svg>
                        {/if}
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
            <div class="collection-container">
                <button type="button" class="collection"
                    style="--bg-color: {col.collection_color};"
                    use:longpress={{ threshold: 500, callback: (ele) => longselectCollection(ele) }}
                    onclick={(event) => !editMode ? goto(resolve(`/collection?cid=${col.id}`)) : collectionClicked(event.currentTarget as HTMLElement)}>

                    <input type="checkbox" name="cid" value={col.id} class="edit-checkbox remove"/>
                    <h3>{col.title}</h3>
                </button>

                {#if editMode}
                    <svg class="collection-outline" viewBox="0 0 256 170" aria-hidden="true">
                        <path d="m8 0c0 0 85.31 0 91.14 0 6.13 0 8.32 2.94 9.63 6.68 2.04 5.83 5.83 16.04 5.83 16.04 1.46 5.25 5.25 6.41 9.46 6.54 0 0 117.68-0.13 123.22-0.13 5.54 0 8.72 3.5 8.72 9.04 0 6.42 0 123.83 0 123.83 0 4.42-3.58 8-8 8h-240c-4.42 0-8-3.58-8-8v-154c0-4.42 3.58-8 8-8z" />
                    </svg>
                {/if}
            </div>
            {/each}
        </div>
    </div>
</form>
{/if}

{#if data.user}
    <NewButton type="collection" pathname="/" />

    {#if form?.error}
        <DiscreteErrorMessage errorMessage={form.error} />
    {/if}
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

    .collection-container {
        position: relative;
        width: 100%;
        aspect-ratio: 3/2;

        &:has(.edit-checkbox:checked) .collection-outline path {
            stroke: var(--g-highlight-color);
        }
    }

    .collection-outline {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        path {
            fill: none;
            stroke: var(--g-focus-outline-color);
            stroke-width: var(--g-outline-size);
        }
    }

    .collection {
        --bg-color: #333333;
        --collection-vector: url('src/lib/assets/collection_vector.svg');

        width: 100%;
        height: 100%;
        background-color: var(--bg-color);

        mask-image: var(--collection-vector);
        mask-size: 100% 100%;
        mask-position: center;
        mask-repeat: no-repeat;
        -webkit-mask-image: var(--collection-vector);
        -webkit-mask-size: 100% 100%;
        -webkit-mask-position: center;
        -webkit-mask-repeat: no-repeat;
    }
</style>
