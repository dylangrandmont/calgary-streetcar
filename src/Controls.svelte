<script>
    export let speed;
    export let showLegend;
    export let allowSound;
    let iconSize = 50;

    $: {
        document.documentElement.style.setProperty('--car-icon-size', `${iconSize}px`);
    }
</script>

<style>
    .root {
        flex: 0 0 auto;
    }
    .grid {
        display: grid;
        grid-template-columns: auto auto;
    }
</style>

<div class="panel-container root">
    <b>Controls</b>
    <p>
        <div class="grid">
            Adjust Speed
            <input type="range" min=0 max=0.0005 step=0.00001 bind:value={speed}>
            Car Icon Size
            <input type="range" min=10 max=100 bind:value={iconSize}>
            Show Legend
            <input type="checkbox" bind:checked={showLegend}/>
            Allow Sound
            <input type="checkbox" bind:checked={allowSound}/>
        </div>
</div>