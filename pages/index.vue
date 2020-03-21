<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else />
    <b-container>
      <!-- Header -->
      <div class="text-center py-5">
        <img src="/avatar.png" alt=""/>
        <h1 class="pt-4">{{ $t('index.themagicfrog') }}</h1>
        <h2>{{ $t('index.storymachine') }}</h2>
        <p class="lead pt-5">{{ $t('index.helpremember') }}</p>
      </div>

      <!-- Pot -->
      <div class="text-center pb-5">
        <h2 class="pt-5 pb-3">{{ $t('index.fullofgold') }}</h2>
        <img src="/pot.png" alt=""/>
        <h5 class="mt-3">{{ $t('index.currentvalue') }}</h5>
        <h1 class="pot-value">{{ $t('index.endollar') }} {{ pot.total.toFixed(2) }} {{ $t('index.frdollar') }}</h1>

        <div class="my-4" v-if="latestStoryPost">
          <LikeButton @voteCasted="$store.dispatch('updateData')" :user="user" :likeLabel="$t('index.generatemore')" :unlikeLabel="$t('index.undogenerate')" :author="latestStoryPost.author" :permlink="latestStoryPost.permlink" v-if="latestStoryPost && user" />
          <b-button variant="primary" class="login-button" v-b-modal.scRedirectModal v-if="!user">
            <svg viewBox="0 0 24 24">
              <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
            </svg>
            {{ $t('index.logintogeneratemore') }}
          </b-button>


          <!-- Pot distribution -->
          <div class="mt-3">
            <button v-b-toggle="'rewardsInfo'" class="btn btn-sm btn-outline-secondary">
              {{ $t('index.rewards.whogetswhat') }}
              <i class="fas fa-chevron-down"></i>
            </button>
            <b-collapse id="rewardsInfo" class="border-box mx-auto mt-3" style="max-width: 400px;">
              <ul class="list-group list-group-flush">
                <li class="list-group-item bg-transparent" style="font-size: 1.2rem">
                  {{ $t('index.rewards.luckystoryteller') }}: <b>{{ pot.winner.toFixed(2) }} HBD</b>
                </li>
                <li class="list-group-item">
                  {{ $t('index.rewards.otherstorytellers') }}: <b>{{ (pot.others / latestStoryPostMeta.commands.length).toFixed(2) }} HBD</b><br>
                  <small class="text-muted">({{ $t('index.rewards.otherstorytellersinfo') }})</small>
                </li>
                <li class="list-group-item">
                  {{ $t('index.rewards.curators') }}: <b>{{ (pot.curators).toFixed(2) }} HBD</b><br>
                  <small class="text-muted">({{ $t('index.rewards.curatorsinfo') }})</small>
                </li>
                <li class="list-group-item">
                  {{ $t('index.rewards.delegators') }}: <b>{{ (pot.delegators).toFixed(2) }} HBD</b><br>
                  <small class="text-muted">({{ $t('index.rewards.delegatorsinfo') }})</small>
                </li>
                <li class="list-group-item bg-transparent" v-if="user">
                  {{ $t('index.rewards.youare') }}: <b>{{ youAre }}</b><br>
                  {{ $t('index.rewards.estimatedreward') }}: <b>{{ estimatedUserReward }} HBD</b>
                </li>
              </ul>
            </b-collapse>
          </div>
        </div>

        <!-- Explaination -->
        <p class="mt-5" v-html="$t('index.itsfree')"></p>
        <p v-html="$t('index.thiswebsite')"></p>
        <p v-html="$t('index.theinfluence')"></p>
      </div>

      <!-- Current Story -->
      <div class="py-5" v-if="latestStoryPost">
        <div class="text-center">
          <h2>{{ $t('index.read') }}</h2>
          <img src="/divider.png" alt="" class="img-fluid"/>
          <div id="currentStory" class="text-center">
            <h1 class="mb-4">{{ latestStoryPostMeta.startPhrase }}</h1>
            <button type="button" class="btn btn-sm btn-outline-secondary mb-3" @click.prevent="$store.commit('setShowUsernames', false)" v-if="showUsernames">
              {{ $t('index.hideusernames') }}
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary mb-3" @click.prevent="$store.commit('setShowUsernames', true)" v-else>
              {{ $t('index.showusernames') }}
            </button>
            <StoryPart v-for="(part, index) in displayedStoryParts" :key="index" :part="part" />
            <b-btn class="btn-outline-secondary" v-if="!showFullStory && latestStoryPostMeta.commands.length > 10" @click="showFullStory = true">{{ $t('index.readmore') }}</b-btn>
            <h3 class="mt-4" v-if="!storyHasEnded">{{ $t('index.tobe') }}</h3>
          </div>
          <img src="/divider.png" alt="" class="rotate-180 img-fluid"/>
        </div>
      </div>

      <!-- Continue -->
      <div class="mx-auto mb-4" style="max-width: 800px;" v-if="latestStoryPost && !storyHasEnded">
        <h2 class="pt-5">{{ $t('index.howwillthestorygoon') }}</h2>
        <p class="text-center mt-4">{{ $t('index.firstread') }}</p>

        <!-- Current Submissions -->
        <div id="comments">
          <Command v-for="command in currentCommands" :key="command.id" :command="command" :user="user" />
          <p class="text-center" v-if="!currentCommands.length">{{ $t('index.thereareno') }}</p>
        </div>

        <h2 class="pt-5">{{ $t('index.nowitsyourturn') }}</h2>
        <p class="text-center mt-4">{{ $t('index.continuewriting') }}</p>

        <!-- Submission Form -->
        <form class="mt-4 p-4 mx-auto command-form border-box" style="max-width: 500px;" @submit.prevent="submitComment">
          <!-- Guest Note -->
          <div v-if="!user" class="alert alert-info mx-auto" style="max-width: 500px;">
            {{ $t('index.form.guestnote') }}
          </div>

          <!-- Login/Signup if not logged in -->
          <div v-if="!user" class="text-center mb-3">
            <b-button variant="primary" v-b-modal.scRedirectModal>
              <svg viewBox="0 0 24 24">
                <path d="M22,2C22,2 14.36,1.63 8.34,9.88C3.72,16.21 2,22 2,22L3.94,21C5.38,18.5 6.13,17.47 7.54,16C10.07,16.74 12.71,16.65 15,14C13,13.44 11.4,13.57 9.04,13.81C11.69,12 13.5,11.6 16,12L17,10C15.2,9.66 14,9.63 12.22,10.04C14.19,8.65 15.56,7.87 18,8L19.21,6.07C17.65,5.96 16.71,6.13 14.92,6.57C16.53,5.11 18,4.45 20.14,4.32C20.14,4.32 21.19,2.43 22,2Z" />
              </svg>
              {{ $t('nav.login') }}
            </b-button>
            <b-button variant="primary" class="ml-2" v-b-modal.steemSignupModal>
              <svg viewBox="0 0 24 24">
                <path d="M22,2C22,2 14.36,1.63 8.34,9.88C3.72,16.21 2,22 2,22L3.94,21C5.38,18.5 6.13,17.47 7.54,16C10.07,16.74 12.71,16.65 15,14C13,13.44 11.4,13.57 9.04,13.81C11.69,12 13.5,11.6 16,12L17,10C15.2,9.66 14,9.63 12.22,10.04C14.19,8.65 15.56,7.87 18,8L19.21,6.07C17.65,5.96 16.71,6.13 14.92,6.57C16.53,5.11 18,4.45 20.14,4.32C20.14,4.32 21.19,2.43 22,2Z" />
              </svg>
              {{ $t('nav.signup') }}
            </b-button>
          </div>

          <!-- Append textarea -->
          <textarea class="w-100" id="command" :placeholder="$t('index.form.appendplaceholder')" v-model="commandInput" @keyup="limitCommandCharacters" @keydown="limitCommandCharacters"></textarea>
          <sup class="d-block text-center text-muted pt-3"><span id="command-char-count">{{ commandCharactersLeft }}</span> {{ $t('index.form.charactersleft') }}</sup>

          <!-- Image Upload -->
          <div v-if="!showImageUpload" class="text-center my-4">
            <p v-html="$t('index.form.youcaneven')"></p>
            <b-button  @click="showImageUpload = true" class="btn btn-outline-success">{{ $t('index.form.yesupload') }}</b-button>
          </div>
          <div v-if="showImageUpload">
            <p class="text-center my-4">
              <b-alert variant="info"
                       dismissible
                       :show="showImageUploadInfo"
                       @dismissed="showImageUploadInfo=false"
                       class="text-left"
                       v-html="$t('index.form.licensenote')">
              </b-alert>
              <input type="file" v-on:change="onImageChange" class="w-100 d-block" ref="image" />
              <img :src="image" v-if="image" alt="uploaded image" class="img-fluid w-100 uploaded-image" />
              <b-button size="sm" class="btn btn-outline-danger mt-3" @click="resetImage">{{ $t('index.form.changedmymind') }}</b-button>
            </p>
            <div class="upload-spinner" v-if="imageIsUploading">
              <div class="dot1"></div>
              <div class="dot2"></div>
            </div>
          </div>

          <hr>

          <div v-if="!endStory">
            <!-- End Story -->
            <div v-if="user">
              <div v-if="currentStoryPosts.length > 10">
                <p class="text-center my-4">
                  <span v-if="!commandInput">{{ $t('index.form.stopit') }}</span>
                  <span v-else>{{ $t('index.form.stopit2') }}</span>
                  <br>
                  <b-button class="btn btn-outline-danger mt-3 the-end-button" @click="endStory = true">{{ $t('index.form.theend') }}</b-button>
                </p>
              </div>
              <div v-else>
                <p class="text-center my-4">
                  <small class="text-muted"><i>{{ $t('index.form.after10days') }}</i></small>
                </p>
              </div>
            </div>
          </div>

          <!-- The End (Submit "The End" or Upvote other's "The End" submission if exists) -->
          <div v-if="endStory" class="text-center mb-4">
            <h3><i>{{ $t('index.form.theend') }}</i></h3>
            <div v-if="endCommand">
              <p v-html="$t('index.form.endalreadysuggested', {potValue: pot.total.toFixed(2)})"></p>
              <Command :command="endCommand" :user="user" />
            </div>
            <div v-else>
              <p v-html="$t('index.form.ifthecommunity', {potValue: pot.total.toFixed(2)})"></p>
            </div>
            <b-button class="btn btn-outline-success mt-3" @click="endStory = false">{{ $t('index.form.justkidding') }}</b-button>
          </div>

          <!-- Personal Note and Submit Button -->
          <div v-if="!(endStory && endCommand)">
            <hr>
            <p class="text-center mt-4 mb-1">{{ $t('index.form.addpersonalnote') }}</p>
            <textarea class="w-100" :placeholder="$t('index.form.commentplaceholder')" v-model="commentInput"></textarea>
            <div v-if="showSuccessMessage" class="text-center alert alert-success">
              {{ $t('index.form.thanksforparticipating') }}
            </div>
            <b-button v-if="showSuccessMessage" class="btn btn-sm btn-block btn-outline-success mt-3" @click="showSuccessMessage= false">{{ $t('index.form.participateagain') }}</b-button>
            <button class="btn btn-primary d-block w-100 mt-3" v-if="!showSuccessMessage">
              <svg class="spinner" viewBox="0 0 24 24" v-if="submitLoading">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
              {{ $t('index.form.submit') }}
            </button>
          </div>
        </form>
      </div>

      <div class="mb-4 text-center" v-if="latestStoryPost && storyHasEnded">
        <h1>{{ $t('index.newstory.title') }}</h1>
        <p v-html="$t('index.newstory.text', {account: $account})"></p>
      </div>

      <!-- Starting Soon notification for new instances where no post is published yet -->
      <div class="mb-4 text-center" v-if="!latestStoryPost && !storyHasEnded">
        <h1>{{ $t('index.startingsoon.title') }}</h1>
        <h3 v-html="$t('index.startingsoon.text', {account: $account})"></h3>
      </div>
    </b-container>

    <Footer />
    <Modals :user="user" />

    <no-ssr>
      <div>
        <notifications :group="'success'" :position="'top center'" :classes="'vue-notification success'" :duration="8000" />
        <notifications :group="'errors'" :position="'top center'" :classes="'vue-notification error'" :duration="8000" />
      </div>
    </no-ssr>
  </section>
</template>

<script>
import axios from 'axios'
import steem from 'steem-js-patched'
import marked from 'marked'

import { mapGetters } from 'vuex'

import NavbarLoggedIn from '~/components/NavbarLoggedIn'
import NavbarLoggedOut from '~/components/NavbarLoggedOut'
import LikeButton from '~/components/LikeButton'
import Command from '~/components/Command'
import StoryPart from '~/components/StoryPart'
import Footer from '~/components/Footer'
import Modals from '~/components/Modals'

// TODO: account creation proxy account... brilliant!
// TODO: add comment preview

export default {
  components: {
    NavbarLoggedIn,
    NavbarLoggedOut,
    LikeButton,
    Command,
    StoryPart,
    Footer,
    Modals
  },
  head() {
    // localizing meta description
    return { 
      title: this.$t('index.themagicfrog'),
      meta: [
        { hid: 'description', name: 'description', content: this.$t('index.description') }
      ] 
    }
  },
  data() {
    return {
      endStory: false, // true when user clicks "The End" to suggest the end of the story
      commandInput: '', // input for the text to append to the story
      commentInput: '', // additional comment input
      submitLoading: false, // loading indicator for form submit
      showSuccessMessage: false,
      image: null, // image url from imgur upload
      imageIsUploading: false, // loading indicator for image upload
      showImageUpload: false,
      showImageUploadInfo: true,
      showFullStory: false,
    }
  },
  computed: {
    ...mapGetters('hivesigner', ['user']),
    ...mapGetters(['pot', 'currentCommands', 'allStoryPosts', 'delegators', 'curators', 'showUsernames']),
    isDelegator () {
      return this.delegators.findIndex(delegator => {
        return delegator.delegator === this.user.account.name
      }) !== -1;
    },
    isCurator () {
      return this.curators.findIndex(curator => {
        return curator.voter === this.user.account.name
      }) !== -1;
    },
    isStoryteller () {
      return this.latestStoryPostMeta.commands.findIndex(command => {
        return command.user === this.user.account.name
      }) !== -1;
    },
    youAre () {
      let roles = [];
      if (this.isStoryteller) roles.push(this.$t('index.rewards.storyteller'));
      if (this.isCurator) roles.push(this.$t('index.rewards.curator'));
      if (this.isDelegator) roles.push(this.$t('index.rewards.delegator'));

      return roles.join(', ')
    },
    estimatedUserReward () {
      let reward = 0;
      let contributions = 0;

      // storyteller rewards
      if (this.isStoryteller) {
        this.latestStoryPostMeta.commands.forEach(command => {
          if (command.user === this.user.account.name) contributions++;
        });
        if (contributions) {
          reward += (this.pot.others / this.latestStoryPostMeta.commands.length * contributions);
        }
      }

      if (this.isCurator) {
        let curator = this.curators.find(curator => curator.voter === this.user.account.name)
        if (curator) {
          let percentage = curator.rshares / this.totalCuration * 100;
          reward += (this.pot.curators) * percentage / 100;
        }
      }

      if (this.isDelegator) {
        let delegator = this.delegators.find(delegator => delegator.delegator === this.user.account.name)
        if (delegator) {
          let percentage = delegator.sp / this.totalDelegation * 100;
          reward += (this.pot.delegators) * percentage / 100;
        }
      }

      return reward.toFixed(2);
    },
    totalCuration () {
      let totalCuration = 0;
      this.curators.forEach(curator => {
        totalCuration += curator.rshares;
      });

      return totalCuration;
    },
    totalDelegation () {
      let totalDelegation = 0;
      this.delegators.forEach(delegator => {
        totalDelegation += delegator.sp;
      });

      return totalDelegation;
    },
    currentStoryPosts() {
      return this.allStoryPosts.filter(post => {
        let meta = JSON.parse(post.json_metadata);
        return parseInt(meta.storyNumber) === this.currentStoryNumber
      });
    },
    currentStoryNumber() {
      return this.latestStoryPostMeta.storyNumber
    },
    latestStoryPost() {
      return this.allStoryPosts[0];
    },
    latestStoryPostMeta() {
      return this.latestStoryPost ? JSON.parse(this.latestStoryPost.json_metadata) : {};
    },
    displayedStoryParts() {
      if (this.showFullStory || this.latestStoryPostMeta.commands.length < 11) {
        return this.latestStoryPostMeta.commands
      }

      return this.latestStoryPostMeta.commands.slice(0, 10)
    },
    storyHasEnded() {
      return this.latestStoryPostMeta.commands
        && this.latestStoryPostMeta.commands.length
        && this.latestStoryPostMeta.commands[this.latestStoryPostMeta.commands.length - 1].type === 'end'
    },
    endCommand() {
      let endCommand = null;
      this.currentCommands.forEach(comment => {
        let meta = JSON.parse(comment.json_metadata);
        if (meta.type === 'end') {
          endCommand = comment;
        }
      });
      return endCommand;
    },
    commandCharactersLeft() {
      return Math.max(250 - this.commandInput.length, 0);
    }
  },
  methods: {
    limitCommandCharacters() {
      this.commandInput = this.commandInput.substr(0, 250);
    },
    submitComment() {
      if (this.commandInput.length < 251) {
        // if there's no user, use submitGuestComment instead
        if (this.user) {
          // comment's json_metadata
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

            // unique permlink
            let permlink = 're-' + this.latestStoryPost.permlink + '-command-' + (new Date()).getTime();

            // broadcast
            this.submitLoading = true;
            this.$hivesigner.comment(
              this.$account,
              this.latestStoryPost.permlink,
              this.user.name,
              permlink,
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
                  // reset form
                  this.commandInput = '';
                  this.commentInput = '';
                  this.submitLoading = false;
                  this.showSuccessMessage = true;
                  this.showImageUpload = false;
                  this.image = null;
                  this.endStory = false;
                  if (this.$refs.image) {
                    this.$refs.image.value = null;
                  }

                  // update data from blockchain (posts/comments)
                  this.$store.dispatch('updateData')

                  this.$notify({
                    group: 'success',
                    title: 'Submission successful!',
                    text: 'Thank you for helping to tell a magic story!'
                  });
                }
              }
            );
          }
        } else {
          // if not logged in, submit as guest
          this.submitGuestComment();
        }
      }
    },
    submitGuestComment() {
      if (this.commandInput.length < 251) {
        // comment's json_metadata
        let meta = {
          type: 'append',
          appendText: this.commandInput.trim(),
          comment: this.commentInput.trim(),
          image: this.image || '', // don't set to null, would be removed if edited via hive.io
          author: 'the-fly-swarm'
        };

        if (meta.appendText || meta.image) {
          // build comment body
          let body = '';
          if (meta.appendText) {
            body += '> ' + meta.appendText + '\n\n';
          }
          if (meta.image) {
            body += '> ![image-' + (new Date()).getTime() + '](' + meta.image + ')\n\n';
          }
          if (meta.comment) {
            body += meta.comment;
          }

          // unique permlink
          let permlink = 're-' + this.latestStoryPost.permlink + '-command-' + (new Date()).getTime();

          // broadcast
          this.submitLoading = true;
          steem.broadcast.comment(process.env.guestAccountKey, this.$account, this.latestStoryPost.permlink, 'the-fly-swarm', permlink, '', body, meta, (err) => {
            if (err) {
              console.log(err);
              this.$notify({
                group: 'errors',
                title: 'Oh no! An error occurred! :(!',
                text: 'This action could not be completed due to an unknown error. Maybe a nasty curse...'
              });
            } else {
              // reset form
              this.commandInput = '';
              this.commentInput = '';
              this.submitLoading = false;
              this.showSuccessMessage = true;
              this.showImageUpload = false;
              this.image = null;
              if (this.$refs.image) {
                this.$refs.image.value = null;
              }

              // update data from blockchain (posts/comments)
              this.$store.dispatch('updateData')

              this.$notify({
                group: 'success',
                title: 'Submission successful!',
                text: 'Thank you for helping to tell a magic story!'
              });
            }
          });
        }
      }
    },
    onImageChange() {
      // TODO: add validation of filesize and type

      // check browser support
      if (!window || !window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
      } else if (!this.$refs.image.files) {
        alert('This browser doesn\'t seem to support the `files` property of file inputs.');
      } else if (!this.$refs.image.files[0]) {
        alert("No file selected.");
      } else {
        // get file from input
        let file = this.$refs.image.files[0];

        // read actual file and upload to imgur
        let fr = new FileReader();
        fr.onload = () => {
          this.imageIsUploading = true;

          let data = fr.result;
          let base64image = data.replace('data:image/png;base64,', '')
            .replace('data:image/jpg;base64,', '')
            .replace('data:image/jpeg;base64,', '')
            .replace('data:image/gif;base64,', '');

          // popst image to imgur
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
            // and story the result
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
  async mounted () {
    // login
    this.$store.dispatch('hivesigner/login')

    // fetch data
    this.$store.dispatch('fetchPot')
    this.$store.dispatch('fetchCurrentCommands')
    this.$store.dispatch('fetchAllStoryPosts')
    this.$store.dispatch('fetchDelegators')
    this.$store.dispatch('fetchCurators')
  }
}
</script>
