/**
 * Event Emitter
 */

var Emitter = {
   emit: function(event, data) {
    var e;
    var bubbling = true, cancelable = true
    if (window.CustomEvent && (!window.isIE)) {
      e = new CustomEvent(event, { bubbles: bubbling, cancelable: cancelable, detail: data });
    } else {
      e = document.createEvent('CustomEvent');
      e.initCustomEvent(event, bubbling, cancelable, data);
    }

    window.dispatchEvent(e);
  },
    on: function(event, callback) {
    window.addEventListener(event, callback);
  }
}

export default Emitter
