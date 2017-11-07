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
                this.$store.dispatch('products/addProducts', {price: p.price})
            }
        },
        created() {
            this.$store.dispatch('products/getAllProducts')
        }
    };

    export default connect(['products'])(component);
</script>
