<template>
    <div>
        <ul>
            <li v-for="p in products.all">
                {{ p.title }} - {{ p.price }}
                <br>
                <button :disabled="!p.inventory" @click="addToCart(p)">
                    Add to cart
                </button>
            </li>
        </ul>
        <div>total: {{products.total}}</div>

        <input v-model="products.msg" @change="changeMsg"> {{products.msg}}
        <button @click="add">hello</button>
    </div>
</template>

<script>

    import {
        connect,
        dispatch
    } from '../judy'

    const component = {
        methods: {
            addToCart(p) {
                this.$store.dispatch('products/addProducts', {
                    price: p.price
                })
            },
            changeMsg(p) {
                this.$store.commit('products/msg', p.target.value);
            },
            add() {
                this.setProducts({msg: 123123});
            }
        },
        created() {
            console.log(this);
            const a = this.$store.dispatch('products/getAllProducts')
            a.then(v => {console.log('promise');});
            this.$store.commit('products/msg', '123123');
        }
    };

    export default connect(['products'])(component);
</script>