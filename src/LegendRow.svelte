<script>
    export let route;
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
    <div class="line" style={`background-color: ${route.color}`}></div>        
    {route.name}
</div>
