<template>
  <div class="comment text-center">
    <!-- User/Submission/Comment -->
    <div class="comment-profile-image" :style="{ backgroundImage: 'url(https://images.hive.blog/u/' + command.author + '/avatar/small)' }"></div>
    <div class="comment-username"><a :href="'https://hive.blog/@' + command.author" target="_blank">{{ command.author }}</a> {{ $t('command.wrote') }}</div>
    <div class="comment-command" v-html="appendHtml" v-if="meta.appendText"></div>
    <div v-if="meta.image" class="text-center my-3">
      <img :src="meta.image" alt="" class="img-fluid" />
    </div>
    <h3 v-if="meta.type === 'end'">{{ $t('index.form.theend') }}</h3>
    <div v-if="meta.comment">
      <sub>{{ $t('command.comment') }}</sub><br>
      <div class="comment-comment" v-html="commentHtml"></div>
    </div>

    <!-- Buttons -->
    <div>
      <LikeButton @voteCasted="$store.dispatch('updateData')" size="sm" :user="user" :author="command.author" :permlink="command.permlink" :showLikes="true" v-if="user" />
      <b-button size="sm" variant="primary" class="login-button" v-b-modal.scRedirectModal v-if="!user">
        <svg viewBox="0 0 24 24">
          <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
        </svg>
        {{ $t('command.logintovote') }}
      </b-button>
      <b-button size="sm" variant="secondary" class="ml-3" v-b-modal="'editModal-' + command.permlink" v-if="user && user.name === command.author">
        <svg viewBox="0 0 24 24">
          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
        </svg>
        {{ $t('command.edit') }}
      </b-button>
    </div>

    <!-- Edit Modal -->
    <b-modal :id="'editModal-' + command.permlink" :title="$t('command.editmodal.title')" hide-footer>
      <form class="mx-auto command-form" style="border: none;" @submit.prevent="editComment">
        <div v-if="showForm">
          <input class="w-100" id="command" :placeholder="$t('index.form.appendplaceholder')" v-model="commandInput" @keyup="limitCommandCharacters" @keydown="limitCommandCharacters" />
          <sup class="d-block text-center text-muted pt-3"><span id="command-char-count">{{ commandCharactersLeft }}</span> {{ $t('index.form.charactersleft') }}</sup>
          <div v-if="!showImageUpload" class="text-center my-4">
            <p v-html="$t('index.form.youcaneven')"></p>
            <b-button  @click="showImageUpload = true" class="btn btn-outline-success">{{ $t('index.form.yesupload') }}</b-button>
          </div>
          <div v-if="showImageUpload">
            <p class="text-center my-4">
              <input type="file" v-on:change="onImageChange" class="w-100 d-block" ref="image" />
              <img :src="image" v-if="image" alt="uploaded image" class="img-fluid w-100 uploaded-image" />
              <b-button size="sm" class="btn btn-outline-danger mt-3" @click="resetImage">{{ $t('index.form.changedmymind') }}</b-button>
            </p>
            <div class="upload-spinner" v-if="imageIsUploading">
              <div class="dot1"></div>
              <div class="dot2"></div>
            </div>
          </div>
          <div v-if="endStoryInit">
            <hr>
            <h3 class="text-center" v-if="endStory">{{ $t('index.form.theend') }}</h3>
            <div class="text-center">
              <b-button class="btn btn-outline-danger the-end-button" @click="endStory = true" v-if="!endStory">{{ $t('index.form.theend') }}</b-button>
              <b-button class="btn btn-outline-danger mt-3 the-end-button" @click="endStory = false" v-else>{{ $t('index.form.dontstopit') }}</b-button>
            </div>
          </div>
          <hr>
          <p class="text-center mt-4 mb-1">{{ $t('index.form.addpersonalnote') }}</p>
          <textarea class="w-100" :placeholder="$t('index.form.commentplaceholder')" v-model="commentInput"></textarea>
        </div>

        <div class="text-center alert alert-success" v-if="showSuccessMessage">
          {{ $t('index.form.thanksforparticipating') }}
        </div>
        <button class="btn btn-primary d-block w-100 mt-3" v-else>
          <svg class="spinner" viewBox="0 0 24 24" v-if="submitLoading">
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
          {{ $t('index.form.submit') }}
        </button>
      </form>
    </b-modal>
  </div>
</template>

<script>
  import marked from 'marked'
  import axios from 'axios'
  import LikeButton from '~/components/LikeButton'

  export default {
    components: {
      LikeButton
    },
    props: ['user', 'command'],
    data() {
      return {
        showForm: true,
        commandInput: '',
        commentInput: '',
        submitLoading: false,
        showSuccessMessage: false,
        image: null,
        endStory: null,
        endStoryInit: null,
        imageIsUploading: false,
        showImageUpload: false,
        showImageUploadInfo: true
      }
    },
    computed: {
      meta() {
        return JSON.parse(this.command.json_metadata);
      },
      appendHtml() {
        return marked(this.meta.appendText)
      },
      commentHtml() {
        return marked(this.meta.comment)
      },
      commandCharactersLeft() {
        return Math.max(250 - this.commandInput.length, 0);
      }
    },
    methods: {
      // TODO: avoid all this duplicated code somehow (from pages/index.vue)
      limitCommandCharacters() {
        this.commandInput = this.commandInput.substr(0, 250);
      },
      editComment() {
        if (this.commandInput.length < 251) {
          let meta = {
            type: this.endStory ? 'end' : 'append',
            appendText: this.commandInput.trim(),
            comment: this.commentInput.trim(),
            image: this.image || '', // don't set to null, would be removed if edited via hive.io
            author: this.user.name
          };

          if (meta.appendText || meta.image || this.endStory) {
            // build comment body
            let body = '';
            if (meta.appendText) {
              body += '> ' + meta.appendText + '\n\n';
            }
            if (meta.image) {
              body += '> ![image-' + (new Date()).getTime() + '](' + meta.image + ')\n\n';
            }
            if (this.endStory) {
              body += '> ### '+ this.$t('index.form.theend') +'!\n\n'
            }
            if (meta.comment) {
              body += meta.comment;
            }

            this.submitLoading = true;
            this.$hivesigner.comment(
              this.$account,
              this.command.parent_permlink,
              this.user.name,
              this.command.permlink,
              '',
              body,
              meta,
              (err) => {
                if (err) {
                  console.log(err);
                  this.$notify({
                    group: 'errors',
                    title: 'Oh no! An error occurred! :(!',
                    text: 'This action could not be completed due to an unknown error. Maybe a nasty curse...'
                  });
                } else {
                  this.showForm = false;
                  this.submitLoading = false;
                  this.showSuccessMessage = true;

                  this.$store.dispatch('updateData')

                  this.$notify({
                    group: 'success',
                    title: 'Submission successfully edited!',
                    text: 'Your submission was successfully updated. Thank you for helping to tell a magic story!'
                  });
                }
              }
            );
          }
        }
      },
      onImageChange() {
        // TODO: add validation of filesize and type
        if (!window || !window.File || !window.FileReader || !window.FileList || !window.Blob) {
          alert('The File APIs are not fully supported in this browser.');
        } else if (!this.$refs.image.files) {
          alert('This browser doesn\'t seem to support the `files` property of file inputs.');
        } else if (!this.$refs.image.files[0]) {
          alert("No file selected.");
        } else {
          let file = this.$refs.image.files[0];

          let fr = new FileReader();
          fr.onload = () => {
            this.imageIsUploading = true;

            let data = fr.result;
            let base64image = data.replace('data:image/png;base64,', '')
              .replace('data:image/jpg;base64,', '')
              .replace('data:image/jpeg;base64,', '')
              .replace('data:image/gif;base64,', '');

            axios({
              method: 'post',
              url: 'https://api.imgur.com/3/image',
              data: {
                image: base64image,
                type: 'base64'
              },
              headers: {
                'Authorization': 'Client-ID a57bbb06e896db0',
                'content-type': 'application/json'
              },
            }).then(result => {
              this.imageIsUploading = false;
              this.image = result.data.data.link;
            });
          };
          fr.readAsDataURL(file);
        }
      },
      resetImage() {
        this.image = null;
        this.showImageUpload = false;
        this.$refs.image.value = null;
      }
    },
    mounted() {
      this.commandInput = this.meta.appendText;
      this.commentInput = this.meta.comment;
      this.image = this.meta.image;
      this.endStoryInit = this.meta.type === 'end';
      this.endStory = this.endStoryInit;
      if (this.image) {
        this.showImageUpload = true;
      }
    }
  }
</script>

<style lang="sass">
  .comment
    font-weight: 300
    padding: 25px 0
    border-top: solid 1px #eee

    &:first-child
      border-top: none

    .comment-profile-image
      width: 40px
      height: 40px
      background-size: cover
      background-position: center
      border-radius: 50%
      margin: 0 auto

    .comment-command
      padding: 10px 0
      font-style: italic
      p,
      blockquote
        margin: 0

    .comment-comment
      background: #f8f8f8
      border-radius: 5px
      padding: 5px 10px
      margin-bottom: 10px
      display: inline-block
      color: #888
      p
        margin: 0
</style>