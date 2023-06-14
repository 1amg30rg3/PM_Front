<template>
    <div class="wrapper produc_view">
      <div class="products">
        <div class="carousel_mm" ref="carousel">
          <div class="slider" :style="{ transform: 'translateX(' + translateX + 'px)' }">
            <div class="slide" v-for="(image, index) in images" :key="index">
              <img :src="image" :alt="'Slide ' + (index + 1)">
            </div>
          </div>
          <div class="controls">
            <button class="prev" @click="prevSlide">&#8249;</button>
            <button class="next" @click="nextSlide">&#8250;</button>
          </div>
        </div>
        <div class="product_w" v-if="dataLoaded">
            <span class="dname">name:</span>
            <h3>{{ product.name }}</h3>
            <span class="dname">description:</span>
            <p>{{ product.description }}</p>
            <span class="dname">price:</span>
            <p>{{ product.price }}$</p>
            <span class="dname">category:</span>
            <p class="category">
                <span v-for="cat in product.category">{{cat}}</span>
            </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        currentIndex: 0,
        slideWidth: 0,
        translateX: 0,
        intervalId: null,
        intervalDuration: 3000, // Change image every 3 seconds
  
        images: [],
        id: this.$route.query.product,
        product: null,
        dataLoaded: false
      };
    },
    mounted() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
      this.startAutoImageChange();
      this.getProduct();
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize);
      this.stopAutoImageChange();
    },
    methods: {
      getProduct() {
        let productLink = `product/get/${this.id}`;
        axios
          .get(productLink)
          .then((response) => {
            this.product = response.data.products;
            this.modifyProducts();
          })
          .catch((e) => {
            console.log(e);
          });
      },
      modifyProducts() {
        this.product.forEach((element) => {
          element.category = element.category
            .split(',')
            .map((item) => item.replace(/"/g, '').trim());
  

  
          if (element.path != null) {
            let links = JSON.parse(element.path);
            let fullLinks = [];
  
            links.forEach((link) => {
              let baseLink = axios.defaults.baseURL;
              baseLink = baseLink.replace('/api', '');
              fullLinks.push(baseLink + link);
            });
  
            this.images = fullLinks;
          }
        });
  
        if (this.images.length === 0) {
          this.images = ['https://i0.wp.com/theperfectroundgolf.com/wp-content/uploads/2022/04/placeholder.png?w=1200&ssl=1']; 
        }
  
        this.product = this.product[0];
        this.dataLoaded = true;
      },
      prevSlide() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.translateX += this.slideWidth;
        } else {
          this.currentIndex = this.images.length - 1;
          this.translateX = -this.slideWidth * this.currentIndex;
        }
      },
      nextSlide() {
        if (this.currentIndex < this.images.length - 1) {
          this.currentIndex++;
          this.translateX -= this.slideWidth;
        } else {
          this.currentIndex = 0;
          this.translateX = 0;
        }
      },
      handleResize() {
        const carousel = this.$refs.carousel;
        this.slideWidth = carousel.offsetWidth;
        this.translateX = -this.slideWidth * this.currentIndex;
      },
      startAutoImageChange() {
        this.intervalId = setInterval(() => {
          this.nextSlide();
        }, this.intervalDuration);
      },
      stopAutoImageChange() {
        clearInterval(this.intervalId);
      },
    },
  };
  </script>