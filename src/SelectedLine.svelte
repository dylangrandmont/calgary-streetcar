<script>
    import { routes } from './routes'

    export let selectedId

    const selectedRoute = routes.find(({id}) => id === selectedId)
</script>

<style>
        .root {
        background-color: white;
        padding: 16px;
        border-radius: 2px;
        border: 1px solid black
    }
    .line {
        width: 100%;
        height: 4px;
    }
</style>

<div class="root">
    {selectedRoute.name}
    <div class="line" style={`background-color: ${selectedRoute.color}`}></div>
</div>