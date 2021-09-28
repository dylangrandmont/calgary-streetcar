<script>
  export let onToggle
  import { onMount } from 'svelte'

  function toggleTransitionClass() {
    const transition = document.querySelector('.transition')
    const isHidden = transition.classList.contains('hidden')
    if (isHidden) {
      transition.classList.remove('hidden')
    } else {
      transition.classList.add('hidden')
    }
  }
  function toggleSidepanel() {
    onToggle()
    toggleTransitionClass()
  }

  // hack to avoid unused css selector warnings for hidden class
  onMount(() => toggleTransitionClass())
</script>

<div class="transition hidden" on:click={toggleSidepanel} title="Expand/Collapse" />

<style>
  .transition {
    height: 100%;
    position: absolute;
    left: 0px;
    width: 1px;
    background-color: black;
  }
  .transition:hover::before {
    padding: 8px;
  }
  .transition::before {
    transition: padding 0.2s;
    content: '→';
    position: absolute;
    right: 0px;
    border: 1px solid black;
    padding: 4px;
    background: rgba(255, 255, 255, 0.7);
  }
  .transition.hidden::before {
    content: '←';
  }

  @media only screen and (max-width: 600px) {
    .transition {
      position: fixed;
      width: 100%;
      bottom: 216px;
      height: 1px;
    }
    .transition.hidden::before {
      content: '↑';
      top: -30px;
    }
    .transition::before {
      content: '↓';
      left: 0px;
      border: 1px solid black;
      background: rgba(255, 255, 255, 0.7);
      width: min-content;
    }
  }
</style>
