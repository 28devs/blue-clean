"use strict";

// DEV
u('.aside__nav-link').on('click', function () {
  if (!u(this).parent().hasClass('active')) {
    u('.aside__nav-item').removeClass('active');
  }

  u(this).parent().toggleClass('active');
});
u('.header__menu-right').on('click', function () {
  u('.header').toggleClass('header-is-right-menu');
});
u('.header__menu').on('click', function () {
  if (window.innerWidth < 1024) {
    if (window.innerWidth < 768) {
      toggleMobileAside();
    } else {
      toggleTabletAside();
    }
  } else {
    u('.aside').toggleClass('aside--collapsed');
    u('body').toggleClass('aside-is-collapsed');
  }

  setasideMenuHeight();
});
window.addEventListener('resize', function () {
  asideHandler();
});

function setasideMenuHeight() {
  var height = u('.aside').size().height - u('.aside__account').size().height - u('.aside__search').size().height - u('.aside__nav-fixed').size().height;
  u('.aside__nav-scroll-wrapper').first().style.height = height + 'px';
}

setasideMenuHeight();

function asideHandler() {
  setasideMenuHeight();

  if (window.innerWidth < 768) {
    u('.aside').removeClass('aside--collapsed');
    u('body').removeClass('aside-is-collapsed');
    return;
  }

  u('.aside__mobile-cover').remove();

  if (window.innerWidth < 1024) {
    u('.aside').addClass('aside--collapsed');
    u('body').addClass('aside-is-collapsed');
  } else {
    u('.aside').removeClass('aside--collapsed');
    u('body').removeClass('aside-is-collapsed');
  }
}

asideHandler();

function toggleTabletAside() {
  if (u('.aside').hasClass('aside--collapsed')) {
    u('.aside').removeClass('aside--collapsed');
    u('body').removeClass('aside-is-collapsed');
    u('body').first().style.overflow = 'hidden';
    u('body').append('<div onclick="toggleTabletAside()" class="aside__mobile-cover"></div>');
  } else {
    u('.aside').addClass('aside--collapsed');
    u('body').addClass('aside-is-collapsed');
    u('body').first().style.overflow = 'auto';
    u('.aside__mobile-cover').remove();
  }

  setasideMenuHeight();
}

function toggleMobileAside() {
  if (u('.aside').hasClass('aside--mobile-show')) {
    u('.aside').removeClass('aside--mobile-show');
    u('body').first().style.overflow = 'auto';
    u('.aside__mobile-cover').remove();
  } else {
    u('.aside').addClass('aside--mobile-show');
    u('body').first().style.overflow = 'hidden';
    u('body').append('<div onclick="toggleMobileAside()" class="aside__mobile-cover"></div>');
  }

  setasideMenuHeight();
}

setTimeout(setasideMenuHeight, 300); //
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
    cssClass: ['tingle-modal--' + type],
    onClose: function onClose() {
      modal.destroy();
    }
  });

  if (type === 'widget') {
    var _content = document.getElementById('modal-widget').innerHTML;
    modal.setContent(_content);
    setTimeout(function () {
      new Glide('.tingle-modal--widget .glide', {
        peek: 180,
        gap: 40,
        breakpoints: {
          767: {
            peek: 80,
            gap: 20
          },
          527: {
            peek: 30,
            gap: 10
          }
        }
      }).mount();
    }, 100);
  }

  var content = document.getElementById('modal-' + type).innerHTML;
  modal.setContent(content);
  modal.open();
  tabsInit();
} //
// Tabs
//


function tabsInit() {
  tabbis.init();
}

tabsInit(); //
// Tooltips
//

var tooltipOptions = {
  animation: 'shift-toward',
  arrow: true,
  duration: [175, 150]
};
tippy.setDefaults(tooltipOptions);
u('[data-tippy-template]').each(function (elem) {
  var id = u(elem).data('tippy-template');
  var content = u('#' + id).html();
  console.log(content);
  tippy(elem, {
    content: content
  });
});