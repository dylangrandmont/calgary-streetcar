import { intersections } from './intersections'

function route(coordinates) {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates
    }
  }
}

const hillhurstInglewood = route([
  intersections['Kensington Rd']['10 St NW'],
  intersections['Kensington Rd']['14 St NW'],
  intersections['5 Av N']['14 St NW'],
  intersections['5 Av N']['10 St NW'],
  intersections['Kensington Rd']['10 St NW'],
  intersections['Memorial Dr']['10 St NW'],
  intersections['4 Av S']['9 St SW'],
  intersections['8 Av S']['9 St SW'],
  intersections['8 Av S']['6 St SE'],
  intersections['9 Av S']['6 St E'],
  [-114.04317766836698, 51.04372702045797],
  [-114.0372805028625, 51.0422846914819],
  [-114.03682431075224, 51.04219493204588],
  [-114.01802378219071, 51.03451108917668],
  [-114.01917322421849, 51.03349617324513],
  [-114.01918637603683, 51.02713982395138]
])

const sunnysideRamsay = route([
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
])

const southManchester = [
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
const riversideManchester = route([
  intersections['1 Av N']['12A St NE'],
  intersections['1 Av N']['Edmonton Trail NE'],
  intersections['Memorial Dr']['Edmonton Trail NE'],
  intersections['Riverfront Av S']['Edmonton Trail NE'],
  intersections['5 Av S']['4St SE'],
  intersections['8 Av S']['4 St SE'],
  intersections['8 Av S']['1 St SW'],
  intersections['12 Av S']['1 St SW'],
  intersections['12 Av S']['2 St SE'],
  intersections['17 Av S']['2 St SE'],
  ...southManchester,
  ...[...southManchester].reverse(),
  intersections['17 Av S']['2 St SE'],
  intersections['12 Av S']['2 St SE'],
  intersections['12 Av S']['1 St SW'],
  intersections['8 Av S']['1 St SW'],
  intersections['8 Av S']['4 St SE'],
  intersections['5 Av S']['4St SE'],
  intersections['Riverfront Av S']['Edmonton Trail NE'],
  intersections['Memorial Dr']['Edmonton Trail NE'],
  intersections['1 Av N']['Edmonton Trail NE'],
  intersections['1 Av N']['12A St NE'],

])

const southCalgary = route([
  intersections['26 Av S']['14 St SW'],
  intersections['26 Av S']['20 St SW'],
  intersections['34 Av S']['20 St SW'],
  intersections['34 Av S']['14 St SW'],
  intersections['26 Av S']['14 St SW'],
  intersections['17 Av S']['14 St SW'],
  intersections['17 Av S']['1 St SW'],
  intersections['8 Av S']['1 St SW'],
  intersections['8 Av S']['8 St SW'],
  intersections['12 Av S']['8 St SW'],
  intersections['12 Av S']['14 St SW'],
  intersections['17 Av S']['14 St SW']
])

const offset = 1e-4

const killarney = route(
  [
    intersections['17 Av S']['26 St SW'],
    intersections['17 Av S']['29 St SW'],
    intersections['23 Av S']['29 St SW'],
    intersections['23 Av S']['26 St SW'],
    intersections['17 Av S']['26 St SW'],

    intersections['17 Av S']['14 St SW'],
    intersections['17 Av S']['1 St SW'],
    intersections['8 Av S']['1 St SW'],
    intersections['8 Av S']['8 St SW'],
    intersections['12 Av S']['8 St SW'],
    intersections['12 Av S']['14 St SW'],
    intersections['17 Av S']['14 St SW']
  ],
  'killarney-route'
)

const crescentHeights = route([
  intersections['16 Av N']['10 St NW'],
  intersections['16 Av N']['Edmonton Trail'],
  [-114.05624889447328, 51.064177528209555],
  [-114.05617332900455, 51.06366447705205],
  [-114.055130964576, 51.060773093744004],
  [-114.05441634348082, 51.059737261561885],
  [-114.0543247069982, 51.05940321266864],
  [-114.0543155433623, 51.057306712815574],
  [-114.05419641589222, 51.057053283320336],
  [-114.05091582965353, 51.05462259367253],
  [-114.0505461201982, 51.054277121167935],
  [-114.05031132244514, 51.05379827082477],
  [-114.05026958062238, 51.053542444639504],
  [-114.05027216576363, 51.05327391988086],
  [-114.05037125129785, 51.050621738210474],
  [-114.05154533464692, 51.04891295247008],
  [-114.05294643069912, 51.04800145363462],
  [-114.0530456818646, 51.04758695979581],
  intersections['8 Av S']['4 St SE'],
  intersections['8 Av S']['1 St SW'],
  intersections['8 Av S']['4 St SW'],
  intersections['4 Av S']['4 St SW'],
  intersections['4 Av S']['9 St SW'],
  [-114.08577077297342, 51.051922371373465],
  [-114.08593093455498, 51.05254113041264],
  intersections['Kensington Rd']['10 St NW'],
  intersections['5 Av N']['10 St NW'],
  [-114.08600802217786, 51.060942096287185],
  [-114.08531548906264, 51.06224265404931],
  [-114.08458173372296, 51.06297582091535],
  [-114.08442921154641, 51.0635328127249],
  [-114.08489350460921, 51.066904001348]
])

const mountPleasant = route([
  intersections['20 Av N']['7 St NW'],
  intersections['20 Av N']['Center St'],
  intersections['8 Av S']['Center St'],
  intersections['8 Av S']['1 St SW'],
  intersections['12 Av S']['1 St SW'],
  [-114.07156268197173, 51.041667315481085],
  [-114.07151627155552, 51.02970016087958],
  [-114.07314144774193, 51.02963947142243],
  [-114.0755837013509, 51.02889675928498],
  [-114.0781177043355, 51.02739885277752],
  [-114.07846226790436, 51.02707203118832],
  [-114.07883916075279, 51.02612382969992],
  [-114.07791852502602, 51.023378286034514],
  [-114.0778335229034, 51.01850581066723]
])

const toElbowPark = [
  intersections['8 Av S']['Center St'],
  intersections['8 Av S']['1 St SW'],
  intersections['12 Av S']['1 St SW'],
  [-114.07156268197173, 51.041667315481085],
  [-114.07151627155552, 51.02970016087958],
  [-114.07314144774193, 51.02963947142243],
  [-114.0755837013509, 51.02889675928498],
  [-114.0781177043355, 51.02739885277752],
  [-114.07846226790436, 51.02707203118832],
  [-114.07883916075279, 51.02612382969992],
  [-114.07791852502602, 51.023378286034514],
  [-114.0778335229034, 51.01850581066723]

]
const tuxedoPark = route([
  intersections['31 Av N']['Center St'],
  intersections['23 Av N']['Center St'],
  intersections['23 Av N']['Edmonton Trail'],
  intersections['19 Av N']['Edmonton Trail'],
  intersections['16 Av N']['Edmonton Trail'],
  intersections['16 Av N']['Center St'],
  ...toElbowPark,
  ...[...toElbowPark].reverse(),
  intersections['31 Av N']['Center St']
])

const ogden = route([
  [-113.99880112307753, 50.983248488266135],
  [-113.99880112307753, 50.987371763615506],
  [-113.99888670668788, 50.987545713885496],
  [-114.00005187171867, 50.98878996323262],
  [-114.00159999561538, 50.990490665877374],
  [-114.00166551550875, 50.9906080452611],
  [-114.00172095541853, 50.99114100737745],
  [-114.0017864753119, 50.99130914296567],
  [-114.01110138901603, 51.00105099313635],
  [-114.01172122501146, 51.001818058317504],
  [-114.01230252185889, 51.003199148246],
  [-114.01234337044255, 51.00500831623873],
  [-114.01191629520771, 51.006180298382226],
  [-114.01058666914153, 51.0100959143063],
  [-114.01058666914994, 51.010828735644054],
  [-114.0109922438028, 51.011594259836336],
  [-114.01142901650589, 51.01201954559441],
  [-114.01180339320818, 51.01231397195058],
  [-114.01423684112537, 51.01387112894279],
  [-114.01454882176026, 51.01425713882235],
  [-114.01788701336052, 51.01798622084238],
  [-114.01891949877961, 51.01852163349035],
  [-114.01975743774038, 51.018580202515885],
  [-114.02820685105861, 51.01862211037978],
  [-114.02906393494493, 51.01869751785368],
  [-114.02948348649765, 51.019025538938045],
  [-114.03073148263177, 51.02138176798409],
  [-114.03082952608338, 51.02189981247443],
  [-114.03092064513434, 51.028443729037924],
  [-114.03100045091638, 51.02887663830172],
  [-114.03176858158336, 51.0298177314818],
  [-114.0307610335851, 51.03031964001304],
  [-114.02702472821282, 51.03300216008723],
  [-114.02584759269875, 51.03359186156952],
  [-114.02220645389316, 51.033472667201714],
  [-114.02206782333698, 51.03636936360178],
  [-114.03682431075224, 51.04219493204588],
  [-114.0372805028625, 51.0422846914819],
  [-114.04317766836698, 51.04372702045797],
  intersections['9 Av S']['6 St E'],
  intersections['8 Av S']['6 St SE'],
  intersections['8 Av S']['Center St']
])

const capitolHill = route([
  intersections['20 Av N']['15 St NW'],
  intersections['20 Av N']['10 St NW'],
  intersections['16 Av N']['10 St NW'],
  intersections['20 Av N']['10 St NW'],
  intersections['20 Av N']['15 St NW'],
])

const grandTrunk = route([
  intersections['7 Av N']['24 St NW'],
  [-114.11749161875599, 51.05912442302438],
  [-114.10647790194818, 51.059137846330714],
  [-114.10588883907864, 51.05925817306614],
  [-114.10568580828625, 51.059485094360774],
  [-114.10541778468061, 51.059603569029434],
  [-114.10520277673322, 51.05964614578945],
  [-114.09474606923256, 51.05970225119184],
  intersections['8 Av N']['14 St NW'],
  intersections['Kensington Rd']['14 St NW'],
  intersections['Kensington Rd']['10 St NW'],
  intersections['4 Av S']['9 St SW'],
  intersections['8 Av S']['9 St SW'],
  intersections['8 Av S']['Center St'],
  intersections['8 Av S']['9 St SW'],
  intersections['4 Av S']['9 St SW'],
  intersections['Kensington Rd']['10 St NW'],
  intersections['Kensington Rd']['14 St NW'],
  intersections['Kensington Rd']['24 St NW'],
  intersections['7 Av N']['24 St NW']
])

const Kensington14thToBowness = [
  [-114.17316207239337, 51.07984729297398],
  [-114.1720129582852, 51.07833621726261],
  [-114.17126962026164, 51.07768303320474],
  [-114.17077740996558, 51.07739588174196],
  [-114.16840107868614, 51.07567743822706],
  [-114.16763262787953, 51.075361873392566],
  [-114.16693165330277, 51.07529963380956],
  [-114.16574130792006, 51.07541323754493],
  [-114.16574130792006, 51.075416393199546],
  [-114.16423454167781, 51.07523967616143],
  [-114.16348115846756, 51.074816814789145],
  [-114.1526520281249, 51.06671232422135],
  [-114.15148177301391, 51.06584750392453],
  [-114.15113894412244, 51.065417418079356],
  [-114.15054294822237, 51.06405123585141],
  [-114.14912764908298, 51.06346210971278],
  [-114.14132759415365, 51.060139844346935],
  [-114.14068499379347, 51.05985019419703],
  [-114.13444515725314, 51.056738485476366],
  [-114.13370519322709, 51.05643249447681],
  [-114.12638789806529, 51.05447084161884],
  [-114.12583617050362, 51.05429131835533],
  [-114.12190382103606, 51.05260445393406],
  [-114.12133858712923, 51.05248009534121],
  [-114.11796612252739, 51.052485028711544],
]

const bowness = route([
  ...Kensington14thToBowness,
  intersections['Kensington Rd']['14 St NW'],
  intersections['Kensington Rd']['10 St NW'],
  intersections['Memorial Dr']['10 St NW'],
  intersections['4 Av S']['9 St SW'],
  intersections['8 Av S']['9 St SW'],
  intersections['8 Av S']['Center St'],
  intersections['8 Av S']['9 St SW'],
  intersections['4 Av S']['9 St SW'],
  intersections['Memorial Dr']['10 St NW'],
  intersections['Kensington Rd']['10 St NW'],
  intersections['Kensington Rd']['14 St NW'],
  ...([...Kensington14thToBowness].reverse()),
])

const beltline = route([
  intersections['17 Av S']['1 St SW'],
  intersections['8 Av S']['1 St SW'],
  intersections['8 Av S']['8 St SW'],
  intersections['12 Av S']['8 St SW'],
  intersections['12 Av S']['14 St SW'],
  intersections['17 Av S']['14 St SW'],
  intersections['17 Av S']['2 St SE'],
  intersections['8 Av S']['2 St SE'],
  intersections['8 Av S']['1 St SW']
])

const sunalta = route([
  intersections['12 Av S']['18 St SW'],
  intersections['12 Av S']['2 St SE'],
  intersections['8 Av S']['2 St SE'],
  intersections['8 Av S']['Center St']
])

function offsetRoute(route) {
  return {
    ...route,
    geometry: {
      ...route.geometry,
      coordinates: route.geometry.coordinates.map((value) => [value[0] + offset, value[1] + offset])
    }
  }
}

function sortByName(a, b) {
  return a.name < b.name ? -1 : 1
}

export const routes = [
  { data: hillhurstInglewood, id: 'hillhurst-inglewood-route', color: '#e7067d', name: 'No. 1 Hillhurst - E Calgary' },
  { data: sunnysideRamsay, id: 'sunnyside-ramsay-route', color: '#fee300', name: 'No. 8 Burns Avenue-Sunnyside' },
  { data: riversideManchester, id: 'riverside-manchester-route', color: 'black', name: 'No. 9 Manchester-Riverside' },
  { data: southCalgary, id: 'southcalgary-route', color: '#f29517', name: 'No. 7 South Calgary' },
  { data: offsetRoute(killarney), id: 'killarney-route', color: '#2f71bc', name: 'No. 6 Killarney' },
  { data: offsetRoute(crescentHeights), id: 'crescent-height-route', color: '#00aaef', name: 'No. 4 Crescent Heights' },
  { data: mountPleasant, id: 'mount-pleasant-route', color: '#e82326', name: 'No. 2 Mount Pleasant' },
  { data: offsetRoute(tuxedoPark), id: 'tuxedo-park-route', color: '#4a4ca5', name: 'No. 3 Tuxedo Park' },
  { data: offsetRoute(ogden), id: 'ogden-route', color: '#835A39', name: 'No. O Ogden - Downtown' },
  { data: capitolHill, id: 'capitol-hill-route', color: '#b20168', name: 'No. C Capitol Hill - Rosedale' },
  { data: offsetRoute(grandTrunk), id: 'grand-trunk-route', color: '#74cabe', name: 'No. A Grand Trunk' },
  { data: offsetRoute(offsetRoute(bowness)), id: 'bowness-route', color: '#b6449f', name: 'No. B Bowness' },
  { data: offsetRoute(offsetRoute(beltline)), id: 'beltline-route', color: '#3aba72', name: 'No. 5 Beltline' },
  { data: sunalta, id: 'sunalta-route', color: '#d7e34d', name: 'No. S Sunalta' }
].sort(sortByName)
