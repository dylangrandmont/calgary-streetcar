mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5ncmFuZG1vbnQiLCJhIjoiY2t0eDV1cmdkMnBxbzJ3bzI5dm1wbHZ4MCJ9.19ogLLAZwVYbKNoy-E_S5Q'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-114.06, 51.05],
  zoom: 13
})

const hillhurstInglewood = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-114.08592990014981, 51.05253712700806],
      [-114.0947245349653, 51.052520631762604],
      [-114.094731781486, 51.05709687083791],
      [-114.08599386788937, 51.05712357695188],
      [-114.08592962268268, 51.052539528758736],
      [-114.08588112870886, 51.05215697343696],
      [-114.08569923100222, 51.0518089710593],
      [-114.08537300140469, 51.051535538778],
      [-114.0837079102376, 51.0501243555334],
      [-114.08371198530921, 51.04614785036494],
      [-114.04834008539397, 51.04513188716467],
      [-114.0483529394385, 51.04411080434035],
      [-114.04317766836698, 51.04372702045797],
      [-114.0372805028625, 51.0422846914819],
      [-114.03682431075224, 51.04219493204588],
      [-114.01802378219071, 51.03451108917668],
      [-114.01917322421849, 51.03349617324513],
      [-114.01918637603683, 51.02713982395138]
    ]
  }
}

const sunnysideRamsay = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-114.07438791506914, 51.059249914924834],
      [-114.07439302541748, 51.058954415693634],
      [-114.07397908720161, 51.05894718878665],
      [-114.0738134921497, 51.059023623559156],
      [-114.07378617155163, 51.059099756583784],
      [-114.07391265267314, 51.05922502239929],
      [-114.07395225787279, 51.0592523238782],
      [-114.07598880340164, 51.05926055903463],
      [-114.07619997133722, 51.059205465868125],
      [-114.08450858528214, 51.05419424511214],
      [-114.08593936152991, 51.054067658980074],
      [-114.08593093455498, 51.05254113041264],
      [-114.08577077297342, 51.051922371373465],
      [-114.08369765853143, 51.05011674810018],
      [-114.07157412631952, 51.049578034093955],
      [-114.07148474434986, 51.045764491004334],
      [-114.05813966180291, 51.04537576453928],
      [-114.05844021989171, 51.04127328181791],
      [-114.04684772767578, 51.04094865694908],
      [-114.04503824021275, 51.04147175374527],
      [-114.04402950308892, 51.041157896379644],
      [-114.04194443293214, 51.04122328349537],
      [-114.04119794256063, 51.036274899551046],
      [-114.03680515732096, 51.03620362085858],
      [-114.03678306341874, 51.03456621220615],
      [-114.04279105525517, 51.03463817661564],
      [-114.04119794256063, 51.036274899551046]
    ]
  }
}

const riversideManchester = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-114.03245254193595, 51.0532361007371],
      [-114.05027216576363, 51.05327391988086],
      [-114.05037125129785, 51.050621738210474],
      [-114.05154533464692, 51.04891295247008],
      [-114.05294643069912, 51.04800145363462],
      [-114.0530456818646, 51.04758695979581],
      [-114.05320870960337, 51.04526820411377],
      [-114.0655038121198, 51.04559945726983],
      [-114.06580161010373, 51.041488891337764],
      [-114.05843117123706, 51.041277794230425],
      [-114.05891505161102, 51.0350793399651],
      [-114.05947295099163, 51.03361864160707],
      [-114.05956748319745, 51.028709978619666],
      [-114.0593027589476, 51.027660134295886],
      [-114.05892634373404, 51.02510608380651],
      [-114.05932343005291, 51.023279104890236],
      [-114.06782981960919, 51.008736940208166],
      [-114.06791129417206, 51.00860654344027],
      [-114.06779864140104, 51.00859304219302],
      [-114.06771817513604, 51.008680800229925],
      [-114.06776913710388, 51.008873192268275]
    ]
  }
}

const southCalgary = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-114.09474547223127, 51.0304330356334],
      [-114.10944297855941, 51.030420176040515],
      [-114.10930326307387, 51.02316898218637],
      [-114.09472699485453, 51.0232217172826],
      [-114.09474547223127, 51.0304330356334],
      [-114.09472267063069, 51.03781458725867],
      [-114.06605539761398, 51.03781793732603],
      [-114.06548890682399, 51.04560095291732],
      [-114.0812599513191, 51.04605708217247],
      [-114.08154153696147, 51.04194719189309],
      [-114.09467317597523, 51.042302050146354],
      [-114.09472267063069, 51.03781458725867]
    ]
  }
}

const offset = 1e-4;

const killarney = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
    coordinates: [
        [-114.12371714702843, 51.03784613000478],
        [-114.1237226937469, 51.033190262669265],
        [-114.12956914789937, 51.033161877914324],
        [-114.12959468827377, 51.03780459079984],
        [-114.12371714702843, 51.03784613000478,],

        [-114.09472267063069, 51.03781458725867],
        [-114.06605539761398, 51.03781793732603],
        [-114.06548890682399, 51.04560095291732],
        [-114.0812599513191, 51.04605708217247],
        [-114.08154153696147, 51.04194719189309],
        [-114.09467317597523, 51.042302050146354],

        [-114.09470247087306, 51.037818907813254],
    ]
}
}

function offsetRoute(route) {
    return {
        ...route,
        geometry: {
            ...route.geometry,
            coordinates: route.geometry.coordinates.map(value => ([value[0] + offset, value[1] + offset]))
        }
    }
}

const routes = [
    { data: hillhurstInglewood, id: 'hillhurst-inglewood-route', color: 'red'},
    { data: sunnysideRamsay, id:  'sunnyside-ramsay-route', color: 'yellow'},
    { data: riversideManchester, id: 'riverside-manchester-route', color: 'black'},
    { data: southCalgary, id: 'southcalgary-route', color: 'orange' },
    {data: offsetRoute(killarney), id: 'killarney-route', color: 'blue'}
]

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

const markers = streetcars.features.map(({ geometry }) => {
  const el = document.createElement('div')
  el.className = 'marker'

  return new mapboxgl.Marker(el).setLngLat(geometry.coordinates).addTo(map)
})

function animateRoute(coordinates, marker) {
  let trainIndex = 0
  let trainCorodinate = coordinates[trainIndex]

  const speed = 0.000002

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

routes.forEach(({data}, index) => {
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
    routes.forEach(({data, id, color}) => {
        addRouteToMap(id, data, color)
    })
})
