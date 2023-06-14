<template>
    <div class="wrapper">
        <div class="manageProduct">
            <div class="product-store" v-if="categoriesExists">
                <h3>New Product</h3>
                <div class="content">
                    <form @submit.prevent="storeProduct()">
                        <div class="f_item">
                            <label for="name">Name</label>
                            <input type="text" v-model="product.name" name="name" required >
                        </div>
                        <div class="f_item">
                            <label for="description">Description</label>
                            <textarea name="" id="" v-model="product.description" cols="30" rows="10" required></textarea>
                        </div>
                        <div class="f_item">
                            <label for="price">price</label>
                            <input type="number" v-model="product.price" name="price" required >
                        </div>
                        <div class="f_item categoryChoose">
                            <div>
                                <label for="category">category</label>
                                <select name="category" id="category" required>
                                    <option v-for="category of categories" :value="category.category">{{ category.category }}</option>
                                </select>
                            </div>
                            <btn @click="addCategory()">Add</btn>
                        </div>
                        <div class="categorySelected">
                            <div v-for="nc of product.category">
                                <span>{{ nc }}</span>
                                <i class="fa-regular fa-trash-can delete" @click="removeCategory(nc)"></i>
                            </div>
                        </div>
                        <div class="f_item file-upload">
                            <label for="file-input" class="file-label">
                                <span class="file-text">Choose a file</span>
                                <span class="file-button">Browse</span>
                            </label>
                            <input id="file-input" type="file" multiple class="file-input" @change="handleFileUpload" ref="file">
                            
                                <span class="file-selected" v-for="f of selectedFile">{{ f }}; </span>
                            
                        </div>
                        <div class="f_item">
                            <button>Submit</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="product-store">
                <h3>New Category</h3>
                <div class="content">
                    <form @submit.prevent="storeCategory()">
                        <div class="f_item">
                            <label for="category">Category</label>
                            <input type="text" v-model="category.category" name="category" required >
                        </div>

                        <div class="f_item">
                            <button>Submit</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <div class="success-popup" v-if="categorySuccess">
        Category Has been uploaded successfully!
    </div>
    <div class="success-popup" v-if="productSuccess">
        Category Has been uploaded successfully!
    </div>
</template>

<script>
import axios from 'axios';
import { onMounted } from 'vue';


    export default {
        data(){
            return {
                product: {name:null, description:null, price: null, category: [], picture: null},
                picture: null,
                category: {category: null},
                
                categories : null,

                categorySuccess: false,
                productSuccess: false,
                categoriesExists: false,

                selectedFile: [],
            }
        },
        methods: {
            getCategories(){
                axios.get('/category/get').then(
                    categories => {
                        this.categories = categories.data
                        categories.data.length > 0 ? this.categoriesExists = true : this.categoriesExists = false
                    }
                )
            },

            storeCategory(){
                axios.post('category/store',this.category)
                .then( response =>  {
                    this.categorySuccess = true
                    this.category = {category: null}

                    this.getCategories()
                    
                    setTimeout(() => {
                        this.categorySuccess = false
                    }, 5000);

                }).catch( error => {
                    console.log(error)
                })
            },

            storeProduct(){
                if ( this.product.category.length == 0 ){
                    let categoryChoose = document.querySelector(".categoryChoose")
                    categoryChoose.style = "border: 1px solid red"
                }else{
                    // this.$refs.file.files = null
                    let files = this.$refs.file.files
                    
                    console.log(files)
         
                    let formData = null
                    formData = new FormData()
        
                    for (var i = 0; i < files.length; i++ ){
                        let file = this.$refs.file.files[i]
                        console.log(file)
                        formData.append('file[' + i + ']', file)
                    }

                    formData.append('name',this.product.name)
                    formData.append('description',this.product.description)
                    formData.append('price',this.product.price)
                    formData.append('category',Array.from(this.product.category))

                    console.log(Array.from(this.product.category))
      
         
                    this.$refs.file.value = ""
                    
                    axios.post('product/create',formData)
                    .then( response => {
                        console.log(response.data)
                        this.product = {name:null, description:null, price: null, picture: null, category: []}
                        this.selectedFile = [] 

                        this.productSuccess = true
                        setTimeout(() => {
                            this.productSuccess = false
                        }, 5000);
                    })
                }
            },

            addCategory(){
                let cat = document.querySelector("#category")
                let categoryValue = cat[cat.selectedIndex].value
                let categoryChoose = document.querySelector(".categoryChoose")
                categoryChoose.style = "border: 0"
                !this.product.category.includes(categoryValue) ? this.product.category.push(categoryValue) : 0

                
            },

            removeCategory(name){
                const index = this.product.category.findIndex(item => item === name)
                if (index !== -1) {
                    this.product.category.splice(index, 1)
                }
            },

            handleFileUpload(event) {
                let files = this.$refs.file.files
                this.selectedFile = [] 
                for (const file of files) {
                    this.selectedFile.push(file.name)
                }
            }
        },

        created(){
            this.getCategories()
            console.log(typeof this.product.category)
        }
    }
</script>