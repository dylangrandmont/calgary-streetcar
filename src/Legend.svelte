<script>
    import { routes } from './routes'
    import LegendRow from './LegendRow.svelte'
</script>

<style>
    .content {
        margin-block-start: 1em;
    }
</style>

<div class="panel-container">
    <b>Legend</b>
    <div class="content">
    {#each routes as route}
    <LegendRow route={route} />
    {/each}
    <LegendRow route={{color: 'black', name: 'City Boundary (1923- 1950)'}} dashed={true}/>
    </div>
</div>