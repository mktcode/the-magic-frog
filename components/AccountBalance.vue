<template>
  <b-container class="text-center">
    <p class="mb-0">{{ $t('wallet.balance.youhave') }}:</p>
    <h2>{{ user.account.balance }}</h2>
    <h2>{{ user.account.hbd_balance }}</h2>
    <p class="mt-4 mb-0">{{ $t('wallet.balance.estimatedvalue') }}:</p>
    <h3 class="mt-0">$ {{ estimatedValue }}</h3>
    <b-btn v-b-modal.transferModal variant="primary" class="mt-3">{{ $t('wallet.balance.transferbutton') }}</b-btn>
  </b-container>
</template>
<script>
  import axios from 'axios'

  export default {
    props: ['user'],
    data() {
      return {
        hivePrice: 0,
        hbdPrice: 0
      }
    },
    computed: {
      estimatedValue() {
        let hiveBalance = parseFloat(this.user.account.balance.replace(' HIVE', ''));
        let hbdBalance = parseFloat(this.user.account.hbd_balance.replace(' HBD', ''));

        return ((hiveBalance * this.hivePrice) + (hbdBalance * this.hbdPrice)).toFixed(2);
      }
    },
    mounted() {
      // getting hive price (cmc id 1230)
      axios.get('https://api.coinmarketcap.com/v2/ticker/1230/').then(hivePrice => {
        // getting hbd price (cmc id 1312)
        axios.get('https://api.coinmarketcap.com/v2/ticker/1312/').then(hbdPrice => {
          this.hivePrice = hivePrice.data.data.quotes.USD.price;
          this.hbdPrice = hbdPrice.data.data.quotes.USD.price;
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  }
</script>
