<script lang="ts">
    let { form } = $props();
</script>

<main class="form-content">
    <h1>New collection</h1>

    {#if form?.error}
        <p class="form-error">{form.error}</p>
    {/if}

    <form method="POST">
        <label>
            Title
            <input name="title" required maxlength="120" />
        </label>

        <label>
            Description
            <textarea name="description" maxlength="2000"></textarea>
        </label>

        <label class="checkbox-label">
            <input type="checkbox" name="is_public" />
            Public read-only collection
        </label>

        <button type="submit">Create collection</button>
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
    .checkbox-label {
        flex-direction: row;
        align-items: center;
    }
    textarea {
        min-height: 6rem;
        resize: vertical;
    }
    .form-error {
        color: #ff8f8f;
    }
</style>
