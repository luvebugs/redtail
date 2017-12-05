import Vuex from 'vuex'
import Vue from 'vue'

const {mapGetters, mapActions, mapState, Store} = Vuex;


export const connect = (states) => {
    let getters = mapGetters(states);
    return (component) => {
        component.computed = {
            ...component.computed,
            ...getters
        };
        return component;
    };
};

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
        mutations[key] = (function (key) {
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
        })(key);
        getters[key] = state =>  state[key];
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
        mutations[key] = (function (key) {
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
        })(key);
        getters[key] = state =>  state[key];
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
