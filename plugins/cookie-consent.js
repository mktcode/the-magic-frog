// import Vue from 'vue';

export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') return;

  window.addEventListener('load', () => {
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#efefef',
          text: '#404040',
        },
        button: {
          background: '#557f00',
        },
      },
      theme: 'classic',
      content: {
        message: app.i18n.t('cookie.message'),
        dismiss: app.i18n.t('cookie.dismiss'),
        link: app.i18n.t('cookie.link'),
      },
    });
  });
};
