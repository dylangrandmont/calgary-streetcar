
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Controls.svelte generated by Svelte v3.43.0 */

    const file$6 = "src/Controls.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let b;
    	let t1;
    	let p;
    	let div0;
    	let t2;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let input2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			b = element("b");
    			b.textContent = "Controls";
    			t1 = space();
    			p = element("p");
    			div0 = element("div");
    			t2 = text("Adjust Speed\n            ");
    			input0 = element("input");
    			t3 = text("\n            Car Icon Size\n            ");
    			input1 = element("input");
    			t4 = text("\n            Legend\n            ");
    			input2 = element("input");
    			add_location(b, file$6, 21, 4, 378);
    			add_location(p, file$6, 22, 4, 398);
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "0.000005");
    			attr_dev(input0, "step", "0.0000001");
    			add_location(input0, file$6, 25, 12, 466);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "min", "10");
    			attr_dev(input1, "max", "100");
    			add_location(input1, file$6, 27, 12, 578);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$6, 29, 12, 667);
    			attr_dev(div0, "class", "grid svelte-1v00eo1");
    			add_location(div0, file$6, 23, 8, 410);
    			attr_dev(div1, "class", "panel-container root svelte-1v00eo1");
    			add_location(div1, file$6, 20, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, b);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, div0);
    			append_dev(div0, t2);
    			append_dev(div0, input0);
    			set_input_value(input0, /*speed*/ ctx[0]);
    			append_dev(div0, t3);
    			append_dev(div0, input1);
    			set_input_value(input1, /*iconSize*/ ctx[2]);
    			append_dev(div0, t4);
    			append_dev(div0, input2);
    			input2.checked = /*showLegend*/ ctx[1];

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[3]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[3]),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[4]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*speed*/ 1) {
    				set_input_value(input0, /*speed*/ ctx[0]);
    			}

    			if (dirty & /*iconSize*/ 4) {
    				set_input_value(input1, /*iconSize*/ ctx[2]);
    			}

    			if (dirty & /*showLegend*/ 2) {
    				input2.checked = /*showLegend*/ ctx[1];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Controls', slots, []);
    	let { speed } = $$props;
    	let { showLegend } = $$props;
    	let iconSize = 50;
    	const writable_props = ['speed', 'showLegend'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		speed = to_number(this.value);
    		$$invalidate(0, speed);
    	}

    	function input1_change_input_handler() {
    		iconSize = to_number(this.value);
    		$$invalidate(2, iconSize);
    	}

    	function input2_change_handler() {
    		showLegend = this.checked;
    		$$invalidate(1, showLegend);
    	}

    	$$self.$$set = $$props => {
    		if ('speed' in $$props) $$invalidate(0, speed = $$props.speed);
    		if ('showLegend' in $$props) $$invalidate(1, showLegend = $$props.showLegend);
    	};

    	$$self.$capture_state = () => ({ speed, showLegend, iconSize });

    	$$self.$inject_state = $$props => {
    		if ('speed' in $$props) $$invalidate(0, speed = $$props.speed);
    		if ('showLegend' in $$props) $$invalidate(1, showLegend = $$props.showLegend);
    		if ('iconSize' in $$props) $$invalidate(2, iconSize = $$props.iconSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*iconSize*/ 4) {
    			{
    				document.documentElement.style.setProperty('--car-icon-size', `${iconSize}px`);
    			}
    		}
    	};

    	return [
    		speed,
    		showLegend,
    		iconSize,
    		input0_change_input_handler,
    		input1_change_input_handler,
    		input2_change_handler
    	];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { speed: 0, showLegend: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*speed*/ ctx[0] === undefined && !('speed' in props)) {
    			console.warn("<Controls> was created without expected prop 'speed'");
    		}

    		if (/*showLegend*/ ctx[1] === undefined && !('showLegend' in props)) {
    			console.warn("<Controls> was created without expected prop 'showLegend'");
    		}
    	}

    	get speed() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set speed(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showLegend() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showLegend(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const intersections = {
      '20 Av N': {
        '7 St NW': [-114.07893964039631, 51.07054169892371],
        'Center St': [-114.06257393380261, 51.070609731750714]
      },
      '16 Av N': {
        '10 St NW': [-114.08489350460921, 51.066904001348],
        'Edmonton Trail': [-114.05618395994925, 51.06693626186497]
      },
      '8 Av N': {
        '14 St NW': [-114.09475415944235, 51.0574984522886]
      },
      '7 Av N': {
        '24 St NW': [-114.11806377866809, 51.05914040581638]
      },
      '5 Av N': {
        '14 St NW': [-114.094731781486, 51.05709687083791],
        '10 St NW': [-114.08599386788937, 51.05712357695188]
      },
      'Kensington Rd': {
        '10 St NW': [-114.08592990014981, 51.05253712700806],
        '14 St NW': [-114.0947245349653, 51.052520631762604],
        '24 St NW': [-114.11796612252739, 51.052485028711544]
      },
      'Memorial Dr': {
        '10 St NW': [-114.08569923100222, 51.0518089710593],
      },
      '4 Av S': {
        '9 St SW': [-114.08352065905363, 51.049901659316184],
        '4 St SW': [-114.07157412631952, 51.049578034093955]
      },
      '8 Av S': {
        '9 St SW': [-114.0837042074354, 51.0461550109985],
        '8 St SW': [-114.0812599513191, 51.04605708217247],
        '4 St SW': [-114.07148474434986, 51.045764491004334],
        '1 St SW': [-114.06548890682399, 51.04560095291732],
        'Center St': [-114.06298135443159, 51.045518122829684],
        '2 St SE': [-114.0581207853938, 51.045354064328095],
        '4 St SE': [-114.05320870960337, 51.04526820411377],
        '6 St SE': [-114.04834008539397, 51.04513188716467],
      },
      '9 Av S': {
        '6 St E': [-114.0483529394385, 51.04411080434035]
      },
      '12 Av S': {
        '18 St SW': [-114.1042183736658, 51.0425847226566],
        '14 St SW': [-114.09467317597523, 51.042302050146354],
        '8 St SW': [-114.08154153696147, 51.04194719189309],
        '1 St SW': [-114.06580161010373, 51.041488891337764],
        '2 St SE': [-114.05843117123706, 51.041277794230425]
      },
      '17 Av S': {
        '29 St SW': [-114.1237226937469, 51.033190262669265],
        '26 St SW': [-114.12371714702843, 51.03784613000478],
        '14 St SW': [-114.09472267063069, 51.03781458725867],
        '2 St SE': [-114.05865238987491, 51.03783086571737],
        '1 St SW': [-114.06605539761398, 51.03781793732603]
      },
      '23 Av S': {
        '29 St SW': [-114.12956914789937, 51.033161877914324],
        '26 St SW': [-114.12959468827377, 51.03780459079984]
      },
      '26 Av S': {
        '14 St SW': [-114.09474547223127, 51.0304330356334],
        '20 St SW': [-114.10944297855941, 51.030420176040515]
      },
      '34 Av S': {
        '20 St SW': [-114.10930326307387, 51.02316898218637],
        '14 St SW': [-114.09472699485453, 51.0232217172826]
      }
    };

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
    ]);

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
    ]);

    const riversideManchester = route([
      [-114.03245254193595, 51.0532361007371],
      [-114.05027216576363, 51.05327391988086],
      [-114.05037125129785, 51.050621738210474],
      [-114.05154533464692, 51.04891295247008],
      [-114.05294643069912, 51.04800145363462],
      [-114.0530456818646, 51.04758695979581],
      intersections['8 Av S']['4 St SE'],
      intersections['8 Av S']['1 St SW'],
      intersections['12 Av S']['1 St SW'],
      intersections['12 Av S']['2 St SE'],
      intersections['17 Av S']['2 St SE'],
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
    ]);

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
    ]);

    const offset = 1e-4;

    const killarney = route([
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
    ]);

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
    ]);

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
    ]);

    const tuxedoPark = route([
      [-114.0625666284332, 51.08051761717556],
      [-114.06249866849501, 51.07331231657526],
      [-114.05634463964452, 51.07333567547062],
      [-114.05610152100759, 51.07065978671271],
      intersections['16 Av N']['Edmonton Trail'],
      [-114.06257210372549, 51.06691570029229],
      [-114.06249866849501, 51.07331231657526],
      [-114.06257393380261, 51.070609731750714],
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
    ]);

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
    ]);

    const capitolHill = route([
      [-114.09721714004105, 51.0705377462257],
      [-114.0849017998016, 51.07053755601367],
      intersections['16 Av N']['10 St NW'],
      [-114.0849017998016, 51.07053755601367],
      [-114.09721714004105, 51.0705377462257],
    ]);

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
    ]);

    const bowness = route([
      intersections['Kensington Rd']['14 St NW'],
      intersections['Kensington Rd']['10 St NW'],
      intersections['4 Av S']['9 St SW'],
      intersections['8 Av S']['9 St SW'],
      intersections['8 Av S']['Center St'],
      intersections['8 Av S']['9 St SW'],
      intersections['4 Av S']['9 St SW'],
      intersections['Kensington Rd']['10 St NW'],
      intersections['Kensington Rd']['14 St NW'],
      [-114.11796612252739, 51.052485028711544],
      [-114.12133858712923, 51.05248009534121],
      [-114.12190382103606, 51.05260445393406],
      [-114.12583617050362, 51.05429131835533],
      [-114.12638789806529, 51.05447084161884],
      [-114.13370519322709, 51.05643249447681],
      [-114.13444515725314, 51.056738485476366],
      [-114.14068499379347, 51.05985019419703],
      [-114.14132759415365, 51.060139844346935],
      [-114.14912764908298, 51.06346210971278],
      [-114.15054294822237, 51.06405123585141],
      [-114.15113894412244, 51.065417418079356],
      [-114.15148177301391, 51.06584750392453],
      [-114.1526520281249, 51.06671232422135],
      [-114.16348115846756, 51.074816814789145],
      [-114.16423454167781, 51.07523967616143],
      [-114.16574130792006, 51.075416393199546],
      [-114.16574130792006, 51.07541323754493],
      [-114.16693165330277, 51.07529963380956],
      [-114.16763262787953, 51.075361873392566],
      [-114.16840107868614, 51.07567743822706],
      [-114.17077740996558, 51.07739588174196],
      [-114.17126962026164, 51.07768303320474],
      [-114.1720129582852, 51.07833621726261],
      [-114.17316207239337, 51.07984729297398]
    ]);

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
    ]);

    const sunalta = route([
      intersections['12 Av S']['18 St SW'],
      intersections['12 Av S']['2 St SE'],
      intersections['8 Av S']['2 St SE'],
      intersections['8 Av S']['Center St'],
    ]);

    function offsetRoute(route) {
      return {
        ...route,
        geometry: {
          ...route.geometry,
          coordinates: route.geometry.coordinates.map((value) => [value[0] + offset, value[1] + offset])
        }
      }
    }

    function sortByName(a,b) {
      return a.name < b.name ? -1 : 1;
    }

    const routes = [
      { data: hillhurstInglewood, id: 'hillhurst-inglewood-route', color: '#e7067d', name: 'No. 1 Hillhurst - E Calgary' },
      { data: sunnysideRamsay, id: 'sunnyside-ramsay-route', color: '#fee300', name: 'No. 8 Burns Avenue-Sunnyside' },
      { data: riversideManchester, id: 'riverside-manchester-route', color: 'black', name: 'No. 9 Manchester-Riverside' },
      { data: southCalgary, id: 'southcalgary-route', color: '#f29517', name: 'No. 7 South Calgary'},
      { data: offsetRoute(killarney), id: 'killarney-route', color: '#2f71bc', name: 'No. 6 Killarney' },
      { data: offsetRoute(crescentHeights), id: 'crescent-height-route', color: '#00aaef', name: 'No. 4 Crescent Heights' },
      { data: mountPleasant, id: 'mount-pleasant-route', color: '#e82326', name: 'No. 2 Mount Pleasant' },
      { data: offsetRoute(tuxedoPark), id: 'tuxedo-park-route', color: '#4a4ca5', name: 'No. 3 Tuxedo Park' },
      { data: offsetRoute(ogden), id: 'ogden-route', color: '#835A39', name: 'No. O Ogden - Downtown' },
      { data: capitolHill, id: 'capitol-hill-route', color: '#b20168', name: 'No. C Capitol Hill - Rosedale' },
      { data: offsetRoute(grandTrunk), id: 'grand-trunk-route', color: '#74cabe', name: 'No. A Grand Trunk' },
      { data: offsetRoute(offsetRoute(bowness)), id: 'bowness-route', color: '#b6449f', name: 'No. B Bowness' },
      { data: offsetRoute(offsetRoute(beltline)), id: 'beltline-route', color: '#3aba72', name: 'No. 5 Beltline' },
      { data: sunalta, id: 'sunalta-route', color: '#d7e34d', name: 'No. S Sunalta'}
    ].sort(sortByName);

    /* src/LegendRow.svelte generated by Svelte v3.43.0 */

    const file$5 = "src/LegendRow.svelte";

    // (25:4) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "line svelte-nu6ips");
    			attr_dev(div, "style", div_style_value = `background-color: ${/*route*/ ctx[0].color}`);
    			add_location(div, file$5, 25, 4, 484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*route*/ 1 && div_style_value !== (div_style_value = `background-color: ${/*route*/ ctx[0].color}`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(25:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if dashed}
    function create_if_block$1(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "line svelte-nu6ips");

    			attr_dev(div, "style", div_style_value = `background: repeating-linear-gradient(
        to right,
        ${/*route*/ ctx[0].color},
        ${/*route*/ ctx[0].color} 2px,
        white 4px,
        white 6px
              )`);

    			add_location(div, file$5, 17, 4, 262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*route*/ 1 && div_style_value !== (div_style_value = `background: repeating-linear-gradient(
        to right,
        ${/*route*/ ctx[0].color},
        ${/*route*/ ctx[0].color} 2px,
        white 4px,
        white 6px
              )`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(17:4) {#if dashed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*route*/ ctx[0].name + "";
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*dashed*/ ctx[1]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(div, "class", "flex row svelte-nu6ips");
    			add_location(div, file$5, 15, 0, 217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}

    			if (dirty & /*route*/ 1 && t1_value !== (t1_value = /*route*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LegendRow', slots, []);
    	let { route } = $$props;
    	let { dashed = false } = $$props;
    	const writable_props = ['route', 'dashed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LegendRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('route' in $$props) $$invalidate(0, route = $$props.route);
    		if ('dashed' in $$props) $$invalidate(1, dashed = $$props.dashed);
    	};

    	$$self.$capture_state = () => ({ route, dashed });

    	$$self.$inject_state = $$props => {
    		if ('route' in $$props) $$invalidate(0, route = $$props.route);
    		if ('dashed' in $$props) $$invalidate(1, dashed = $$props.dashed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [route, dashed];
    }

    class LegendRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { route: 0, dashed: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LegendRow",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*route*/ ctx[0] === undefined && !('route' in props)) {
    			console.warn("<LegendRow> was created without expected prop 'route'");
    		}
    	}

    	get route() {
    		throw new Error("<LegendRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set route(value) {
    		throw new Error("<LegendRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dashed() {
    		throw new Error("<LegendRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dashed(value) {
    		throw new Error("<LegendRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/SelectedLine.svelte generated by Svelte v3.43.0 */
    const file$4 = "src/SelectedLine.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let legendrow;
    	let t0;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	legendrow = new LegendRow({
    			props: { route: /*selectedRoute*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(legendrow.$$.fragment);
    			t0 = space();
    			button = element("button");
    			button.textContent = "Stop Tracking";
    			attr_dev(div0, "class", "flex header");
    			add_location(div0, file$4, 17, 4, 332);
    			attr_dev(button, "class", "svelte-706qqo");
    			add_location(button, file$4, 20, 4, 417);
    			attr_dev(div1, "class", "panel-container");
    			add_location(div1, file$4, 16, 0, 298);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(legendrow, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*stopTracking*/ ctx[0])) /*stopTracking*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legendrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legendrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(legendrow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectedLine', slots, []);
    	let { selectedId } = $$props;
    	let { stopTracking } = $$props;
    	const selectedRoute = routes.find(({ id }) => id === selectedId);
    	const writable_props = ['selectedId', 'stopTracking'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectedLine> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('selectedId' in $$props) $$invalidate(2, selectedId = $$props.selectedId);
    		if ('stopTracking' in $$props) $$invalidate(0, stopTracking = $$props.stopTracking);
    	};

    	$$self.$capture_state = () => ({
    		routes,
    		LegendRow,
    		selectedId,
    		stopTracking,
    		selectedRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedId' in $$props) $$invalidate(2, selectedId = $$props.selectedId);
    		if ('stopTracking' in $$props) $$invalidate(0, stopTracking = $$props.stopTracking);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [stopTracking, selectedRoute, selectedId];
    }

    class SelectedLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { selectedId: 2, stopTracking: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectedLine",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedId*/ ctx[2] === undefined && !('selectedId' in props)) {
    			console.warn("<SelectedLine> was created without expected prop 'selectedId'");
    		}

    		if (/*stopTracking*/ ctx[0] === undefined && !('stopTracking' in props)) {
    			console.warn("<SelectedLine> was created without expected prop 'stopTracking'");
    		}
    	}

    	get selectedId() {
    		throw new Error("<SelectedLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedId(value) {
    		throw new Error("<SelectedLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stopTracking() {
    		throw new Error("<SelectedLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stopTracking(value) {
    		throw new Error("<SelectedLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/WelcomePanel.svelte generated by Svelte v3.43.0 */

    const file$3 = "src/WelcomePanel.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let b;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let p3;
    	let t8;
    	let a0;
    	let t10;
    	let t11;
    	let p4;
    	let t12;
    	let a1;
    	let t14;
    	let a2;
    	let t16;

    	const block = {
    		c: function create() {
    			div = element("div");
    			b = element("b");
    			b.textContent = "Calgary's Streetcars";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Prior to WWII, streetcar networks were very common throughout North America.\n      These networks had frequent service, were well connected,\n      and enabled people to live beyond walking distance from their employment. These networks enabled the first boom of\n      suburbanization, well before the widespread use of private automobiles.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Access to these networks was an important contributor to land value. Developers would often petition city governments to construct\n      these lines to support new neighbourhoods. In Calgary, the Municipal Railway operated a network connecting residents to commercial districts in the city center,\n      industrial sectors in Inglewood, Riverside, Manchester, and the CPR rail yards at the sourthern edge of the city. One line of the\n      network went to the natural parks at Bowness.";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "In the 1940s and 1950s, these networks were frequently dismantled in favour of bus service, and more importantly, the use of private\n      automobiles. Calgary's system was retired in 1950. Traces of the network, such as the 5th Street loop in Sunnyside, can still be seen to this day.\n      Explore the map to learn more about this network. Click on a car to track its route.";
    			t7 = space();
    			p3 = element("p");
    			t8 = text("This visualization was inspired by ");
    			a0 = element("a");
    			a0.textContent = "Saadiq Mohiuddin's blog post of the Municipal Railway";
    			t10 = text(".");
    			t11 = space();
    			p4 = element("p");
    			t12 = text("If you have feedback or want to make a contribution, you can reach me by ");
    			a1 = element("a");
    			a1.textContent = "leaving an issue or pull request on github";
    			t14 = text(" or by ");
    			a2 = element("a");
    			a2.textContent = "tweeting at me";
    			t16 = text(".");
    			add_location(b, file$3, 7, 4, 110);
    			add_location(p0, file$3, 8, 4, 142);
    			add_location(p1, file$3, 14, 4, 505);
    			add_location(p2, file$3, 20, 4, 1014);
    			attr_dev(a0, "href", "https://saadiqm.com/2019/04/13/calgary-historic-streetcar-map.html");
    			add_location(a0, file$3, 26, 41, 1459);
    			add_location(p3, file$3, 25, 4, 1414);
    			attr_dev(a1, "href", "https://github.com/dylangrandmont/calgary-streetcar/issues");
    			add_location(a1, file$3, 29, 79, 1691);
    			attr_dev(a2, "href", "https://twitter.com/dylan_grandmont");
    			add_location(a2, file$3, 29, 201, 1813);
    			add_location(p4, file$3, 28, 4, 1608);
    			attr_dev(div, "class", "panel-container root svelte-1s3mh19");
    			add_location(div, file$3, 6, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, b);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(div, t5);
    			append_dev(div, p2);
    			append_dev(div, t7);
    			append_dev(div, p3);
    			append_dev(p3, t8);
    			append_dev(p3, a0);
    			append_dev(p3, t10);
    			append_dev(div, t11);
    			append_dev(div, p4);
    			append_dev(p4, t12);
    			append_dev(p4, a1);
    			append_dev(p4, t14);
    			append_dev(p4, a2);
    			append_dev(p4, t16);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WelcomePanel', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WelcomePanel> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class WelcomePanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomePanel",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Legend.svelte generated by Svelte v3.43.0 */
    const file$2 = "src/Legend.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (15:4) {#each routes as route}
    function create_each_block(ctx) {
    	let legendrow;
    	let current;

    	legendrow = new LegendRow({
    			props: { route: /*route*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(legendrow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(legendrow, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legendrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legendrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(legendrow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:4) {#each routes as route}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let b;
    	let t1;
    	let div0;
    	let t2;
    	let legendrow;
    	let current;
    	let each_value = routes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	legendrow = new LegendRow({
    			props: {
    				route: {
    					color: 'black',
    					name: 'City Boundary (1923- 1950)'
    				},
    				dashed: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			b = element("b");
    			b.textContent = "Legend";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(legendrow.$$.fragment);
    			add_location(b, file$2, 12, 4, 211);
    			attr_dev(div0, "class", "content svelte-2d210l");
    			add_location(div0, file$2, 13, 4, 229);
    			attr_dev(div1, "class", "panel-container");
    			add_location(div1, file$2, 11, 0, 177);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, b);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t2);
    			mount_component(legendrow, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*routes*/ 0) {
    				each_value = routes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(legendrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(legendrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(legendrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Legend', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Legend> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ routes, LegendRow });
    	return [];
    }

    class Legend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legend",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/ExpandToggle.svelte generated by Svelte v3.43.0 */
    const file$1 = "src/ExpandToggle.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "transition hidden svelte-1j5r296");
    			attr_dev(div, "title", "Expand/Collapse");
    			add_location(div, file$1, 22, 0, 550);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleSidepanel*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toggleTransitionClass() {
    	const transition = document.querySelector('.transition');
    	const isHidden = transition.classList.contains('hidden');

    	if (isHidden) {
    		transition.classList.remove('hidden');
    	} else {
    		transition.classList.add('hidden');
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExpandToggle', slots, []);
    	let { onToggle } = $$props;

    	function toggleSidepanel() {
    		onToggle();
    		toggleTransitionClass();
    	}

    	// hack to avoid unused css selector warnings for hidden class
    	onMount(() => toggleTransitionClass());

    	const writable_props = ['onToggle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExpandToggle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onToggle' in $$props) $$invalidate(1, onToggle = $$props.onToggle);
    	};

    	$$self.$capture_state = () => ({
    		onToggle,
    		onMount,
    		toggleTransitionClass,
    		toggleSidepanel
    	});

    	$$self.$inject_state = $$props => {
    		if ('onToggle' in $$props) $$invalidate(1, onToggle = $$props.onToggle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toggleSidepanel, onToggle];
    }

    class ExpandToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { onToggle: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpandToggle",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onToggle*/ ctx[1] === undefined && !('onToggle' in props)) {
    			console.warn("<ExpandToggle> was created without expected prop 'onToggle'");
    		}
    	}

    	get onToggle() {
    		throw new Error("<ExpandToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onToggle(value) {
    		throw new Error("<ExpandToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const boundary = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-114.001825531986, 51.0959608454447],
              [-114.001787621148, 51.0814846626122],
              [-114.001749216331, 51.0668991397779],
              [-114.001784428778, 51.0523624006093],
              [-114.001816575512, 51.0377630349266],
              [-114.001817055732, 51.0311203098387],
              [-114.001775610509, 51.0310751639305],
              [-114.001675689646, 51.0309861317789],
              [-114.00161559232, 51.0308792947881],
              [-114.001527258154, 51.0307852406689],
              [-114.0014208237, 51.0306642489027],
              [-114.001415029714, 51.0306569438982],
              [-114.001363622947, 51.0305615209581],
              [-114.001320180257, 51.0304775121962],
              [-114.001288322935, 51.0303638263097],
              [-114.001241985571, 51.0302428354919],
              [-114.001173202219, 51.0301245831602],
              [-114.001129037308, 51.030032812573],
              [-114.001106592841, 51.0299282583311],
              [-114.0010769094, 51.0298300958665],
              [-114.001059533279, 51.0297305641419],
              [-114.001037812972, 51.0296104863634],
              [-114.001022610647, 51.0294926919197],
              [-114.001018267985, 51.0293488738295],
              [-114.001004514212, 51.0292319918258],
              [-114.00100958407, 51.0291224156328],
              [-114.001011756311, 51.0291064363206],
              [-114.00102334132, 51.029009643503],
              [-114.001029135606, 51.0289137640931],
              [-114.001017551647, 51.0287964271813],
              [-114.001008142088, 51.028695068643],
              [-114.000993663008, 51.0285822958495],
              [-114.000937915413, 51.0284722634689],
              [-114.000893028, 51.0283622309772],
              [-114.000881446104, 51.0282531115791],
              [-114.000895204024, 51.0281722989385],
              [-114.000911132653, 51.0280732235834],
              [-114.000927062585, 51.0279714090448],
              [-114.000928513221, 51.0278714204383],
              [-114.000932134649, 51.0277563658751],
              [-114.000952408314, 51.0276677914105],
              [-114.000953132375, 51.0276623130452],
              [-114.000980646218, 51.0275719117958],
              [-114.001031327752, 51.0274828821738],
              [-114.001121104291, 51.0273947655194],
              [-114.001210880869, 51.0273212589527],
              [-114.00122536171, 51.0272253794149],
              [-114.001249253827, 51.027130870712],
              [-114.001297761811, 51.0270906931466],
              [-114.001366542422, 51.0270637563436],
              [-114.001503376612, 51.0270167310247],
              [-114.001597495785, 51.0269957296956],
              [-114.001664103315, 51.0269610309875],
              [-114.001792247783, 51.0268614998568],
              [-114.001925461715, 51.0267491841616],
              [-114.002024647573, 51.026656501646],
              [-114.00203478372, 51.0266418913104],
              [-114.00211948772, 51.026555600684],
              [-114.002236048329, 51.0264355231697],
              [-114.002352608043, 51.0263378174573],
              [-114.002465547353, 51.0262291540829],
              [-114.002586448957, 51.0261209471012],
              [-114.002478577683, 51.0261734532437],
              [-114.002331611942, 51.0262538094552],
              [-114.002183919428, 51.026319555334],
              [-114.002121658655, 51.0263346215233],
              [-114.002175231334, 51.0262958135358],
              [-114.002301926948, 51.026186693382],
              [-114.002419209407, 51.0261040544256],
              [-114.002554592202, 51.0260195891354],
              [-114.002642915511, 51.0259451681231],
              [-114.002624814051, 51.0259086431275],
              [-114.002438028541, 51.0258556812926],
              [-114.002378662507, 51.0258488332161],
              [-114.002269343202, 51.0258693787948],
              [-114.002102830988, 51.02593192818],
              [-114.001951520511, 51.0260131973548],
              [-114.001814688893, 51.0261118154501],
              [-114.001756046534, 51.0262118031733],
              [-114.001718400681, 51.0263282283375],
              [-114.001656139601, 51.0264592630998],
              [-114.001593875664, 51.0265587941071],
              [-114.001564916627, 51.0266039941184],
              [-114.001538128707, 51.0266099295143],
              [-114.001502654431, 51.0265930364168],
              [-114.001444011715, 51.0265391606186],
              [-114.001426636167, 51.0264903077726],
              [-114.001403469311, 51.0263624682527],
              [-114.001462112302, 51.0262524364483],
              [-114.001529443001, 51.0261305326196],
              [-114.001584464396, 51.0260127390362],
              [-114.001662653947, 51.0258958575581],
              [-114.001817515493, 51.0257799196821],
              [-114.001817682483, 51.0232337406371],
              [-114.001817361258, 51.0085998120488],
              [-113.981792903956, 51.0086284776163],
              [-113.981778835486, 50.9941624359752],
              [-113.981766750758, 50.9795193478919],
              [-114.001813022404, 50.9794650332375],
              [-114.025346612035, 50.9794692629232],
              [-114.025311416874, 50.9941366780563],
              [-114.025294756287, 51.0086114710789],
              [-114.04848617884, 51.0086181876503],
              [-114.048498476697, 51.0013789225358],
              [-114.060097974873, 51.0013767090212],
              [-114.071663724395, 51.0013825585285],
              [-114.071658072275, 51.008626819162],
              [-114.081532070606, 51.0086274836085],
              [-114.083258000154, 51.0086261829614],
              [-114.094857930423, 51.0086244311422],
              [-114.118198568936, 51.0086185206989],
              [-114.141277175019, 51.0086070720332],
              [-114.1413111588, 51.0557310106128],
              [-114.141320721704, 51.0814764038869],
              [-114.118027781734, 51.0815044015757],
              [-114.11806057408, 51.095954677059],
              [-114.001825531986, 51.0959608454447]
            ]
          }
        }
      ]
    };

    /* src/App.svelte generated by Svelte v3.43.0 */
    const file = "src/App.svelte";

    // (185:2) {:else}
    function create_else_block(ctx) {
    	let welcomepanel;
    	let current;
    	welcomepanel = new WelcomePanel({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(welcomepanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(welcomepanel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomepanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomepanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(welcomepanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(185:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (183:2) {#if selectedId}
    function create_if_block_1(ctx) {
    	let selectedline;
    	let current;

    	selectedline = new SelectedLine({
    			props: {
    				selectedId: /*selectedId*/ ctx[0],
    				stopTracking: /*handleStopTracking*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(selectedline.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectedline, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selectedline_changes = {};
    			if (dirty & /*selectedId*/ 1) selectedline_changes.selectedId = /*selectedId*/ ctx[0];
    			selectedline.$set(selectedline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectedline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectedline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectedline, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(183:2) {#if selectedId}",
    		ctx
    	});

    	return block;
    }

    // (188:2) {#if showLegend}
    function create_if_block(ctx) {
    	let legend;
    	let current;
    	legend = new Legend({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(legend.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(legend, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(legend, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(188:2) {#if showLegend}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let expandtoggle;
    	let t0;
    	let controls;
    	let updating_showLegend;
    	let updating_speed;
    	let t1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let current;

    	expandtoggle = new ExpandToggle({
    			props: { onToggle: toggleSidepanel },
    			$$inline: true
    		});

    	function controls_showLegend_binding(value) {
    		/*controls_showLegend_binding*/ ctx[6](value);
    	}

    	function controls_speed_binding(value) {
    		/*controls_speed_binding*/ ctx[7](value);
    	}

    	let controls_props = {};

    	if (/*showLegend*/ ctx[2] !== void 0) {
    		controls_props.showLegend = /*showLegend*/ ctx[2];
    	}

    	if (/*speed*/ ctx[1] !== void 0) {
    		controls_props.speed = /*speed*/ ctx[1];
    	}

    	controls = new Controls({ props: controls_props, $$inline: true });
    	binding_callbacks.push(() => bind(controls, 'showLegend', controls_showLegend_binding));
    	binding_callbacks.push(() => bind(controls, 'speed', controls_speed_binding));
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedId*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*showLegend*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(expandtoggle.$$.fragment);
    			t0 = space();
    			create_component(controls.$$.fragment);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "root hidden svelte-19vgmi");
    			add_location(div, file, 179, 0, 4712);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(expandtoggle, div, null);
    			append_dev(div, t0);
    			mount_component(controls, div, null);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const controls_changes = {};

    			if (!updating_showLegend && dirty & /*showLegend*/ 4) {
    				updating_showLegend = true;
    				controls_changes.showLegend = /*showLegend*/ ctx[2];
    				add_flush_callback(() => updating_showLegend = false);
    			}

    			if (!updating_speed && dirty & /*speed*/ 2) {
    				updating_speed = true;
    				controls_changes.speed = /*speed*/ ctx[1];
    				add_flush_callback(() => updating_speed = false);
    			}

    			controls.$set(controls_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t2);
    			}

    			if (/*showLegend*/ ctx[2]) {
    				if (if_block1) {
    					if (dirty & /*showLegend*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expandtoggle.$$.fragment, local);
    			transition_in(controls.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expandtoggle.$$.fragment, local);
    			transition_out(controls.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(expandtoggle);
    			destroy_component(controls);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toggleSidepanel() {
    	const root = document.querySelector('.root');
    	const isHidden = root.classList.contains('hidden');

    	if (isHidden) {
    		root.classList.remove('hidden');
    	} else {
    		root.classList.add('hidden');
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let speed = 0.000002;
    	let selectedId;
    	let trackIndex;
    	let shouldTrackCamera;
    	let showLegend = true;
    	const defaultCenter = [-114.06, 51.05];
    	mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5ncmFuZG1vbnQiLCJhIjoiY2t0eDV1cmdkMnBxbzJ3bzI5dm1wbHZ4MCJ9.19ogLLAZwVYbKNoy-E_S5Q';

    	const map = new mapboxgl.Map({
    			container: 'map',
    			style: 'mapbox://styles/mapbox/streets-v11',
    			center: defaultCenter,
    			zoom: 12,
    			logoPosition: 'top-left'
    		});

    	const streetcars = {
    		type: 'FeatureCollection',
    		features: routes.map(({ data }) => ({
    			type: 'Feature',
    			geometry: {
    				type: 'Point',
    				coordinates: data.geometry.coordinates[0]
    			}
    		}))
    	};

    	const markers = streetcars.features.map(({ geometry }, index) => {
    		const { id, color } = routes[index];
    		const el = document.createElement('div');
    		el.className = 'marker';
    		el.style.color = color;
    		el.id = `marker-${id}`;

    		el.addEventListener('click', function (e) {
    			e.stopPropagation();

    			if (selectedId === id) {
    				$$invalidate(0, selectedId = '');
    			} else {
    				$$invalidate(0, selectedId = id);
    			}
    		});

    		return new mapboxgl.Marker(el).setLngLat(geometry.coordinates).addTo(map);
    	});

    	function animateRoute(coordinates, marker, index) {
    		let trainIndex = 0;
    		let trainCoordinate = coordinates[trainIndex];

    		function animateMarker() {
    			const nextPoint = coordinates[(trainIndex + 1) % coordinates.length];
    			const lastPoint = coordinates[trainIndex % coordinates.length];
    			const distanceBetweenPoints = Math.sqrt((nextPoint[0] - lastPoint[0]) ** 2 + (nextPoint[1] - lastPoint[1]) ** 2);
    			const distanceInTimeInterval = speed * 1;
    			const distanceToNextPoint = Math.sqrt((nextPoint[0] - trainCoordinate[0]) ** 2 + (nextPoint[1] - trainCoordinate[1]) ** 2);

    			if (distanceInTimeInterval > distanceToNextPoint) {
    				trainCoordinate = nextPoint;
    				trainIndex++;
    			} else {
    				const newX = distanceInTimeInterval / distanceBetweenPoints * (nextPoint[0] - lastPoint[0]) + trainCoordinate[0];
    				const newY = distanceInTimeInterval / distanceBetweenPoints * (nextPoint[1] - lastPoint[1]) + trainCoordinate[1];
    				trainCoordinate = [newX, newY];
    			}

    			if (trackIndex === index) {
    				map.setCenter(trainCoordinate);
    			}

    			marker.setLngLat(trainCoordinate);
    			requestAnimationFrame(animateMarker);
    		}

    		requestAnimationFrame(animateMarker);
    	}

    	function handleStopTracking() {
    		$$invalidate(0, selectedId = '');
    	}

    	routes.forEach(({ data }, index) => {
    		animateRoute(data.geometry.coordinates, markers[index], index);
    	});

    	function addRouteToMap(id, data, color) {
    		map.addSource(id, { type: 'geojson', data });

    		map.addLayer({
    			id,
    			type: 'line',
    			source: id,
    			layout: {
    				'line-join': 'round',
    				'line-cap': 'round'
    			},
    			paint: { 'line-color': color, 'line-width': 8 }
    		});
    	}

    	function addBoundary() {
    		map.addSource('boundary', { type: 'geojson', data: boundary });

    		map.addLayer({
    			id: 'boundary',
    			type: 'line',
    			source: 'boundary',
    			layout: {
    				'line-join': 'round',
    				'line-cap': 'round'
    			},
    			paint: {
    				'line-color': 'black',
    				'line-width': 4,
    				'line-dasharray': [1, 2]
    			}
    		});
    	}

    	map.on('load', () => {
    		routes.forEach(({ data, id, color }) => {
    			addRouteToMap(id, data, color);
    		});

    		addBoundary();
    	});

    	routes.forEach(({ id }) => {
    		map.on('click', id, event => {
    			const routeId = event.features[0]?.layer.id;
    			$$invalidate(0, selectedId = selectedId === routeId ? '' : routeId);
    		});
    	});

    	// hack to avoid unused css selector warnings for hidden class
    	onMount(() => toggleSidepanel());

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function controls_showLegend_binding(value) {
    		showLegend = value;
    		$$invalidate(2, showLegend);
    	}

    	function controls_speed_binding(value) {
    		speed = value;
    		$$invalidate(1, speed);
    	}

    	$$self.$capture_state = () => ({
    		Controls,
    		SelectedLine,
    		WelcomePanel,
    		Legend,
    		routes,
    		onMount,
    		ExpandToggle,
    		boundary,
    		speed,
    		selectedId,
    		trackIndex,
    		shouldTrackCamera,
    		showLegend,
    		defaultCenter,
    		map,
    		streetcars,
    		markers,
    		animateRoute,
    		handleStopTracking,
    		addRouteToMap,
    		addBoundary,
    		toggleSidepanel
    	});

    	$$self.$inject_state = $$props => {
    		if ('speed' in $$props) $$invalidate(1, speed = $$props.speed);
    		if ('selectedId' in $$props) $$invalidate(0, selectedId = $$props.selectedId);
    		if ('trackIndex' in $$props) $$invalidate(4, trackIndex = $$props.trackIndex);
    		if ('shouldTrackCamera' in $$props) $$invalidate(5, shouldTrackCamera = $$props.shouldTrackCamera);
    		if ('showLegend' in $$props) $$invalidate(2, showLegend = $$props.showLegend);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedId*/ 1) {
    			$$invalidate(4, trackIndex = routes.findIndex(({ id }) => id === selectedId));
    		}

    		if ($$self.$$.dirty & /*trackIndex*/ 16) {
    			$$invalidate(5, shouldTrackCamera = trackIndex > -1);
    		}

    		if ($$self.$$.dirty & /*shouldTrackCamera*/ 32) {
    			{
    				if (shouldTrackCamera) {
    					map.setPitch(45);
    					map.setZoom(18);
    				} else {
    					map.flyTo({
    						pitch: 0,
    						center: defaultCenter,
    						zoom: 13
    					});
    				}
    			}
    		}
    	};

    	return [
    		selectedId,
    		speed,
    		showLegend,
    		handleStopTracking,
    		trackIndex,
    		shouldTrackCamera,
    		controls_showLegend_binding,
    		controls_speed_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=main.js.map
