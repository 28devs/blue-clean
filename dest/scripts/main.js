"use strict";

//
// Modals
//
var showModalBtns = document.querySelectorAll('[data-modal]');
var modal;

if (showModalBtns.length) {
  showModalBtns.forEach(function (btn) {
    btn.addEventListener('click', showModal);
  });
}

function showModal() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
  modal = new tingle.modal({
    closeLabel: 'esc',
    closeIcon: '23',
    cssClass: ['tingle-modal--' + type],
    onClose: function onClose() {
      modal.destroy();
    }
  });

  if (type === 'widget') {
    var content = document.getElementById('modal-widget').innerHTML;
    modal.setContent(content);
  }

  modal.open();
}