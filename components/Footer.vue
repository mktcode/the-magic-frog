<template>
  <div id="footer">
    {{ $t('footer.madewith') }} <svg style="width:18px;height:18px;margin-bottom: -3px;" viewBox="0 0 24 24">
      <path fill="#eebbcc" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
    </svg> {{ $t('footer.by') }} <a href="https://hive.blog/@mkt" target="_blank">@mkt</a><br>
    <br>
    <b>{{ $t('footer.maintainers') }}</b><br>
    {{ $t('footer.french') }} <a href="https://hive.blog/@helo" target="_blank">@helo</a> (<a href="https://hivesigner.com/sign/account-witness-vote?witness=helo&approve=1" target="_blank">{{ $t('footer.vote') }}</a>)<br>
    {{ $t('footer.german') }} <a href="https://hive.blog/@mkt" target="_blank">@mkt</a><br>
     {{ $t('footer.portuguese') }} <a href="https://hive.blog/@juniorfrederico" target="_blank">@juniorfrederico</a>
  </div>
</template>

<style lang="sass">
  #footer
    text-align: center
    color: #ccc
    font-size: 1rem
    padding: 25px

  #footer a
    color: #ccc
</style>
