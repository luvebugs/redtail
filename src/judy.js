import Vuex from 'vuex'
import Vue from 'vue'

const {mapGetters, mapActions, mapState, Store} = Vuex;


export const connect = (states) => {
    // console.log('connect>>>>>>>>>>>>>>>>>>>>>>>.');
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
    // console.log('compose>>>>>>>>>>>>>>>>>>>>>>>.');
    const {state} = model;
    let actions = {};
    for (let key in model) {
        if (typeof model[key] === 'function') {
            actions[key] = async function (action, payload) {
                function commit(type, state) {
                    if (arguments.length === 1) {
                        state = type;
                        type = false;
                    }
                    action.commit((type ? type : namespace), state, {root: true});
                };
                await model[key].apply(this, [{commit, state: action.state}, payload]);
            };
        }
    }
    let getters = {};
    let mutations = {};
    for (let key in state) {
        mutations[key] = (function (key) {
            return (state, payload) => state[key] = {...state[key], ...payload};
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
    modules
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
    // console.log(res);
    const store =  new Vuex.Store({
        actions,
        getters,
        mutations,
        modules: res
    });
    return store;
};
