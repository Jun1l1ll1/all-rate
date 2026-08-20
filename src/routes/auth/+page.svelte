<script lang="ts">
    let { data, form } = $props();
</script>

<main class="auth-content">
    <h1>Sign in</h1>

    {#if data.signedIn}
        <p>You are already signed in.</p>
    {:else}
        {#if data.sent}
            <p>Check your email for a sign-in link.</p>
        {/if}
        {#if form?.error}
            <p class="form-error">{form.error}</p>
        {/if}

        <form method="POST">
            <label>
                Email
                <input name="email" type="email" autocomplete="email" required />
            </label>
            <button type="submit">Send sign-in link</button>
        </form>
    {/if}
</main>

<style>
    .auth-content {
        padding: 1rem;
        max-width: 30rem;
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
    .form-error {
        color: #ff8f8f;
    }
</style>
