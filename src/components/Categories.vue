<template>
    <div class="filter">
        <input type="text" placeholder="Search by name" id="searchInput" />
        <select id="categoryFilter">
            <option value="">All Categories</option>
            <option v-for="category in categories" :value="category.id">{{ category.category }}</option>
        </select>
    </div>
</template>

<script>
    import axios from 'axios';
    
    export default {
        data(){
            return {
                categories: null
            }
        },
        methods:{
            getCategories(){
                axios.get('/category/get').then(
                    categories => {
                        console.log(categories.data)
                        this.categories = categories.data
                    }
                )
            },  
        },
        mounted(){
            this.getCategories();
        }
    }
</script>