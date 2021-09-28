<script>
    export let route;
    export let dashed = false;
</script>
<style>
        .line {
        width: 20px;
        height: 4px;
    }
    .row {
        align-items: center;
        gap: 8px
    }
</style>

<div class="flex row">
    {#if dashed} 
    <div class="line" style={`background: repeating-linear-gradient(
        to right,
        ${route.color},
        ${route.color} 2px,
        white 4px,
        white 6px
              )`}></div>        
    {:else} 
    <div class="line" style={`background-color: ${route.color}`}></div>        
    {/if}
    {route.name}
</div>
