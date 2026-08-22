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

    function openConfirmPopup(popupId: string) {
        const popup = document.getElementById(popupId) as HTMLDialogElement | null;
        if (popup) popup.showModal();
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
                formaction="?/favoriteCollections"
                class="{!editMode ? 'remove' : ''}">Favorite</button>
            <button 
                type="submit"
                formaction="?/unFavoriteCollections"
                class="{!editMode ? 'remove' : ''}">Un-favorite</button>
            <button 
                type="button"
                onclick={() => { openConfirmPopup('delete-popup') }}
                class="{!editMode ? 'remove' : ''}">Delete</button>
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
                    <div class="col-grid-item">
                        <button type="button" class="collection {editMode ? 'outline' : ''}"
                            use:longpress={{ threshold: 500, callback: (ele) => longselectCollection(ele) }}
                            onclick={(event) => !editMode ? goto(resolve(`/collection?cid=${favCol.id}`)) : toggleEditItem(event.currentTarget as HTMLElement)}
                        >
                            <input type="checkbox" name="cid" value={favCol.id} class="edit-checkbox remove"/>
                            <h3>{favCol.title}</h3>
                        </button>
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
                    <button type="button" class="collection {editMode ? 'outline' : ''}"
                        use:longpress={{ threshold: 500, callback: (ele) => longselectCollection(ele) }}
                        onclick={(event) => !editMode ? goto(resolve(`/collection?cid=${col.id}`)) : toggleEditItem(event.currentTarget as HTMLElement)}
                    >
                        <input type="checkbox" name="cid" value={col.id} class="edit-checkbox remove"/>
                        <h3>{col.title}</h3>
                    </button>
                </div>
            {/each}
        </div>
    </div>
</form>
{/if}

{#if data.user}
    <NewButton type="collection" />

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
