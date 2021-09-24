<script>
    import { routes } from './routes'

    export let selectedId

    const selectedRoute = routes.find(({id}) => id === selectedId)
</script>

<style>
    .line {
        width: 100%;
        height: 4px;
    }
</style>

<div class="panel-container">
    {selectedRoute.name}
    <div class="line" style={`background-color: ${selectedRoute.color}`}></div>
</div>