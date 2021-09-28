<script>
import { onMount } from "svelte";
    let open;
    const itemKey = 'info-panel-open'

    onMount(() => {
        open = localStorage.getItem(itemKey) === "true" ? true : false;
    })

    $: {
        if (open !== undefined) {
            localStorage.setItem('info-panel-open', open)
        }
    }
</script>


<style>
  .root {
    flex: 1 1 auto;
    overflow: auto;
  }
</style>
<div class="panel-container root">
    <b>Calgary Streetcar</b>
    <p>
      Prior to WW2, streetcar networks were very common throughout North America. These networks had frequent service, were well connected,
      and enabled people to live further beyond walking distance from their employment. These networks enabled the first boom of
      suburbanization, well before the widespread use of private automobiles.
    </p>
    <p>
      Access to these networks was an important contributor to land value. Developers would often petition city governments to construct
      these lines to support new neighbourhoods. In Calgary, street cars connected residents to commercial districts in the city center,
      industrial sectors in Inglewood, Riverside, Manchester, and the CPR rail yards at the sourthern edge of the city. One line of the
      network went to the natural parks at Bowness.
    </p>
    <p>
      In the 1940s and 1950s, these networks were frequently dismantled in favour of bus service, and more importantly, the use of private
      automobiles.
    </p>
</div>
