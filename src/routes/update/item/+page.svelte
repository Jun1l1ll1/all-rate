<script lang="ts">
    let { data, form } = $props();
</script>

<main class="form-content">
    <h1>{#if !data.item}New{:else}Update{/if} item</h1>

    {#if form?.error}
        <p class="form-error">{form.error}</p>
    {/if}

    <form method="POST">
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

        <button type="submit">{#if !data.item}Create{:else}Update{/if} item</button>
    </form>
</main>

<style>
    .form-content {
        padding: 1rem;
        max-width: 40rem;
    }
    form,
    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    form {
        gap: 1rem;
    }
    textarea {
        min-height: 6rem;
        resize: vertical;
    }
    .form-error {
        color: #ff8f8f;
    }
</style>
