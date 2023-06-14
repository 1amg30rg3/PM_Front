<template>
    <div class="wrapper">
        <div class="products">
            <div class="filter">
                <input type="text" placeholder="Search by name" id="searchInput" @keyup="searchProducts()" ref="search"/>
                 <div class="category">
                    <div class="dropdown">
                        <div class="dropdown-toggle" @click="toggleDropdown">
                            <span>Categories</span>
                            <i class="dropdown-icon"></i>
                        </div>
                        <div class="dropdown-menu" :class="{ 'show': isDropdownOpen }">
                            <label class="dropdown-item">
                                <input id="allCategory" type="checkbox" value="all" class="category-input" checked @change="changeCategory('all')">
                                All
                            </label>
                            <label v-for="category in categories" :key="category.id" class="dropdown-item">
                                <input type="checkbox" :value="category.category" class="category-input" checked @click="changeCategory(category.category)">
                                {{ category.category }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product">
                <div class="p_item" v-for="product in filteredProducts">
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
                            <button class="delete" @click="deleteProduct(product['id'])">Delete</button>
                            <router-link :to="{ path: '/product', query: { product: product['id']}}">
                                Open 
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    
    export default {
        data(){
            return {
                products: null,
                filteredProducts: [],

                categories: null,
                selectedCategory: null,

                searchQuery: null,
                categoryQuery: [],

                isDropdownOpen: false,
            }
        },
        methods:{
            getProducts() {
                axios.get('product/get')
                .then(
                    response => {
                        this.products = response.data.products;
                        this.modifyProducts();
                    }
                )
            },
            getCategories(){
                axios.get('/category/get').then(
                    categories => {
                        this.categories = categories.data

                        setTimeout(() => {
                            this.updateCategoryFromQuery()
                            this.categoryQuery = this.$route.query.category
                        }, 1);   
                    }
                )
            },  
            modifyProducts(){
                this.filteredProducts = []
                this.products.forEach(element => {
                    element.category = element.category
                    .split(',')
                    .map(item => item.replace(/"/g, '').trim());

                    if ( element.description.length > 30 ){
                        element.description = element.description.substring(0,30) + "..."
                    }

                    if (element.path != null){
                        let links = JSON.parse(element.path)
                        let fullLinks = [];
                        
                        links.forEach(link => {
                            let baseLink = axios.defaults.baseURL;
                            baseLink = baseLink.replace('/api','')
                            fullLinks.push(baseLink + link)
                        })
                        
                        element.path = fullLinks
                    }else{
                        element.path = ['https://i0.wp.com/theperfectroundgolf.com/wp-content/uploads/2022/04/placeholder.png?w=1200&ssl=1']
                    }

                    this.filteredProducts.push(element)
                });


                // this.filterProducts(this.$route.query.category)
            },
            toggleDropdown() {
                this.isDropdownOpen = !this.isDropdownOpen;
            },
            changeCategory(e){
                let categoryMenu = document.querySelector('.dropdown-menu')
                let categories = categoryMenu.querySelectorAll('input');
                let categoryAll = document.querySelector('#allCategory')

                let categoryCount = categories.length - 1
                let choosedCategoryCount = 0

                // Manage categories in html 
                    categories.forEach(category => {
                        if ( e == 'all' ){
                            categoryAll.checked ? category.checked = true : category.checked = false
                        }
                        else{
                            if ( category.checked && category.value != 'all'){
                                choosedCategoryCount++
                            }else{
                                categoryAll.checked = false
                            }
                        }
                    });
            
                    if ( e!= 'all' ){
                        if ( categoryCount ==  choosedCategoryCount){
                            categoryAll.checked = true
                        }else{
                            categoryAll.checked = false
                        }
                    }
                // End

                this.categoryQuery = []
                categories.forEach(category => {
                    (category.checked && category.value != 'all') ? this.categoryQuery.push(category.value) : this.selectedCategory
                })


                this.$router.push({ path: '/', query: {category: this.categoryQuery, search: this.searchQuery} });

                this.filterProducts(this.categoryQuery)
            },

            updateCategoryFromQuery(){
                let categoryQuery = this.$route.query.category;
                let categories = document.querySelectorAll('.category-input');
                let categoryAll = document.querySelector('#allCategory')
                
                if ( typeof categoryQuery == 'string' ) {
                    categoryQuery = [categoryQuery]
                }

                if ( categoryQuery != undefined ){
                    let ifQeqCat = false;
                    let eqCatCount = 1;

                    categories.forEach(category => {
                        categoryQuery.forEach(ctQuery => {
                            ( ctQuery ==  category.value) ? (ifQeqCat = true, eqCatCount++) : ifQeqCat
                        });

                        ifQeqCat ? category.checked = true : category.checked = false
                        ifQeqCat = false
                    });

                    ( eqCatCount == categories.length ) ? categoryAll.checked = true : categoryAll.checked = false
                }
                
                this.filterProducts(categoryQuery)
            },

            filterProducts(search){

                if ( !search ) return this.products

                this.filteredProducts = this.products.filter((product) => {
                    let category = product.category;

                    if (Array.isArray(category)) {
                        category = category.map(item => item.toUpperCase());
                    } else if (typeof category === 'string') {
                        category = category.toUpperCase();
                    }

                    return Array.isArray(search)
                        ? search.some(item => category.includes(item.toUpperCase()))
                        : category.includes(search.toUpperCase());
                });
       
                return this.filteredProducts
            },

            searchProducts(){
                this.searchQuery = this.$refs.search.value

                this.$router.push({ path: '/', query: {category: this.categoryQuery, search: this.searchQuery} });

                let productsList = this.filterProducts(this.$route.query.category)
                

                this.filteredProducts = productsList.filter((product) => {
                    let name = product.name.toUpperCase()

                    return name.includes(this.searchQuery.toUpperCase());
                });
            },

            deleteProduct(id){
                console.log(id)
                let link = `/product/delete/${id}`
                axios.delete(link)
                .then( response => {
                    console.log(response.data)
                    this.getProducts()
                })
            }

        },
        created(){
            this.getProducts();
            this.getCategories();
        }
 

    }
</script>