import Vuex from 'vuex'
import Vue from 'vue'

const {mapGetters, mapActions, mapState, Store} = Vuex;


function toGetter(value) {
    return 'get' + value.charAt(0).toUpperCase() + value.slice(1);
}
function toSetter(value) {
    return 'set' + value.charAt(0).toUpperCase() + value.slice(1);
}
export const connect = (states) => {
    const getters = mapGetters(states.map(state => toGetter(state)));
    const actions = mapActions(states.map(state => toSetter(state)));
    
    const watch = {};
    const data = {};
    states.forEach((state) => {
        watch[toGetter(state)] = {
            handler(value) {
                this[state] = {...value};
            },
            deep: true,
            immediate: true
        };
        watch[state] = {
            handler(value) {
                this[toSetter(state)](value);
            },
            deep: true,
            immediate: true
        };
        data[state] = {};
    });

    var mixin = {
        data: function () {
            return data;
        },
        watch,
        computed: {
            ...getters,
        },
        methods: {
            ...actions
        }
    }
    return (component) => {
        component.mixins = [mixin];
        return component;
    };
};

function getMutation(key) {
    return (function (key) {
        return (state, payload) => {
            if (typeof payload === 'object' && !payload.length) {
                for (const index in payload) {
                    if (payload.hasOwnProperty(index)) {
                        const element = payload[index];
                        state[key][index] = element;
                    }
                }
            } else {
                state[key] = payload;
            }
        };
    })(key)
}

function getGetter(key) {
    return state =>  state[key];
}

function compose(model, namespace) {
    const {state} = model;
    let actions = {};
    for (let key in model) {
        if (typeof model[key] === 'function') {
            actions[key] = async function (handler, payload) {
                function commit() {
                    if (arguments.length === 1) {
                        const state = arguments[0];
                        return state.type ? handler.commit(state) : handler.commit(namespace, state, {root: true});
                    } else {
                        const type = arguments[0];
                        const state = arguments[1];
                        return handler.commit(type, state, {root: true});
                    }
                };
                function dispatch() {
                    if (arguments.length === 1) {
                        const state = arguments[0];
                        return state.type ? handler.dispatch(state) : handler.dispatch(namespace, state, {root: true});
                    } else {
                        const type = arguments[0];
                        const state = arguments[1];
                        return handler.dispatch(type, state, {root: true});
                    }
                };
                return await model[key].apply(this, [{...handler, commit, dispatch}, payload]);
            };
        }
    }
    let getters = {};
    let mutations = {};
    for (let key in state) {
        mutations[key] = getMutation(key);
        getters[toGetter(key)] = getGetter(key);
    }
    return {
        ...model,
        actions,
        getters,
        mutations
    };
};


export const init = ({
    actions = {},
    getters = {},
    mutations = {},
    modules,
    plugins
}) => {
    Vue.use(Vuex)
    let res = {};
    Object.keys(modules).forEach(key => {
        const module = compose(modules[key], key);
        res[key] = module;
        mutations[key] = getMutation(key);
        getters[toGetter(key)] = getGetter(key);
        actions[toSetter(key)] = async function ({commit}, payload) {
            return commit(key, payload);
        };
    })
    const store =  new Vuex.Store({
        actions,
        getters,
        mutations,
        modules: res,
        strict: true,
        plugins
    });
    return store;
};
