<script lang="ts">
    import DiscreteErrorMessage from '$lib/components/DiscreteErrorMessage.svelte'

    let { data, form } = $props();
</script>

<div class="flex-row" style="--gap: 10px">
    <button onclick={() => {window.location.href = '/'}} class="back-btn">&larr;</button>
    <h1>Account managment</h1>
</div>

<div class="main-content">
    {#if data.signedIn}
        <p>You are signed in!</p>
        <form method="POST" action="?/signOut">
            <button type="submit">Sign out</button>
        </form>

    {:else}
        <form method="POST" action="?/signIn">
            <button type="submit">Sign in with Google</button>
        </form>
    {/if}
</div>

{#if form?.error}
    <DiscreteErrorMessage errorMessage={form.error} />
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
