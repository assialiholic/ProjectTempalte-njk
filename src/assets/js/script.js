'use strict';

jQuery(function($){
// -------------------------------------------------------------------
// global Variable Setting
// -------------------------------------------------------------------
var animationSpeed = 250,
    spWidth = 751,
    pcWidth = 1080;


// -------------------------------------------------------------------
// General JS Ulility
// -------------------------------------------------------------------

// Viewport Checker
// -------------------------------------------------------------------
function viewportChecker(){
  var viewport;
  if(window.matchMedia('(max-width:' + spWidth +'px)').matches) {
      viewport = 'sp';
  } else if(window.matchMedia('(min-width:' + spWidth +'px)').matches && window.matchMedia('(max-width:' + pcWidth +'px)').matches) {
      viewport= 'responsiving';
  } else {
      viewport = 'pc';
  }
  return viewport;
}

// -------------------------------------------------------------------
// General DOM Utility
// -------------------------------------------------------------------

// SmoothScroll
// -------------------------------------------------------------------
function smoothScroll(){
  var destination;
  if($('a[href^=#]').length){
    $('a[href^=#]').not('.js_noScroll').each(function () {
      $(this).on('click', function (event) {
        var $this = $(this);
        var href = $this.attr('href');
        if ($this.parents('.js_pageTop')) {
          destination = $('body');
        } else if (href !== '#' || href !== '') {
          //hrefが#で終わるもの以外を対象にする
          destination = $(href);
        }
        if (destination.length > 0) {
          smoothScrollMove(destination);
          event.preventDefault();
        }
      });
    });
  }
}
  function smoothScrollMove(target){
  var headerHeight = $('.ly_header').height();
  var position = target.offset().top;
  var diffPosition  = position - headerHeight; // ヘッダーが固定なのでヘッダー分差し引く

  $('html, body').animate({
    scrollTop: diffPosition
  }, 550, 'swing');
  return target;
}


// Smooth Scroll On Load
// -------------------------------------------------------------------
function smoothScrollOnLoad(){
  var hash = window.location.hash,
      headerHeight = $('.ly_header').height();

  if(!hash.length) return;

  // スクロールすべきDOMが存在しない場合は発火しない
  var targetOffset = $(hash).offset();
  if(targetOffset !== null) {
    var position = $(hash).offset().top,
        diffPosition;
    if(viewportChecker()){
      diffPosition = position - headerHeight - 10;//良い感じに調整
    } else {
      diffPosition = position - headerHeight - 50;
    }

    $('html, body').animate({
      scrollTop: diffPosition
    }, 550, 'swing');
  }
}


// PageTopBtn
// -------------------------------------------------------------------
function showPageTop(){
  if(window.pageYOffset > 1){
    $('.js_pageTop').fadeIn(animationSpeed);
  }else{
    $('.js_pageTop').fadeOut(animationSpeed);
  }
  if ($(window).scrollTop() + $(window).height() >= $('.ly_footer').offset().top) {
    $('.js_pageTop').addClass('is_end');
  } else {
    $('.js_pageTop').removeClass('is_end');
  }
}



// -------------------------------------------------------------------
// Header
// -------------------------------------------------------------------


// Set Body PaddingTop
// -------------------------------------------------------------------
function setBodyPaddingTop(){
  var defer = $.Deferred();
  navWrapHeigtRemove(); // スマホで開いたNavigationの高さを初期化
  var headerHeight = $('.ly_header').outerHeight();
  $('body').css('padding-top', headerHeight);

  return defer.resolve();
}


// -------------------------------------------------------------------
// Navigation Wrapper Height Remove
// -------------------------------------------------------------------
function navWrapHeigtRemove(){
  var $headerNavWrapper = $('.bl_headerNav_wrapper');
  var spPhone = viewportChecker();

  if(!spPhone && $headerNavWrapper.hasClass('is_spOpen')) {
    // SPではなく、ヘッダーのwrapperClassに `is_spOpen` が付いていたら高さを初期化
    $headerNavWrapper.height('auto');
  }
}


// -------------------------------------------------------------------
// Plugins
// -------------------------------------------------------------------

// matchHeight.js
// -------------------------------------------------------------------
function execMatchHeight(){
  $.fn.matchHeight._maintainScroll = true;  // ウィンドウサイズを変更すると勝手にスクロールされてしまうバグ対応
  var itemArray = [
    '.js_matchHeight',
    '.js_matchHeight02',
    '.js_matchHeight03',
    '.js_matchHeight04',
    '.js_matchHeight05'
  ];
  $.each(itemArray, function(i,val) {
    $(val).matchHeight();
  });
  // js_matchHeightを多数使用すると高さがズレる要素があるのでアップデートをかける
  $.fn.matchHeight._update();
}



// -------------------------------------------------------------------
// window event
// -------------------------------------------------------------------
$(function(){
  execMatchHeight();
  smoothScroll();
});

$(window).on('load', function(){

  //実行タイミングを制御し、アンカー遷移先がヘッダーに被るのを防ぐ
  setBodyPaddingTop()
    .then(smoothScrollOnLoad());

  $(window).on('scroll', function(){
    showPageTop();
  });

  $(window).on('resize', function(){
    setBodyPaddingTop();
  });
});


});
