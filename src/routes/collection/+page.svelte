<script lang="ts">
    import { longpress, uncheckAllEditCheckboxes, toggleEditItem } from '$lib/scripts/common';
    
    import DiscreteErrorMessage from '$lib/components/DiscreteErrorMessage.svelte';
    import ConfirmPopup from '$lib/components/ConfirmPopup.svelte';
    import NewButton from '$lib/components/NewButton.svelte';

    let { data, form } = $props();

    let editMode = $state(false);
    
    function toggleEditMode(enabled?: boolean) {
        if (enabled === undefined) editMode = !editMode;
        else editMode = enabled;
        
        if (!editMode) uncheckAllEditCheckboxes();
    }
    
    function longselectListItem(node: HTMLElement) {
        const editChbx = document.getElementById('edit-chbx') as HTMLInputElement | null;
        if (editChbx) editChbx.checked = true;
        toggleEditItem(node, true);
        toggleEditMode(true);
    }

    function openPopup(popupId: string) {
        const popup = document.getElementById(popupId) as HTMLDialogElement | null;
        if (popup) popup.showModal();
    }

    function copyText(e: Event, text: string) {
        navigator.clipboard.writeText(text);
        let copyBtn = e.target as HTMLDialogElement | null;
        if (copyBtn) copyBtn.innerText = 'URL copied!';
    }

</script>

<div class="flex-row" style="--gap: 10px">
    <button onclick={() => {window.location.href = '/'}} class="back-btn">&larr;</button>
    <h1>{data.collection.title}</h1>
    {#if data.collection.is_public}
        {#if data.is_owner}
            <button onclick={(e) => {copyText(e, window.location.href)}}>Share</button>
        {:else}
            <span>(Read only)</span>
        {/if}
    {:else}
        <span>(Private)</span>
    {/if}
</div>

<form method="POST">
    <ConfirmPopup id="delete-popup"
        msg="Are you sure you want to delete the selected items?"
        submitBtnText="Delete"
        formAction="?/deleteItems&cid={data.collection.id}" />
    
    <dialog id="quick-update-popup">
        <input type="hidden" id="qu-iid" name="qu-iid" value="" />
        <h3>Quick update <span id="qu-item-name"></span></h3>
        <input id="qu-rating" name="qu-rating" type="number" />
        <button type="submit" formaction="?/updateItem&cid={data.collection.id}">Update</button>
        <button type="button" onclick={() => {
            const dialog = document.getElementById('quick-update-popup') as HTMLDialogElement | null;
            if (dialog) dialog.close();
        }}>Cancel</button>
    </dialog>

    <div class="flex-row top-menu">
        <div>
        
        </div>
        <div>
            {#if data.is_owner}
                <button 
                    type="button"
                    onclick={() => { openPopup('delete-popup') }}
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
            {/if}
        </div>
    </div>

    <div class="main-content">
        {#if data.items.length === 0}
            <p>Create a rating with the + button.</p>

        {:else}
            <div class="list-grid">
                {#each data.items as item (item.id)}
                    <label class="list-item {editMode ? 'outline btn' : ''}" use:longpress={{ threshold: 500, callback: (ele) => { if (data.is_owner) longselectListItem(ele) } }}>
                        <input disabled={!editMode} type="checkbox" name="iid" value={item.id} class="edit-checkbox remove" />
                        <button class="list-rating"
                            disabled={editMode || !data.is_owner}
                            type="button"
                            onclick={(e: Event) => {
                                if (!editMode && e.target instanceof HTMLButtonElement) {
                                    (document.getElementById('qu-iid') as HTMLInputElement).value = item.id;
                                    (document.getElementById('qu-rating') as HTMLInputElement).value = String(item.rating);
                                    (document.getElementById('qu-item-name') as HTMLSpanElement).innerText = item.title;
                                    openPopup('quick-update-popup');
                                }
                            }}>
                            <h3>{item.rating}</h3>
                        </button>

                        <div class="flex-column list-item-right">
                            <h2 class="list-title">{item.title}</h2>
                            {#if item.comment}
                                <span class="list-comment">{item.comment}</span>
                            {/if}
                        </div>
                    </label>
                {/each}
            </div>
        {/if}
    </div>
</form>

{#if data.is_owner}
    <NewButton type="item" collectionId={data.collection.id} />
{/if}
{#if form?.error}
    <DiscreteErrorMessage errorMessage={form.error} />
{/if}

<style>
    .list-grid {
        display: grid;
        grid-template-columns: min-content 1fr;
        row-gap: 10px;
    }

    .list-item {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
        background-color: #333333;
        text-align: left;
        padding: 5px 10px 5px 5px;
        gap: 10px;
        border-radius: var(--g-border-radius);

        &:has(> .edit-checkbox:checked) {
            outline: var(--g-outline-size) solid var(--g-highlight-color);
        }
    }

    .list-rating {
        border-radius: var(--g-border-radius);
        padding: 0 5px;
        background-color: transparent;

        > h3 {
            margin: 0;
            font-size: 2rem;
            font-weight: bold;
        }
    }

    .list-item-right {
        border-radius: 0 10px 10px 0;

        .list-title {
            margin: 0;
            font-size: 1.2rem;
        }

        .list-comment {
            font-size: 0.8rem;
        }
    }
</style>
