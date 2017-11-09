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
                function commit(type, state) {
                    if (arguments.length === 1) {
                        state = type;
                        type = false;
                    }
                    handler.commit((type ? type : namespace), state, {root: true});
                };
                function dispatch(type, state) {
                    if (arguments.length === 1) {
                        state = type;
                        type = false;
                    }
                    handler.dispatch((type ? type : namespace), state, {root: true});
                };
                await model[key].apply(this, [{...handler, commit, dispatch}, payload]);
            };
        }
    }
    let getters = {};
    let mutations = {};
    for (let key in state) {
        mutations[key] = (function (key) {
            return (state, payload) => state[key] = {...state[key], ...payload};
        })(key);
        getters[key] = state =>  ({...state[key]});
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
            return (state, payload) => state[key] = {...state[key], ...payload};
        })(key);
        getters[key] = state =>  ({...state[key]});
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
