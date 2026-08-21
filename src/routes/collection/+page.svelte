<script lang="ts">
    import { longpress } from '$lib/scripts/actions';
    import NewButton from '$lib/components/NewButton.svelte';

    let { data } = $props();

    let editMode = $state(false);

    function toggleEditMode(newEditMode?: boolean) {
        if (newEditMode === undefined) editMode = !editMode;
        else editMode = newEditMode;

        if (!editMode) {
            // Uncheck all checkboxes when exiting edit mode
            document.querySelectorAll('.list-checkbox').forEach((checkbox) => {
                if (checkbox instanceof HTMLInputElement) checkbox.checked = false;
            });
        }
    }

    function toggleListItem(node: HTMLElement, checked?: boolean) {
        const listCheckbox = node.querySelector('.list-checkbox') as HTMLInputElement | null;
        if (listCheckbox) {
            if (checked !== undefined) listCheckbox.checked = checked;
            else listCheckbox.checked = !listCheckbox.checked;
        }
    }

    function longselectListItem(node: HTMLElement) {
        const editChbx = document.getElementById('edit-chbx') as HTMLInputElement | null;
        if (editChbx) editChbx.checked = true;
        toggleListItem(node, true);
        toggleEditMode(true);
    }
</script>

<div class="flex-row" style="--gap: 10px">
    <button onclick={() => {window.location.href = '/'}} class="back-btn">&larr;</button>
    <h1>{data.collection.title}</h1>
</div>

<div class="flex-row top-menu">
    <div>
        <span>{data.collection.is_public ? 'Public' : 'Private'}</span>
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
    {#if data.items.length === 0}
        <p>No items yet.</p>
    {:else}
        <div class="list-grid">
            {#each data.items as item (item.id)}
                <label class="list-item {editMode ? 'outline btn' : ''}" use:longpress={{ threshold: 500, callback: (ele) => longselectListItem(ele) }}>
                    <input type="checkbox" class="list-checkbox remove" />
                    <div class="list-rating">
                        <h3>{item.rating}</h3>
                    </div>

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

<NewButton type="item" collectionId={data.collection.id} />

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
        padding: 5px 10px;
        gap: 10px;
        border-radius: var(--g-border-radius);

        &:has(> .list-checkbox:checked) {
            outline: 2px solid var(--g-highlight-color);
        }
    }

    .list-rating {
        border-radius: 10px 0 0 10px;

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
