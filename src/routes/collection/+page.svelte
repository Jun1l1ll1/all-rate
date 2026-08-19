<script lang="ts">
    import { page } from '$app/state';
    import NewButton from '$lib/components/NewButton.svelte';

    const cid = $derived(page.url.searchParams.get('cid'));
    let editMode = $state(false);

    const items = [
        {
            iid: 'C1',
            title: 'Title 1',
            rating: 5,
            comment: 'Comment 1'
        },
        {
            iid: 'C2',
            title: 'Title 2',
            rating: 5,
            comment: ''
        },
        {
            iid: 'C3',
            title: 'Title 3',
            rating: 5,
            comment: 'Comment 1'
        },
        {
            iid: 'C4',
            title: 'Title 4',
            rating: 5,
            comment: 'Comment 1'
        },
        {
            iid: 'C5',
            title: 'Title 5',
            rating: 5.7,
            comment: 'Comment 1'
        },
        {
            iid: 'C6',
            title: 'Title 6',
            rating: 5,
            comment: 'Comment 1'
        },
        {
            iid: 'C7',
            title: 'Title 7',
            rating: 5,
            comment: 'Comment 1'
        }
    ]
</script>


{#if cid}

    <div class="flex-row top-menu">
        <div>
            <!-- Left elements -->
        </div>
        <div>
            <!-- Right elements -->
            <input type="checkbox" name="edit-chbx" id="edit-chbx" onchange={(e) => {
                if (e.target instanceof HTMLInputElement) {
                    console.log('edit-chbx changed', e.target.checked);
                    editMode = e.target.checked;
                }
            }} />
        </div>
    </div>

    <div class="main-content">
        <div class="list-grid">
            {#each items as item (item.iid)}
                <div class="list-selecting">
                    <input type="checkbox" class="{editMode ? '': ' remove'}" />
                </div>

                <div class="list-rating list-item-part">
                    <h3>{item.rating}</h3>
                </div>

                <div class="flex-column list-item-part list-item-right">
                    <h2 class="list-title">{item.title}</h2>
                    {#if item.comment}
                        <span class="list-comment">{item.comment}</span>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <NewButton type="item" />

{:else}
    <p>Invalid collection, go back and select a collection.</p>
{/if}


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
        column-gap: 0px;
        row-gap: 10px;
    }

    .list-item-part {
        background-color: #333333;
        padding: 5px 10px;
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
