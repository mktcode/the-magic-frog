<template>
  <b-modal id="steemSignupModal" :title="$t('signupmodal.title')">
    <p class="mb-0" v-html="$t('signupmodal.text')"></p>
    <div class="alert alert-info mt-4" v-html="$t('signupmodal.note')"></div>
    <p class="mb-0">{{ $t('signupmodal.redirect') }}</p>
    <div slot="modal-footer" class="w-100 text-center">
      <a href="https://signup.hive.io.com/?ref=the-magic-frog" class="btn btn-primary">{{ $t('signupmodal.button') }}</a>
    </div>
  </b-modal>
</template>