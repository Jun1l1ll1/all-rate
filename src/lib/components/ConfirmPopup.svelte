<script lang="ts">

    let {
        id = '',
        msg = 'Are you sure you want to continue?',
        submitBtnText = 'Continue',
        formAction = '',
    } = $props();

</script>

<dialog id={id}>
    <p>{msg}</p>
    <div class="bottom-row">
        <button type="submit" formaction={formAction}>{submitBtnText}</button>
        <button type="button" onclick={() => {
            const dialog = document.getElementById(id) as HTMLDialogElement | null;
            if (dialog) dialog.close();
        }}>Cancel</button>
    </div>
</dialog>

<style>

</style>
