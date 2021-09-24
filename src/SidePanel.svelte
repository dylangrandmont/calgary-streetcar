<script>
import { routes } from "./routes";


    export let speed;
    export let selectedId;

    const routeToName = (id) => routes.find(route => route.id === id)?.name ?? '';

</script>

<style>
    .root {
        z-index: 1;
        position: absolute;
        background-color: white;
        padding: 16px;
    }
</style>

<div class="root">
    Adjust Speed
    <input type="range" min=0 max=0.0002 step=0.000001 bind:value={speed}>
    {routeToName(selectedId)}
</div>