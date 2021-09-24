<script>
  import Controls from './Controls.svelte'
  import SelectedLine from './SelectedLine.svelte'
  import WelcomePanel from './WelcomePanel.svelte'
  import { routes } from './routes'

  let speed = 0.000002
  let selectedId
  let trackIndex
  let shouldTrackCamera

  const defaultCenter = [-114.06, 51.05]

  mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5ncmFuZG1vbnQiLCJhIjoiY2t0eDV1cmdkMnBxbzJ3bzI5dm1wbHZ4MCJ9.19ogLLAZwVYbKNoy-E_S5Q'
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: defaultCenter,
    zoom: 13
  })

  const streetcars = {
    type: 'FeatureCollection',
    features: routes.map(({ data }) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: data.geometry.coordinates[0]
      }
    }))
  }

  const markers = streetcars.features.map(({ geometry }, index) => {
    const { id, color } = routes[index]
    const el = document.createElement('div')
    el.className = 'marker'
    el.style.color = color
    el.id = `marker-${id}`

    el.addEventListener('click', function (e) {
      e.stopPropagation()
      if (selectedId === id) {
        selectedId = ''
      } else {
        selectedId = id
      }
    })

    return new mapboxgl.Marker(el).setLngLat(geometry.coordinates).addTo(map)
  })

  function animateRoute(coordinates, marker, index) {
    let trainIndex = 0
    let trainCoordinate = coordinates[trainIndex]

    function animateMarker() {
      const nextPoint = coordinates[(trainIndex + 1) % coordinates.length]
      const lastPoint = coordinates[trainIndex % coordinates.length]
      const distanceBetweenPoints = Math.sqrt((nextPoint[0] - lastPoint[0]) ** 2 + (nextPoint[1] - lastPoint[1]) ** 2)
      const distanceInTimeInterval = speed * 1
      const distanceToNextPoint = Math.sqrt((nextPoint[0] - trainCoordinate[0]) ** 2 + (nextPoint[1] - trainCoordinate[1]) ** 2)

      if (distanceInTimeInterval > distanceToNextPoint) {
        trainCoordinate = nextPoint
        trainIndex++
      } else {
        const newX = (distanceInTimeInterval / distanceBetweenPoints) * (nextPoint[0] - lastPoint[0]) + trainCoordinate[0]
        const newY = (distanceInTimeInterval / distanceBetweenPoints) * (nextPoint[1] - lastPoint[1]) + trainCoordinate[1]
        trainCoordinate = [newX, newY]
      }

      if (trackIndex === index) {
        map.setCenter(trainCoordinate)
      }
      marker.setLngLat(trainCoordinate)

      requestAnimationFrame(animateMarker)
    }
    requestAnimationFrame(animateMarker)
  }

  $: trackIndex = routes.findIndex(({ id }) => id === selectedId)
  $: shouldTrackCamera = trackIndex > -1

  $: {
    if (shouldTrackCamera) {
		map.setPitch(45)
		map.setZoom(18)
	} else {
      map.flyTo({
		  pitch: 0,
        center: defaultCenter,
		zoom: 13,
      })
    }
  }

  function handleStopTracking() {
    selectedId = ''
  }

  routes.forEach(({ data }, index) => {
    animateRoute(data.geometry.coordinates, markers[index], index)
  })

  function addRouteToMap(id, data, color) {
    map.addSource(id, {
      type: 'geojson',
      data: data
    })
    map.addLayer({
      id,
      type: 'line',
      source: id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': 8
      }
    })
  }

  map.on('load', () => {
    routes.forEach(({ data, id, color }) => {
      addRouteToMap(id, data, color)
    })
  })
  routes.forEach(({ id }) => {
    map.on('click', id, (event) => {
      const routeId = event.features[0]?.layer.id
      selectedId = selectedId === routeId ? '' : routeId
    })
  })
</script>

<div style="position: absolute; z-index: 1; top: 0px; right: 0px; padding: 8px; display: grid; grid-gap: 8px;">
	<Controls selectedId={selectedId} bind:speed />
	{#if selectedId}
	<SelectedLine selectedId={selectedId}/>
	{:else}
	<WelcomePanel />
	{/if}
</div>