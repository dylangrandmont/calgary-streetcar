<script>
import { routes } from "./routes";
    export let speed;
    export let selectedId;
</script>

<style>
    .root {
        z-index: 1;
        position: absolute;
        background-color: white;
        padding: 16px 16px 0px;
        top: 0px;
        right: 0px;
        margin: 8px;
        border-radius: 2px;
        border: 1px solid black
    }
</style>

<div class="root">
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