<script lang="ts">

    function goBack() {
        if (window.history.length > 1) {
            history.back();
        } else {
            window.location.href = '/';
        }
    }

    let { children } = $props();

</script>


 <div class="flex-row" style="--gap: 10px">
    <button onclick={goBack} class="back-btn">&larr; Cancel</button>
</div>

{@render children()}
