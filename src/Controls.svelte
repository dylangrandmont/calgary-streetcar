<script>
    export let speed;
    export let selectedId;
</script>

<style>
    .root {
        padding: 16px 16px 0px;
    }
</style>

<div class="panel-container root">
    <div>
        Adjust Speed
        <input type="range" min=0 max=0.000005 step=0.0000001 bind:value={speed}>
    </div>
    <hr>
    {#if selectedId}
    <p>Click again to stop tracking</p>
    {:else}
    <p>Click a street car line to track it</p>
    {/if}
</div>