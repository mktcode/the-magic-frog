<template>
  <div class="lead mb-0 mt-5 bg-light text-dark border p-4 rounded-xl" style="max-width: 800px">
    <h3 class="mb-4">
      How it works:
    </h3>
    The Magic Frog is a Twitter bot. Share your idea of how you want the story to continue as a comment on the <a :href="`https://twitter.com/intent/tweet?in_reply_to=${latestTweet}&text=And then the magic frog came and saved the day.`" target="__blank">most recent tweet</a>.
    Every day at 12:00 (UTC) the comment with the most likes will be appended to the story and a new tweet will be posted. That means: Be early and be creative!<br>
    <b>Comments on comments will be ignored! So make sure to actually reply to the frog's tweet, continuing the story where it stopped, and not some other persons's comment.</b><br>
    <br>
    In your comment you can add text or an image or both. Links and Twitter usernames (@someuser) will be removed. Add whole sentences or build a ramp for others.<br>
    <div class="border rounded-xl py-3 px-3 px-sm-4 px-md-5 mt-2 mb-3 bg-white">
      They could hardly believe their eyes. In front of them stood a gigantic...
    </div>
    <br>
    Use line breaks to start new paragraphs.
    <div class="border rounded-xl py-3 px-3 px-sm-4 px-md-5 mt-2 mb-3 bg-white">
      After defeating the gigantic dwarf king, they had to rest for a while.<br>
      <br>
      The next morning they...
    </div>
    <br>
    To add a headline, e.g. to start a new chapter, use a <i>#</i>:<br>
    <div class="border rounded-xl py-3 px-3 px-sm-4 px-md-5 mt-2 mb-3 bg-white">
      # Chapter 2: A New Chapter<br>
      <br>
      After surviving the last chapter, our heros stumbled right into the next one.
    </div>
    <br>
    When you think the story has reached its worthy end, add a headline that says it as the last (or only) line of your comment:<br>
    <div class="border rounded-xl py-3 px-3 px-sm-4 px-md-5 mt-2 mb-3 bg-white">
      And they lived happily ever after.<br>
      <br>
      # The End!
    </div>
    Also valid:
    <div class="border rounded-xl py-3 px-3 px-sm-4 px-md-5 mt-2 mb-3 bg-white">
      # The End.<br>
      <span class="text-muted">or</span><br>
      # The End<br>
      <span class="text-muted">or</span><br>
      # the end
    </div>
    If such a comment already exists, you can add a like instead and if the community agrees, a new story will start the next day, with <i> Once upon a time...</i><br>
    <br>
    <b>Pro tip! Proper grammar and punctuation will result in a better audio version. Check it out <a href="https://cloud.google.com/text-to-speech#section-2" target="__blank">here</a> before submitting. (# will be filtered.)</b>
  </div>
</template>

<script>
export default {
  data () {
    return {
      latestTweet: process.env.LATEST_TWEET
    }
  }
}
</script>
