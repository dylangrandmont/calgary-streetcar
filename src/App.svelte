<script>
import SidePanel from './SidePanel.svelte';
import { routes } from './routes'

let speed = 0.000002;
let selectedId;

mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5ncmFuZG1vbnQiLCJhIjoiY2t0eDV1cmdkMnBxbzJ3bzI5dm1wbHZ4MCJ9.19ogLLAZwVYbKNoy-E_S5Q'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-114.06, 51.05],
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
  const el = document.createElement('div')
  el.className = 'marker'
  el.style.color = routes[index].color

  return new mapboxgl.Marker(el).setLngLat(geometry.coordinates).addTo(map)
})

function animateRoute(coordinates, marker) {
  let trainIndex = 0
  let trainCorodinate = coordinates[trainIndex]

  function animateMarker() {
    const nextPoint = coordinates[(trainIndex + 1) % coordinates.length]
    const lastPoint = coordinates[trainIndex % coordinates.length]
    const distanceBetweenPoints = Math.sqrt((nextPoint[0] - lastPoint[0]) ** 2 + (nextPoint[1] - lastPoint[1]) ** 2)
    const distanceInTimeInterval = speed * 1
    const distanceToNextPoint = Math.sqrt((nextPoint[0] - trainCorodinate[0]) ** 2 + (nextPoint[1] - trainCorodinate[1]) ** 2)

    if (distanceInTimeInterval > distanceToNextPoint) {
      trainCorodinate = nextPoint
      trainIndex++
    } else {
      const newX = (distanceInTimeInterval / distanceBetweenPoints) * (nextPoint[0] - lastPoint[0]) + trainCorodinate[0]
      const newY = (distanceInTimeInterval / distanceBetweenPoints) * (nextPoint[1] - lastPoint[1]) + trainCorodinate[1]
      trainCorodinate = [newX, newY]
    }

    marker.setLngLat(trainCorodinate)
    marker.addTo(map)
    requestAnimationFrame(animateMarker)
  }
  requestAnimationFrame(animateMarker)
}

routes.forEach(({ data }, index) => {
  animateRoute(data.geometry.coordinates, markers[index])
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
routes.forEach(({id}, index) => {
	map.on('click', id, (event) => {
		selectedId = event.features[0]?.layer.id
	})
})
</script>

<SidePanel selectedId={selectedId} bind:speed={speed} ></SidePanel>
