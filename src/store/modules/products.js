import shop from '../../api/shop'
import * as types from '../mutation-types'

const model = {
    namespaced: true,
    state: {
        all: [],
        total: 0
    },
    async getAllProducts({commit, state}) {
        await shop.getProducts(products => {
            commit({all: products});
        })
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
    // }
}

export default model;