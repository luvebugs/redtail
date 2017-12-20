import shop from '../../api/shop'
import * as types from '../mutation-types'

const model = {
    namespaced: true,
    state: {
        all: [],
        total: 0,
        msg: 'name'
    },
    async getAllProducts({commit, state}) {
        await shop.getProducts(products => {
            commit('products/all', products);
        })
        return;
    },
    async addProducts({commit, state}, {price}) {
        commit({total: state.total + price});
    },
    // mutations: {
    //     ALL(state, {products}) {
    //         state.all = products
    //     }
    // },
    // getters: {
    //     allProducts: state => state.all
    // },
    // actions: {
    //     getAllProducts ({ commit }) {
    //         shop.getProducts(products => {
    //             commit(types.RECEIVE_PRODUCTS, { products })
    //         })
    //     }
    // }
}

export default model;