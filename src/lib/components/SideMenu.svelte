<script lang="ts">

    let { children = null, id = '' } = $props();

</script>

<label for="side-menu-chbx" class="btn">≡</label>
<input type="checkbox" id="side-menu-chbx" name="side-menu-chbx" class="remove" />

<div id={id} class="side-menu flex-column">
    <label for="side-menu-chbx" class="btn">X</label>
    <br/>
    {@render children()}
</div>


<style>

    .side-menu {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        height: 100vh;
        width: 0;
        display: none;
        z-index: 20;
        background-color: var(--g-background-color);
        box-shadow: 10px 0 10px #00000033;
        justify-content: start;
        padding: 10px;
    }

    #side-menu-chbx:checked + .side-menu {
        width: min(33vw, 300px);
        display: flex;  
    }

</style>
