<template>
  <b-modal id="transferModal" :title="$t('transfermodal.title')" ref="transferModalRef" hide-footer>
    <b-container>
      <b-alert variant="info"
               dismissible
               :show="true"
               class="text-left">
        {{ $t('transfermodal.info') }}
      </b-alert>
      <b-form>
        <b-form-group id="receiver" :label="$t('transfermodal.labels.recipient')" label-for="receiver" :description="$t('transfermodal.descriptions.recipient')">
          <b-form-input id="receiver" type="text" v-model="receiver" required :placeholder="$t('transfermodal.placeholders.recipient')"></b-form-input>
        </b-form-group>

        <b-row>
          <b-col sm="7">
            <b-form-group id="amount" :label="$t('transfermodal.labels.amount')" label-for="amount" :description="$t('transfermodal.descriptions.amount', {hive: user.account.balance, hbd: user.account.hbd_balance})">
              <b-form-input id="amount" type="number" v-model="amount" required :placeholder="$t('transfermodal.placeholders.amount')"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col sm="5">
            <b-form-group id="currency" :label="$t('transfermodal.labels.currency')" label-for="currency">
              <b-form-radio-group id="currency" buttons button-variant="outline-primary" size="md" v-model="currency" :options="options" name="currency"/>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group id="memo" :label="$t('transfermodal.labels.memo')" label-for="memo">
          <b-form-textarea v-model="memo" rows="2"></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-container>
    <div class="text-center">
      <a class="btn btn-primary" :href="transferUrl" @click="$refs.transferModalRef.hide()" target="_blank">
        {{ $t('transfermodal.submit') }}
      </a>
    </div>
  </b-modal>
</template>

<script>
  export default {
    props: ['user'],
    data: function(){
      return {
        receiver: '',
        amount: 0.001,
        currency: 'HBD',
        memo: this.$t('transfermodal.placeholders.memo'),
        options: [
          { text: 'HIVE', value: 'HIVE' },
          { text: 'HBD', value: 'HBD' }
        ]
      }
    },
    computed:{
      transferUrl: function(){
        return 'https://hivesigner.com/sign/transfer?to=' + this.receiver + '&amount=' + this.amount + '%20' + this.currency + '&memo=' + this.memo;
      },
    }
  };
</script>
