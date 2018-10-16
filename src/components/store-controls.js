AFRAME.registerComponent('store-controls', {

  // schema used to declare inputs, like props
  schema: {
    hand: {default: 'left'}
  },

  init: function () {
    var el = this.el;
    var self = this;
    self.touchStarted = false;
    el.addEventListener('startScale', function () {
      self.touchStarted = true;
    });
  }
});
