<script lang="ts">
    import DiscreteErrorMessage from '$lib/components/DiscreteErrorMessage.svelte';

    let { data, form } = $props();
</script>

<div class="main-content">
    <h1>{#if !data.item}New{:else}Update{/if} item</h1>

    <form class="create-form" method="POST">
        <input type="hidden" name="cid" value={data.cid} />
        <input type="hidden" name="iid" value={data.item?.id || ''} />

        <label>
            Title
            <input name="title" type="text" required maxlength="200" value={data.item?.title || ''} />
        </label>

        <label>
            Rating
            <input name="rating" type="number" min="0" max="10" step="0.1" value={data.item?.rating || ''} required />
        </label>

        <label>
            Comment
            <textarea name="comment" maxlength="5000">{data.item?.comment || ''}</textarea>
        </label>

        <button type="submit" class="update-btn">{#if !data.item}Create{:else}Update{/if} item</button>
    </form>
</div>

{#if form?.error}
    <DiscreteErrorMessage errorMessage={form.error} />
{/if}
