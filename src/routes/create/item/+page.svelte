<script lang="ts">
    import { page } from '$app/state';

    let { form } = $props();
    const collectionId = $derived(page.url.searchParams.get('cid') ?? '');
</script>

<main class="form-content">
    <h1>New item</h1>

    {#if form?.error}
        <p class="form-error">{form.error}</p>
    {/if}

    <form method="POST">
        <input type="hidden" name="collection_id" value={collectionId} />

        <label>
            Title
            <input name="title" required maxlength="200" />
        </label>

        <label>
            Rating
            <input name="rating" type="number" min="0" max="10" step="0.1" required />
        </label>

        <label>
            Comment
            <textarea name="comment" maxlength="5000"></textarea>
        </label>

        <button type="submit">Create item</button>
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
