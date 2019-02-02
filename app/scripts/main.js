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

function showModal(type = 'default') {
  modal = new tingle.modal({
    closeLabel: 'esc',
    closeIcon: '23',
    cssClass: ['tingle-modal--' + type],
    onClose: function () {
      modal.destroy();
    }
  });

  if (type === 'widget') {
    let content = document.getElementById('modal-widget').innerHTML;
    modal.setContent(content);
  }

  modal.open();
}