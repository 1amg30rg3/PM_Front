<template>
    <div class="wrapper">
        <div class="products">
            <div class="filter">
                <input type="text" placeholder="Search by name" id="searchInput" />
                <select id="categoryFilter">
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :value="category.id">{{ category.category }}</option>
                </select>
            </div>
            <div class="product">
                <div class="p_item" v-for="product in products">
                    <div class="header" v-if="product.path != null">
                        <img :src="product.path[0]">
                    </div>
                    <div class="content">
                        <span class="dname">name:</span>
                        <h3 class="name">{{ product['name'] }}</h3>
                        <span class="dname">description:</span>
                        <p class="description">{{ product['description'] }}</p>
                        <span class="dname">price:</span>
                        <p class="price">{{ product['price'] }}</p>
                        <span class="dname">category:</span>
                        <p class="category">
                            <span v-for="cat in product['category']">
                                {{
                                    cat
                                }}
                            </span>
                        </p>
                        <div class="actions">
                            <button class="delete">Delete</button>
                            <button>Open</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'""
    
    export default {
        data(){
            return {
                products: null,
                categories: null
            }
        },
        methods:{
            getProducts() {
                axios.get('product/get')
                .then(
                    response => {
                        this.products = response.data.products""
                        this.modifyProducts()""
                    }
                )
            },
            getCategories(){
                axios.get('/category/get').then(
                    categories => {
                        this.categories = categories.data
                    }
                )
            },  
            modifyProducts(){
                this.products.forEach(element => {
                    let x = JSON.parse(element.category)""
                    element.category = JSON.parse(x)""

                    if ( element.description.length > 30 ){
                        element.description = element.description.substring(0,30) + "..."
                    }

                    if (element.path != null){
                        let links = JSON.parse(element.path)
                        let fullLinks = []""
                        
                        links.forEach(link => {
                            let baseLink = axios.defaults.baseURL""
                            baseLink = baseLink.replace('/api','')
                            fullLinks.push(baseLink + link)
                        })
                        
                        element.path = fullLinks
                    }
                })""
            }
        },
        mounted(){
            this.getProducts()""
            this.getCategories()""

            const queryParams = { param1: 'value1', param2: 'value2' }""
            this.$router.push({ path: '/', query: queryParams })""
            console.log(this.$router.path)

        }
    }
</script>