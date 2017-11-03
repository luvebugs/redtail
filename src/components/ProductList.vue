<template>
<div>
    <ul>
        <li v-for="p in products">
            {{ p.title }} - {{ p.price }}
            <br>
            <button :disabled="!p.inventory" @click="addToCart(p)">
                Add to cart
            </button>
        </li>
    </ul>
    <div>total: {{ total}}</div>
</div>
</template>

<script>

    import {
        connect
    } from '../judy'
    
    const component = {
        methods: {
            addToCart(p) {
                console.log(p.price);
                this.$store.dispatch('products/addProducts', {price: p.price})
            }
        },
        created() {
            console.log(this.total);
            this.$store.dispatch('products/getAllProducts')
        }
    };

    export default  connect({
        products: {
            products: 'all',
            total: 'total'
        }
    })(component);

</script>
