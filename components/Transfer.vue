<template>
  <b-card class="transfer my-3">
    <h5 :style="{ color: color }">{{ operation.amount }}</h5>
    <div class="text-center">
      {{ $t('wallet.history.transfer.from') }}
      <a :href="'https://hive.blog/@' + operation.from" target="_blank">{{ operation.from }}</a>
      {{ $t('wallet.history.transfer.to') }}
      <a :href="'https://hive.blog/@' + operation.to" target="_blank">{{ operation.to }}</a>
    </div>
    <small class="text-muted text-center d-block mt-3" v-if="operation.memo">{{ $t('wallet.history.transfer.memo') }}:</small>
    <p class="m-0 text-center" v-if="operation.memo">
      {{ operation.memo }}
    </p>
    <small class="text-muted text-center d-block mt-3">{{ date }}</small>
  </b-card>
</template>

<script>
  export default {
    props: ['user', 'transfer'],
    computed: {
      operation() {
        return this.transfer[1].op[1];
      },
      color() {
        return this.operation.from === this.user.name ? '#800' : '#080';
      },
      date() {
        return this.transfer[1].timestamp.replace('T', ' ');
      }
    }
  }
</script>

<style lang="sass">
  .transfer
    font-size: .9em
    .profile-image
      display: inline-block
      vertical-align: middle
      width: 30px
      height: 30px
      background-size: cover
      background-position: center
      border-radius: 50%
      margin: 0 5px 0 0
</style>