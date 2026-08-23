<script lang="ts">
    import DiscreteErrorMessage from '$lib/components/DiscreteErrorMessage.svelte';

    let { data, form } = $props();
</script>

<div class="main-content">
    <h1>{#if !data.collection}New{:else}Update{/if} collection</h1>

    <form class="create-form" method="POST">
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

        <button type="submit" class="update-btn">{#if !data.collection}Create{:else}Update{/if} collection</button>
    </form>
</div>

{#if form?.error}
    <DiscreteErrorMessage errorMessage={form.error} />
{/if}
