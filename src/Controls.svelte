<script>
    export let speed;
    export let selectedId;
    let iconSize = 50;

    $: {
        document.documentElement.style.setProperty('--car-icon-size', `${iconSize}px`);
    }
</script>

<style>
    .root {
        padding: 16px 16px 0px;
        flex: 0 0 auto;
    }
</style>

<div class="panel-container root">
    <div>
        Adjust Speed
        <input type="range" min=0 max=0.000005 step=0.0000001 bind:value={speed}>
    </div>
    <div>
        Car Icon Size
        <input type="range" min=10 max=100 bind:value={iconSize}>
    </div>
    <hr>
    {#if selectedId}
    <p>Click again to stop tracking</p>
    {:else}
    <p>Click a street car line to track it</p>
    {/if}
</div>