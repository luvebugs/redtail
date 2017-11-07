import Vuex from 'vuex'
import Vue from 'vue'

const {mapGetters, mapActions, mapState, Store} = Vuex;


export const connect = (states) => {
    console.log('connect>>>>>>>>>>>>>>>>>>>>>>>.');
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
    console.log('compose>>>>>>>>>>>>>>>>>>>>>>>.');
    let actions = {};
    for (let key in model) {
        if (typeof model[key] === 'function') {
            actions[key] = async function (action, payload) {
                function commit(type, state) {
                    if (arguments.length === 1) {
                        state = type;
                        type = false;
                    }
                    action.commit((type ? type : namespace).toUpperCase(), state, {root: true});
                };
                await model[key].apply(this, [{commit, state: action.state}, payload]);
            };
        }
    }
    return {
        ...model,
        actions
    };
};


export const init = ({
    actions = {},
    getters = {},
    mutations = {},
    modules
}) => {
    const clearPlugin = store => {
        // 当 store 初始化后调用
        // console.log('plugin', store);
        store.subscribeAction((action, state) => {
            // 每次 mutation 之后调用
            console.log(action, state);
        });
        store.subscribe((mutation, state) => {
            // 每次 mutation 之后调用
            console.log(mutation, state);
        });
    };
    console.log('init>>>>>>>>>>>>>>>>>>>>>>>.');
    Vue.use(Vuex)
    let res = {};
    Object.keys(modules).forEach(key => {
        const module = compose(modules[key], key);
        res[key] = module;
        mutations[key.toUpperCase()] = (function (key) {
            return (state, payload) => state[key] = {...state[key], ...payload};
        })(key);
        getters[key] = state =>  state[key];
    })

    const store =  new Vuex.Store({
        actions,
        getters,
        mutations,
        modules: res,
        plugins: [clearPlugin],
        dispatch: function () {console.log(12312312);}
    });

    return store;
}
