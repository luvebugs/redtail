import Vuex from 'vuex'
import Vue from 'vue'

const {mapGetters, mapActions, mapState, Store} = Vuex;

export const connect = (states) => {
    console.log('connect>>>>>>>>>>>>>>>>>>>>>>>.');
    let getters = Object
        .keys(states)
        .map((key) => {
            return mapState(key, states[key]);
        });
    return (component) => {
        getters.forEach((item) => {
            component.computed = {
                ...component.computed,
                ...item
            };
        });
        return component;
    };
};

function compose(model) {
    console.log('compose>>>>>>>>>>>>>>>>>>>>>>>.');
    const {state} = model;
    let mutations = {};
    let actions = {};
    for (var key in state) {
        // model.getters[key] = (state) => state[key];
        mutations[key.toUpperCase()] = (function (key) {
            return (state, data) =>  state[key] = data;;
        })(key);
    }
    for (let prop in model) {
        if (typeof model[prop] === 'function') {
            actions[prop] = async function (action, data) {
                function commit(state) {
                    Object.keys(state).forEach(key => {
                        action.commit(key.toUpperCase(), state[key]);
                    });
                };
                await model[prop].apply(this, [{commit, state: action.state}, data]);
            };
        }
    }
    return {
        ...model,
        actions,
        mutations
    };
};


export const init = ({
    actions,
    getters,
    modules
}) => {
    console.log('init>>>>>>>>>>>>>>>>>>>>>>>.');
    Vue.use(Vuex)
    const debug = process.env.NODE_ENV !== 'production'
    const res = {}
    Object.keys(modules).forEach(key => {
        const module = compose(modules[key]);
        console.log(module);
        res[key] = module;
    })
    
    return new Vuex.Store({
        actions,
        getters,
        modules: res,
        strict: debug,
    })
}
