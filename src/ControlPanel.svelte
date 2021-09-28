<script>
  import Controls from './Controls.svelte'
  import SelectedLine from './SelectedLine.svelte'
  import WelcomePanel from './WelcomePanel.svelte'
  export let selectedId
  export let speed
</script>

<style>
    .root {
      position: absolute;
      z-index: 1;
      top: 0px;
      right: 0px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      grid-gap: 8px;
      height: 100%;
      pointer-events: none;
    }

    .root > * {
        pointer-events: all;
    }
  </style>  

<div class="root">
    <div>
        <Controls {selectedId} bind:speed />
    </div>
    <div>
        {#if selectedId}
          <SelectedLine {selectedId} />
        {:else}
          <WelcomePanel />
        {/if}
    </div>
</div>
