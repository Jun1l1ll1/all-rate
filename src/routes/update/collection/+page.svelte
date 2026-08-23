<script lang="ts">
    let { data, form } = $props();
</script>

<main class="form-content">
    <h1>{#if !data.collection}New{:else}Update{/if} collection</h1>

    {#if form?.error}
        <p class="form-error">{form.error}</p>
    {/if}

    <form method="POST">
        <input type="hidden" name="cid" value="{data.collection?.id || ''}" />

        <label style="width: 6rem;">
            Color
            <div class="color-inp-container">
                <input type="color" value="{data.collection?.collection_color || '#333333'}" name="color" />
            </div>
        </label>

        <label>
            Title
            <input type="text" name="title" required maxlength="120" value="{data.collection?.title || ''}" />
        </label>

        <label>
            Preset (not implemented)
            <select name="preset" disabled>
                <option value="">- None -</option>
            </select>
        </label>

        <label class="checkbox-label">
            <input type="checkbox" name="is_private" checked={!data.collection?.is_public} />
            Private (only visible to you)
        </label>

        <label>
            Description
            <textarea name="description" maxlength="2000">{data.collection?.description || ''}</textarea>
        </label>

        <button type="submit">{#if !data.collection}Create{:else}Update{/if} collection</button>
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
