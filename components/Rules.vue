<template>
  <div class="lead mb-0 mt-5 bg-light text-dark border p-4 rounded-xl" style="max-width: 800px">
    <h3>How it works:</h3>
    This is a Twitter bot. Share your idea as a comment on the <a :href="'https://twitter.com/magicstoryfrog/status/' + latestTweet" target="__blank">most recent tweet</a>. Every day at midnight (UTC) the comment with the most likes will be appended to the story and a new tweet will be posted. That means: Be early and be creative!<br>
    <br>
    In your comment you can add text or an image or both. Links and HTML will be removed. Add whole sentences or build a ramp for others.
    <div class="border rounded-xl py-3 px-5 mt-2 mb-3 bg-white">
      They could hardly believe their eyes. In front of them stood a gigantic...
    </div>
    <br>
    Use line breaks to start new paragraphs.
    <div class="border rounded-xl py-3 px-5 mt-2 mb-3 bg-white">
      After defeating the gigantic dwarf king, they had to rest for a while.<br>
      <br>
      The next morning they...
    </div>
    <br>
    To add a headline, e.g. to start a new chapter, use a <i>#</i>:<br>
    <div class="border rounded-xl py-3 px-5 mt-2 mb-3 bg-white">
      <i># Chapter 2: A New Chapter</i><br>
      <br>
      After surviving the last chapter, our heros stumbled right into the next one.
    </div>
    <br>
    If you believe the story has found its worthy end, add (exactly) this headline without any further text:<br>
    <div class="border rounded-xl py-3 px-5 mt-2 mb-3 bg-white">
      <i># The End!</i>
    </div>
    If such a comment already exists, you can add a like instead and if the community agrees, a new story will start the next day, with <i> Once upon a time...</i>
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
