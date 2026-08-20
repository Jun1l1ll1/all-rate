<script lang="ts">
    import { longpress } from '$lib/scripts/actions';
    import NewButton from '$lib/components/NewButton.svelte';

    let { data } = $props();

    let editMode = $state(false);

    function toggleEditMode(newEditMode: boolean) {
        editMode = newEditMode;

        if (!newEditMode) {
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
                <button
                    class="list-row"
                    onclick={(e) => {
                        if (editMode && e.target instanceof HTMLElement) toggleListItem(e.target);
                    }}
                    use:longpress={{ threshold: 500, callback: (ele) => longselectListItem(ele) }}
                >
                    <div class="list-selecting">
                        <input type="checkbox" class="list-checkbox {editMode ? '' : ' remove'}" />
                    </div>

                    <div class="list-item">
                        <div class="list-rating">
                            <h3>{item.rating}</h3>
                        </div>

                        <div class="flex-column list-item-right">
                            <h2 class="list-title">{item.title}</h2>
                            {#if item.comment}
                                <span class="list-comment">{item.comment}</span>
                            {/if}
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    {/if}
</div>

<NewButton type="item" collectionId={data.collection.id} />

<style>
    .top-menu {
        justify-content: space-between;
        box-shadow: 0 10px 10px #00000033;
        padding: 5px;
        margin-bottom: 5px;
    }

    .list-grid {
        display: grid;
        grid-template-columns: min-content min-content 1fr;
        row-gap: 10px;
    }

    .list-row {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
        background-color: transparent;

        &:hover::before,
        &:active::before {
            opacity: 0; /* No hover effect */
        }
    }

    .list-item {
        display: grid;
        grid-column: 2 / -1;
        grid-template-columns: subgrid;
        background-color: #333333;
        text-align: left;
        padding: 5px 10px;
        gap: 10px;
        border-radius: var(--g-border-radius);
    }

    .list-selecting {
        display: flex;
        justify-content: center;

        > input {
            margin-right: 10px;
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
