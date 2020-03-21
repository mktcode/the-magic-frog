<template>
  <div class="d-inline-block">

    <!-- Buttons without Likes Counter -->
    <!-- Like -->
    <b-button :size="size" variant="primary" class="like-button" v-if="!hasVoted && !showLikes" @click="$refs['voteControlModal-' + permlink].show()">
      <svg viewBox="0 0 24 24" v-if="!loading">
        <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
      </svg>
      <svg class="spinner" viewBox="0 0 24 24" v-else>
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
      {{ likeLabel || $t('likebutton.like') }}
    </b-button>

    <!-- Unlike -->
    <b-button :size="size" variant="outline-secondary" class="like-button" @click="vote(0)" v-if="hasVoted && !showLikes">
      <svg viewBox="0 0 24 24" v-if="!loading">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
      </svg>
      <svg class="spinner" viewBox="0 0 24 24" v-else>
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
      {{ unlikeLabel || $t('likebutton.unlike') }}
    </b-button>


    <!-- Buttons with Likes Counter -->
    <!-- Like -->
    <b-button-group :size="size" v-if="!hasVoted && showLikes" class="like-button-group">
      <b-button disabled variant="outline-secondary">{{ votes.length }}</b-button>
      <b-button variant="primary" class="like-button" @click="$refs['voteControlModal-' + permlink].show()">
        <svg viewBox="0 0 24 24" v-if="!loading">
          <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
        </svg>
        <svg class="spinner" viewBox="0 0 24 24" v-else>
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
        </svg>
        {{ likeLabel || $t('likebutton.like') }}
      </b-button>
    </b-button-group>

    <!-- Unlike -->
    <b-button-group :size="size" v-if="hasVoted && showLikes" class="like-button-group">
      <b-button disabled variant="outline-secondary">{{ votes.length }}</b-button>
      <b-button :size="size" variant="outline-secondary" class="like-button" @click="vote(0)">
        <svg viewBox="0 0 24 24" v-if="!loading">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
        </svg>
        <svg class="spinner" viewBox="0 0 24 24" v-else>
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
        </svg>
        {{ unlikeLabel || $t('likebutton.unlike') }}
      </b-button>
    </b-button-group>

    <b-modal :ref="'voteControlModal-' + permlink" :id="'voteControlModal-' + permlink" hide-footer :title="$t('votemodal.title')">
      <div class="text-center"><small class="text-muted">{{ $t('votemodal.adjuststrength') }}</small></div>
      <ul class=" vote-control pagination justify-content-center mt-2">
        <li :class="{'page-item': true, disabled: voteWeight === 0}"><a href="#" class="page-link vote-controls" @click.prevent="setVoteWeight(voteWeight - 10)">-10</a></li>
        <li :class="{'page-item': true, disabled: voteWeight === 0}"><a href="#" class="page-link vote-controls" @click.prevent="setVoteWeight(voteWeight - 1)">-1</a></li>
        <li class="page-item vote-weight">
          <input type="number" class="form-control" v-model="voteWeight" min="0" max="100" />
        </li>
        <li :class="{'page-item': true, disabled: voteWeight === 100}"><a href="#" class="page-link vote-controls" @click.prevent="setVoteWeight(voteWeight + 1)">+1</a></li>
        <li :class="{'page-item': true, disabled: voteWeight === 100}"><a href="#" class="page-link vote-controls" @click.prevent="setVoteWeight(voteWeight + 10)">+10</a></li>
      </ul>

      <div class="text-center">
        <button type="submit" :class="'btn btn-' + (voteWeight > 0 ? 'primary' : 'danger' )" @click="vote(voteWeight)">
          <i :class="'fas fa-' + (voteWeight > 0 ? 'thumbs-up' : 'ban' )"></i> {{ voteWeight > 0 ? $t('likebutton.like') : $t('likebutton.unlike') }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  // TODO: vote weight slider

  import steem from 'steem-js-patched'

  export default {
    props: ['size', 'user', 'author', 'permlink', 'likeLabel', 'unlikeLabel', 'showLikes'],
    data() {
      return {
        loading: false,
        votes: [],
        hasVoted: false,
        voteWeight: 100
      }
    },
    methods: {
      setVoteWeight (weight) {
        this.voteWeight = weight
        // ensure min/max value
        this.voteWeight = this.voteWeight > 100 ? 100 : this.voteWeight
        this.voteWeight = this.voteWeight < 0 ? 0 : this.voteWeight
      },
      vote(weight) {
        this.$refs['voteControlModal-' + this.permlink].hide()
        this.loading = true;
        this.$hivesigner.vote(this.user.name, this.author, this.permlink, weight * 100, (err) => {
          this.loading = false;
          if (err) {
            console.log(err);
            this.$notify({
              group: 'errors',
              title: this.$t('likebutton.error.title'),
              text: this.$t('likebutton.error.text')
            });
          } else {
            this.hasVoted = weight > 0;
            if (this.hasVoted) {
              this.$notify({
                group: 'success',
                title: this.$t('likebutton.casted.title'),
                text: this.$t('likebutton.casted.text')
              });
            } else {
              this.$notify({
                group: 'success',
                title: this.$t('likebutton.removed.title'),
                text: this.$t('likebutton.removed.text')
              });
            }
            this.$emit('voteCasted'); // emit event to update data
            // update votes
            steem.api.getActiveVotes(this.author, this.permlink, (err, votes) => {
              if (err) {
                console.log(err);
              } else {
                this.votes = votes;
              }
            });
          }
        });
      }
    },
    mounted() {
      // get votes for vote counter
      steem.api.getActiveVotes(this.author, this.permlink, (err, votes) => {
        if (err) {
          console.log(err);
        } else {
          this.votes = votes;
          for (let i = 0; i < this.votes.length; i++) {
            if (this.votes[i].voter === this.user.name && this.votes[i].percent > 0) {
              this.hasVoted = true;
            }
          }
        }
      });
    }
  };
</script>

<style lang="sass">
  .like-button-group
    .btn.btn-outline-secondary:first-child
      color: #333
      &:hover
        background-color: #fff
  .vote-control
    .vote-weight
      margin-top: -5px
      .form-control
        font-size: 1.5rem
        text-align: center
</style>