
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
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
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

    const file$3 = "src/Controls.svelte";

    // (20:4) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Click a street car line to track it";
    			add_location(p, file$3, 20, 4, 382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(20:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:4) {#if selectedId}
    function create_if_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Click again to stop tracking";
    			add_location(p, file$3, 18, 4, 330);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:4) {#if selectedId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let input;
    	let t1;
    	let hr;
    	let t2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedId*/ ctx[1]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Adjust Speed\n        ");
    			input = element("input");
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			if_block.c();
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "0.000005");
    			attr_dev(input, "step", "0.0000001");
    			add_location(input, file$3, 14, 8, 211);
    			add_location(div0, file$3, 12, 4, 176);
    			add_location(hr, file$3, 16, 4, 300);
    			attr_dev(div1, "class", "panel-container root svelte-1v918bn");
    			add_location(div1, file$3, 11, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, input);
    			set_input_value(input, /*speed*/ ctx[0]);
    			append_dev(div1, t1);
    			append_dev(div1, hr);
    			append_dev(div1, t2);
    			if_block.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[2]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[2])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*speed*/ 1) {
    				set_input_value(input, /*speed*/ ctx[0]);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Controls', slots, []);
    	let { speed } = $$props;
    	let { selectedId } = $$props;
    	const writable_props = ['speed', 'selectedId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		speed = to_number(this.value);
    		$$invalidate(0, speed);
    	}

    	$$self.$$set = $$props => {
    		if ('speed' in $$props) $$invalidate(0, speed = $$props.speed);
    		if ('selectedId' in $$props) $$invalidate(1, selectedId = $$props.selectedId);
    	};

    	$$self.$capture_state = () => ({ speed, selectedId });

    	$$self.$inject_state = $$props => {
    		if ('speed' in $$props) $$invalidate(0, speed = $$props.speed);
    		if ('selectedId' in $$props) $$invalidate(1, selectedId = $$props.selectedId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [speed, selectedId, input_change_input_handler];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { speed: 0, selectedId: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*speed*/ ctx[0] === undefined && !('speed' in props)) {
    			console.warn("<Controls> was created without expected prop 'speed'");
    		}

    		if (/*selectedId*/ ctx[1] === undefined && !('selectedId' in props)) {
    			console.warn("<Controls> was created without expected prop 'selectedId'");
    		}
    	}

    	get speed() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set speed(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedId() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedId(value) {
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

    const routes = [
      { data: hillhurstInglewood, id: 'hillhurst-inglewood-route', color: '#e7067d', name: 'No. Hillhurst - E Calgary' },
      { data: sunnysideRamsay, id: 'sunnyside-ramsay-route', color: '#fee300', name: 'No. 8 Burns Avenue-Sunnyside' },
      { data: riversideManchester, id: 'riverside-manchester-route', color: 'black', name: 'No. 9 Manchester-Riverside' },
      { data: southCalgary, id: 'southcalgary-route', color: '#f29517', name: 'No. 7 South Calgary'},
      { data: offsetRoute(killarney), id: 'killarney-route', color: '#2f71bc', name: 'No. 6 Killarney' },
      { data: offsetRoute(crescentHeights), id: 'crescent-height-route', color: '#00aaef', name: 'No. 4 Crescent Heights' },
      { data: mountPleasant, id: 'mount-pleasant-route', color: '#e82326', name: 'No. 2 Mount Pleasant' },
      { data: offsetRoute(tuxedoPark), id: 'tuxedo-park-route', color: '#4a4ca5', name: 'No. 3 Tuxedo Park' },
      { data: offsetRoute(ogden), id: 'ogden-route', color: '#835A39', name: 'Ogden - Downtown' },
      { data: capitolHill, id: 'capitol-hill-route', color: '#b20168', name: 'No. C Capitol Hill - Rosedale' },
      { data: offsetRoute(grandTrunk), id: 'grand-trunk-route', color: '#74cabe', name: 'No. A Grand Trunk' },
      { data: offsetRoute(offsetRoute(bowness)), id: 'bowness-route', color: '#b6449f', name: 'No. B Bowness' },
      { data: offsetRoute(offsetRoute(beltline)), id: 'beltline-route', color: '#3aba72', name: 'No. 5 Beltline' },
      { data: sunalta, id: 'sunalta-route', color: '#d7e34d', name: 'No. S Sunalta'}
    ];

    /* src/SelectedLine.svelte generated by Svelte v3.43.0 */
    const file$2 = "src/SelectedLine.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let t0_value = /*selectedRoute*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "line svelte-yzxvi4");
    			attr_dev(div0, "style", `background-color: ${/*selectedRoute*/ ctx[0].color}`);
    			add_location(div0, file$2, 17, 4, 290);
    			attr_dev(div1, "class", "panel-container");
    			add_location(div1, file$2, 15, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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
    	validate_slots('SelectedLine', slots, []);
    	let { selectedId } = $$props;
    	const selectedRoute = routes.find(({ id }) => id === selectedId);
    	const writable_props = ['selectedId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectedLine> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('selectedId' in $$props) $$invalidate(1, selectedId = $$props.selectedId);
    	};

    	$$self.$capture_state = () => ({ routes, selectedId, selectedRoute });

    	$$self.$inject_state = $$props => {
    		if ('selectedId' in $$props) $$invalidate(1, selectedId = $$props.selectedId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedRoute, selectedId];
    }

    class SelectedLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { selectedId: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectedLine",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedId*/ ctx[1] === undefined && !('selectedId' in props)) {
    			console.warn("<SelectedLine> was created without expected prop 'selectedId'");
    		}
    	}

    	get selectedId() {
    		throw new Error("<SelectedLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedId(value) {
    		throw new Error("<SelectedLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/WelcomePanel.svelte generated by Svelte v3.43.0 */
    const file$1 = "src/WelcomePanel.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let details;
    	let summary;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Calgary Streetcar";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Prior to WW2, streetcar networks were very common throughout North America. These networks had frequent service, were well connected,\n      and enabled people to live further beyond walking distance from their employment. These networks enabled the first boom of\n      suburbanization, well before the widespread use of private automobiles.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Access to these networks was an important contributor to land value. Developers would often petition city governments to construct\n      these lines to support new neighbourhoods. In Calgary, street cars connected residents to commercial districts in the city center,\n      industrial sectors in Inglewood, Riverside, Manchester, and the CPR rail yards at the sourthern edge of the city. One line of the\n      network went to the natural parks at Bowness.";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "In the 1940s and 1950s, these networks were frequently dismantled in favour of bus service, and more importantly, the use of private\n      automobiles.";
    			add_location(summary, file$1, 18, 4, 387);
    			add_location(p0, file$1, 19, 4, 428);
    			add_location(p1, file$1, 24, 4, 792);
    			add_location(p2, file$1, 30, 4, 1271);
    			add_location(details, file$1, 17, 2, 356);
    			attr_dev(div, "class", "panel-container");
    			add_location(div, file$1, 16, 0, 324);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, details);
    			append_dev(details, summary);
    			append_dev(details, t1);
    			append_dev(details, p0);
    			append_dev(details, t3);
    			append_dev(details, p1);
    			append_dev(details, t5);
    			append_dev(details, p2);
    			details.open = /*open*/ ctx[0];

    			if (!mounted) {
    				dispose = listen_dev(details, "toggle", /*details_toggle_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*open*/ 1) {
    				details.open = /*open*/ ctx[0];
    			}
    		},
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

    const itemKey = 'info-panel-open';

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WelcomePanel', slots, []);
    	let open;

    	onMount(() => {
    		$$invalidate(0, open = localStorage.getItem(itemKey) === "true" ? true : false);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WelcomePanel> was created with unknown prop '${key}'`);
    	});

    	function details_toggle_handler() {
    		open = this.open;
    		$$invalidate(0, open);
    	}

    	$$self.$capture_state = () => ({ onMount, open, itemKey });

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			{
    				if (open !== undefined) {
    					localStorage.setItem('info-panel-open', open);
    				}
    			}
    		}
    	};

    	return [open, details_toggle_handler];
    }

    class WelcomePanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomePanel",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.0 */
    const file = "src/App.svelte";

    // (143:1) {:else}
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
    		source: "(143:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (141:1) {#if selectedId}
    function create_if_block(ctx) {
    	let selectedline;
    	let current;

    	selectedline = new SelectedLine({
    			props: { selectedId: /*selectedId*/ ctx[0] },
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(141:1) {#if selectedId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let controls;
    	let updating_speed;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	function controls_speed_binding(value) {
    		/*controls_speed_binding*/ ctx[4](value);
    	}

    	let controls_props = { selectedId: /*selectedId*/ ctx[0] };

    	if (/*speed*/ ctx[1] !== void 0) {
    		controls_props.speed = /*speed*/ ctx[1];
    	}

    	controls = new Controls({ props: controls_props, $$inline: true });
    	binding_callbacks.push(() => bind(controls, 'speed', controls_speed_binding));
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedId*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(controls.$$.fragment);
    			t = space();
    			if_block.c();
    			set_style(div, "position", "absolute");
    			set_style(div, "z-index", "1");
    			set_style(div, "top", "0px");
    			set_style(div, "right", "0px");
    			set_style(div, "padding", "8px");
    			set_style(div, "display", "grid");
    			set_style(div, "grid-gap", "8px");
    			add_location(div, file, 138, 0, 3696);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(controls, div, null);
    			append_dev(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const controls_changes = {};
    			if (dirty & /*selectedId*/ 1) controls_changes.selectedId = /*selectedId*/ ctx[0];

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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(controls.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(controls.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(controls);
    			if_blocks[current_block_type_index].d();
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let speed = 0.000002;
    	let selectedId;
    	let trackIndex;
    	let shouldTrackCamera;
    	const defaultCenter = [-114.06, 51.05];
    	mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5ncmFuZG1vbnQiLCJhIjoiY2t0eDV1cmdkMnBxbzJ3bzI5dm1wbHZ4MCJ9.19ogLLAZwVYbKNoy-E_S5Q';

    	const map = new mapboxgl.Map({
    			container: 'map',
    			style: 'mapbox://styles/mapbox/streets-v11',
    			center: defaultCenter,
    			zoom: 13
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

    	map.on('load', () => {
    		routes.forEach(({ data, id, color }) => {
    			addRouteToMap(id, data, color);
    		});
    	});

    	routes.forEach(({ id }) => {
    		map.on('click', id, event => {
    			const routeId = event.features[0]?.layer.id;
    			$$invalidate(0, selectedId = selectedId === routeId ? '' : routeId);
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function controls_speed_binding(value) {
    		speed = value;
    		$$invalidate(1, speed);
    	}

    	$$self.$capture_state = () => ({
    		Controls,
    		SelectedLine,
    		WelcomePanel,
    		routes,
    		speed,
    		selectedId,
    		trackIndex,
    		shouldTrackCamera,
    		defaultCenter,
    		map,
    		streetcars,
    		markers,
    		animateRoute,
    		handleStopTracking,
    		addRouteToMap
    	});

    	$$self.$inject_state = $$props => {
    		if ('speed' in $$props) $$invalidate(1, speed = $$props.speed);
    		if ('selectedId' in $$props) $$invalidate(0, selectedId = $$props.selectedId);
    		if ('trackIndex' in $$props) $$invalidate(2, trackIndex = $$props.trackIndex);
    		if ('shouldTrackCamera' in $$props) $$invalidate(3, shouldTrackCamera = $$props.shouldTrackCamera);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedId*/ 1) {
    			$$invalidate(2, trackIndex = routes.findIndex(({ id }) => id === selectedId));
    		}

    		if ($$self.$$.dirty & /*trackIndex*/ 4) {
    			$$invalidate(3, shouldTrackCamera = trackIndex > -1);
    		}

    		if ($$self.$$.dirty & /*shouldTrackCamera*/ 8) {
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

    	return [selectedId, speed, trackIndex, shouldTrackCamera, controls_speed_binding];
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
//# sourceMappingURL=bundle.js.map
