import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import products from './modules/products'
import {init} from '../judy';


export default init({
    actions,
    getters,
    modules: {
      products
    },
})
