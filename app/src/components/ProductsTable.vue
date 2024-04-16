<template>
  <div>
    <h2>Contact Data:</h2>
    <input type="text" placeholder="User name:" v-model="userName">
    <input type="text" placeholder="Email:" v-model="email">
    <input type="text" placeholder="Phone number:" v-model="phoneNumber">
    <h1>Available Products</h1>
    <input type="text" placeholder="Type name" v-model="name">
    <button v-on:click="search" id="searchButton">Search</button>
    <select v-model="selectedOption" style="font-size: 150%">
      <option value="">Select category</option>
      <option v-for="option in options" :value="option.value" :key="option.value">{{ option.value }}</option>
    </select>
    <table class="table table-bordered table-striped">
      <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col">Price ($)</th>
        <th scope="col">Weight (kg)</th>
        <th scope="col">Category</th>
        <th scope="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in currentProducts" :key="product.id">
        <th scope="row">{{ product.id }}</th>
        <td>{{ product.name }}</td>
        <td>{{ product.description }}</td>
        <td>{{ product.price }}</td>
        <td>{{ product.weight }}</td>
        <td>{{ product.category.name }}</td>
        <td>
          <button v-on:click="addToCart(product.id)" class="btn btn-secondary">BUY</button>
        </td>
      </tr>
      <tr>
        <th scope="row"></th>
        <td>
          <input type="text" v-model="productName">
        </td>
        <td>
          <input type="text" v-model="productDescription">
        </td>
        <td>
          <input type="number" v-model="productPrice">
        </td>
        <td>
          <input type="number" v-model="productWeight">
        </td>
        <td>
          <select v-model="productCategory">
            <option disabled value="">Select category</option>
            <option v-for="option in options" :value="option.value" :key="option.value">{{ option.value }}</option>
          </select>
        </td>
        <td>
          <button v-on:click="addNewProduct">ADD</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button class="btn btn-primary" v-on:click="goToCart" v-if="isOrder">Go to your cart</button>
  </div>
</template>

<script>
import axios from "axios";
import {_} from 'vue-underscore';

let s = require("underscore.string");
export default {
  name: "ProductsTable",
  data() {
    return {
      products: [],
      name: '',
      currentProducts: [],
      selectedOption: '',
      options: [{label: 'option 1', value: 'Books'}, {label: 'option 2', value: 'Toys'}, {label: 'option 3', value: 'Electronics'}],
      userName: '',
      email: '',
      phoneNumber: '',
      order: 0,
      productName: '',
      productDescription: '',
      productPrice: 1.0,
      productWeight: 1,
      productCategory: '',
      isOrder: false,
    };
  },
  methods:
      {
        getData() {
          axios.get('http://localhost:3000/products').then(response => {
            this.products = response.data;
            this.currentProducts = this.products;
          }).catch(error => {
            console.error(error);
          })
        },
        search() {
          this.name = this.name.toUpperCase();

          this.currentProducts = _.filter(this.products, (product) => {
            let currentName = product.name.toUpperCase();
            let currentCategory = product.category.name;

            if (this.name === '' && this.selectedOption === '') {
              return product;
            } else if (s.include(currentName, this.name) && this.selectedOption === '') {
              return product;
            } else if (currentCategory === this.selectedOption && this.name === '') {
              return product;
            } else if (s.include(currentName, this.name) && currentCategory === this.selectedOption) {
              return product;
            }
          })
        },
        async addToCart(product) {
          if (this.userName === '' || this.email === '' || this.phoneNumber === '') {
            console.error('empty');

            this.emitter.emit('empty', {error: 'All order fields must be filled!'});
          } else if (this.order === 0) {
            let orderData = {date: new Date(), state: 1, userName: this.userName, email: this.email, phoneNumber: this.phoneNumber};

            await axios.post('http://localhost:3000/orders', orderData).then(response => {
              this.order = response.data.id;
              console.log(this.order);

              this.isOrder = true;
              let positionData = {order: this.order, product: product, quantity: 1};

              axios.post('http://localhost:3000/orders/positions', positionData);
            }).catch(error => {
              console.error('ERROR:', error);
              this.emitter.emit('empty', {error: error.response.data.message});
            });
          } else {
            let positionData = {order: this.order, product: product, quantity: 1};

            axios.post('http://localhost:3000/orders/positions', positionData);
          }
        },
        goToCart() {
          const order = this.order;
          this.$router.push({path: `/cart/${order}`});
        },
        addNewProduct() {
          let categoryID;
          switch (this.productCategory) {
            case 'Books':
              categoryID = 1;
              break;
            case 'Toys':
              categoryID = 2;
              break;
            case 'Electronics':
              categoryID = 3;
              break;
          }

          let productData = {
            name: this.productName, description: this.productDescription, price: this.productPrice,
            weight: this.productWeight, category: categoryID
          };

          axios.post('http://localhost:3000/products', productData).catch(error => {
            console.error('ERROR:', error);
            this.emitter.emit('empty', {error: error.response.data.message});
          });

          this.getData();
        },
      },
  mounted() {
    this.getData();
  }
}
</script>

<style scoped>
h1 {
  margin-top: 3%;
}

#searchButton {
  margin-right: 3%;
  margin-left: 3%;
}

table {
  margin-top: 3%;
}
</style>
