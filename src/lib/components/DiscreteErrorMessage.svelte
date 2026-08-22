<script lang="ts">

    let {
        id = '',
        errorMessage = '',
    } = $props();

    let hide = $state(false);

</script>

<div class="error-container">
    {#if errorMessage && !hide}
        <div class="error-bg"></div>
        <button class="error-remove-btn" type="button" onclick={() => {hide = true}}>X</button>
        <span id={id} class="error-message"><b>Error:</b> {errorMessage}</span>
    {/if}
</div>

<style>

.error-container {
    --offset: 30px;

    position: absolute;
    bottom: var(--offset);
    left: var(--offset);
    z-index: 10;
    max-width: 60%;
    padding: 10px;
}

.error-bg {
    width: 100%;
    height: 100%;
    border-radius: var(--g-border-radius);
    position: absolute;
    background-color: var(--g-error-color);
    inset: 0;
    opacity: .25;
    z-index: -1;
}

.error-remove-btn {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    color: var(--g-error-color);
    font-weight: bold;
}

.error-message {
    word-wrap: break-word;

    > b {
        color: var(--g-error-color);
    }
}

</style>
