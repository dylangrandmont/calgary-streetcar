<script>
    import { routes } from './routes'
    import LegendRow from './LegendRow.svelte'

    export let selectedId
    export let stopTracking

    const selectedRoute = routes.find(({id}) => id === selectedId)
</script>

<style>
    button {
        margin-block-start: 1em;
    }
</style>

<div class="panel-container">
    <div class="flex header">
        <LegendRow route={selectedRoute} />
    </div>
    <button on:click={stopTracking}>
        Stop Tracking
    </button>
</div>