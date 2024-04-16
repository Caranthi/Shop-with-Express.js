<template>
  <div id="userCart">
    <div class="container-fluid frame" :style="{borderLeft: borderStyle, borderTop: borderStyle, borderRight: borderStyle,
  borderBottom: borderStyle}">
      <h1>Your Cart</h1>
      <h2>Status: {{ orderState.name }}</h2>
      <ul class="list-group">
        <li class="list-group-item list-group-item-secondary">
          <div class="d-flex justify-content-between align-items-center w-100">
            <span>Product</span>
            <span>Quantity</span>
            <span>Change Quantity</span>
          </div>
        </li>
        <li v-for="position in positions" class="list-group-item" :key="position.id">
          <div class="d-flex justify-content-between align-items-center">
            <span>{{ position.product.name }}</span>
            <span id="quantitySpan" class="badge badge-primary d-flex justify-content-center">
            {{ position.quantity }}
          </span>
            <span>
            <button v-on:click="add(position)">
              +
            </button>
            <button v-on:click="subtract(position)" style="font-size: 125%">
              -
            </button>
          </span>
          </div>
        </li>
      </ul>
    </div>

    <div id="buttons">
      <button class="btn btn-primary d-flex align-items-center" v-on:click="confirmOrder">CONFIRM</button>
      <button class="btn btn-secondary d-flex align-items-center" v-on:click="cancelOrder">CANCEL</button>
      <button class="btn btn-primary d-flex align-items-center" v-on:click="finishOrder" style="background-color: green">FINISH</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {toRaw} from "vue";

export default {
  name: "UserCart",
  data() {
    return {
      orderData: {},
      orderState: {},
      positions: [],
      borderStyle: '',
      reload: true,
    }
  },
  methods:
      {
        async getData(id) {
          await axios.get(`http://localhost:3000/orders/${id}`).then(response => {
            this.orderData = response.data;
            this.orderState = toRaw(this.orderData.state);
          });

          axios.get(`http://localhost:3000/orders/positions/${id}`).then(response => {
            this.positions = response.data;
          });

          switch (this.orderState.name) {
            case 'Not confirmed':
              this.borderStyle = '5px solid red';
              break;
            case 'Confirmed':
              this.borderStyle = '5px solid green';
              break;
            default:
              console.error('NAME: ', this.orderState.name);
              this.borderStyle = '5px solid grey';
              break;
          }
        },
        add(position) {
          position = toRaw(position);
          let newQuantity = position.quantity + 1;
          let changeQuantityData = {order: position.order.id, product: position.product.id, quantity: newQuantity};
          console.log(changeQuantityData);

          axios.put(`http://localhost:3000/orders/positions/${position.id}`, changeQuantityData);
          location.reload();
        },
        subtract(position) {
          position = toRaw(position);
          let newQuantity = position.quantity - 1;
          let changeQuantityData = {order: position.order.id, product: position.product.id, quantity: newQuantity};
          console.log(changeQuantityData);

          axios.put(`http://localhost:3000/orders/positions/${position.id}`, changeQuantityData);
          location.reload();
        },
        async confirmOrder() {
          let changeStateData = {
            date: this.orderData.date, state: 2, userName: this.orderData.userName,
            email: this.orderData.email, phoneNumber: this.orderData.phoneNumber
          };

          await axios.put(`http://localhost:3000/orders/${this.orderData.id}`, changeStateData).catch(error => {
            console.error('ERROR:', error);
            this.reload = false;

            this.emitter.emit('empty', {missing_parameter: error.response.data.message});
          });

          axios.get(`http://localhost:3000/orders/${this.orderData.id}`).then(response => {
            this.orderData = response.data;
            this.orderState = toRaw(this.orderData.state);
          });

          if (this.reload) {
            location.reload();
          }
        },
        async cancelOrder() {
          let changeStateData = {
            date: this.orderData.date, state: 3, userName: this.orderData.userName,
            email: this.orderData.email, phoneNumber: this.orderData.phoneNumber
          };

          await axios.put(`http://localhost:3000/orders/${this.orderData.id}`, changeStateData).catch(error => {
            console.error('ERROR:', error);
            this.reload = false;

            this.emitter.emit('empty', {missing_parameter: error.response.data.message});
          });

          axios.get(`http://localhost:3000/orders/${this.orderData.id}`).then(response => {
            this.orderData = response.data;
            this.orderState = toRaw(this.orderData.state);
          });

          if (this.reload) {
            location.reload();
          }
        },
        async finishOrder() {
          let changeStateData = {
            date: this.orderData.date, state: 4, userName: this.orderData.userName,
            email: this.orderData.email, phoneNumber: this.orderData.phoneNumber
          };

          await axios.put(`http://localhost:3000/orders/${this.orderData.id}`, changeStateData).catch(error => {
            console.error('ERROR:', error);
            this.reload = false;

            this.emitter.emit('empty', {missing_parameter: error.response.data.message});
          });

          axios.get(`http://localhost:3000/orders/${this.orderData.id}`).then(response => {
            this.orderData = response.data;
            this.orderState = toRaw(this.orderData.state);
          });

          if (this.reload) {
            location.reload();
          }
        }
      },
  created() {
    const orderId = this.$route.params.order;
    this.getData(orderId);
  },
}
</script>

<style scoped>
.badge {
  background-color: #007bff;
  color: #000000;
}

button {
  margin-top: 2%;
  margin-left: 2%;
}

#quantitySpan {
  margin-left: 46%;
  position: absolute;
  font-size: 100%;
}
</style>