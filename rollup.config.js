import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import html from '@rollup/plugin-html'
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

const htmlOptions = {
  template: ({ attributes, files, meta, publicPath, title }) => {
    const script = (files.js || [])
      .map(({ fileName }) => {
        return `<script defer src='${fileName}'></script>`
      })
      .join('\n')

    const css = (files.css || [])
      .map(({ fileName }) => {
        return `<link rel='stylesheet' href='${fileName}'>`
      })
      .join('\n')
    return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width,initial-scale=1'>
	<meta name="description" content="Interactive visualization of Calgary Municipal Railway including map and history">

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@dylan_grandmont" />
	<meta name="twitter:creator" content="@dylan_grandmont" />
	<meta property="og:url" content="https://dylangrandmont.github.io/calgary-streetcar/" />
	<meta property="og:title" content="Calgary's Streetcar Network" />
	<meta property="og:description" content="Calgary's streetcar network was first constructed in 1909 and continued operation for over four decades. The map shown here represents the network as it existed in 1945." />
	<meta property="og:image" content="https://dylangrandmont.github.io/calgary-streetcar/car.jpeg" />

	<title>Calgary Streetcar Network</title>

	<link href="https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.js"></script>
	<script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@300;400;500;600;700&display=swap" rel="stylesheet">	<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="./icons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="./icons/favicon-16x16.png">
	<style>
	:root {
		--car-icon-size: 50px;
		--theme-color-light: #fff9f6;
		--theme-color-dark: #222720;
		--theme-color-primary-dark: #a24243;
		--theme-color-primary-main: #bb4e49;
		--theme-color-primary-light: #cd6d5d;
	  }
	  
	  html,
	  body {
		position: relative;
		width: 100%;
		height: 100%;
	  }
	  
	  body {
		margin: 0;
		padding: 0;
		color: var(--theme-color-dark);
		box-sizing: border-box;
		font-family: Newsreader, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
		overflow:hidden;
	  }
	  
	  button {
		background-color: var(--theme-color-primary-dark);
		color: var(--theme-color-light);
		border-radius: 2px;
		padding: 8px 16px;
		font-size: 0.8em;
		border: none;
		cursor: pointer;
	  }
	  
	  #map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	  }
	  .marker {
		background-image: url('./car.jpeg');
		background-size: cover;
		width: var(--car-icon-size);
		height: var(--car-icon-size);
		border-radius: 50%;
		border: 4px solid;
		cursor: pointer;
	  }
	  
	  .panel-container {
		background-color: white;
		padding: 16px;
		border-radius: 2px;
		border: 1px solid var(--theme-color-dark);
		width: 240px;
		overflow: auto;
	  }
	  
	  @media only screen and (max-width: 600px) {
		.panel-container {
		  flex: 0 0  auto !important;
		}
	  }
	  
	  .flex {
		display: flex;
	  }
	</style>
	${css}
	${script}
	</head>

	<body>
		<div id="map"></div>
	</body>
	</html>`
  }
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    dir: 'public/build',
    entryFileNames: production? '[name]-[hash].js' : '[name].js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    postcss({
      extract: true
    }),

    copy({
      targets: [
        { src: ['public/car.jpeg', 'public/Tram-bell-sound-effect.mp3'], dest: 'public/build/' },
        { src: 'public/icons/**/*', dest: 'public/build/icons' }
      ]
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `docs` directory and refresh the
    // browser on changes when not in production
    !production && livereload('docs'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    html(htmlOptions)
  ],
  watch: {
    clearScreen: false
  }
}
