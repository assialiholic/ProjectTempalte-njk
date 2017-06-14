jQuery(function($){
// -------------------------------------------------------------------
// global Variable Setting
// -------------------------------------------------------------------
var animationSpeed = 250,
    spWidth = 751,  // ブレークポイント
    pcWidth = 1080,  // ブレークポイント
    winW = window.innerWidth,
    spBeforeState = (window.innerWidth <= spWidth); // スマフォ表示に切り替わったか確認用




// -------------------------------------------------------------------
// General JS Ulility
// -------------------------------------------------------------------

// SP Checker
// -------------------------------------------------------------------
function spChecker(){
  var spPhone;
  if(window.innerWidth <= spWidth) {
    spPhone = true;
  } else {
    spPhone = false;
  }
  return spPhone;
}

// Responsive Checker
// -------------------------------------------------------------------
function respoChecker(){
  var duringRespo;
  if(window.innerWidth >= spWidth && window.innerWidth <= pcWidth) {
    duringRespo = true;
  } else {
    duringRespo = false;
  }
  return duringRespo;
}




// -------------------------------------------------------------------
// General DOM Utility
// -------------------------------------------------------------------

// SmoothScroll
// -------------------------------------------------------------------
function smoothScroll(){
  var target;
  if($('a[href^=#]').length){
    $('a[href^=#]').not('.js_noScroll').each(function(){
      $(this).click(function(event) {
        var $this = $(this);
        var href  = $this.attr("href");
        if($this.parents('.js_pageTop')){
          // クリックした DOM に js_pageTop が合った場合
          target = $('body');
        }else if(href != "#" || href !== ""){
          //hrefが#で終わるもの以外を対象にする
          target = $(href);
        }
        if (target.length > 0) {
          smoothScrollMove(target);
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

  $("html, body").animate({
    scrollTop: diffPosition
  }, 550, "swing");
  return target;
}


// Smooth Scroll On Load
// -------------------------------------------------------------------
function smoothScrollOnLoad(){
  var query = window.location.search,
      hash = window.location.hash,
      headerHeight = $('.ly_header').height();

  // クエリやハッシュがない場合は発火しない
  if(!(query.length || hash.length)) return;

  // タブコンテンツ等用にハッシュを使用する場合、クエリ「?id=id値」を抽出しスクロールを実現する
  if(query.length){
    var queryArray = query.slice(1).split('&');
    for (var i = 0; i < queryArray.length; i++) {
      if (queryArray[i].match(/id=/)) {
         hash = '#' + (queryArray[i].split('=')[1]);
      }
    }
   }

  // スクロールすべきDOMが存在しない場合は発火しない
  var targetOffset = $(hash).offset();
  if(targetOffset != null) {

    function accordionExpander(){
      var defer = $.Deferred();

      if($(hash).is(':hidden')) {
        var accordionWrappers = '.js_spAccordion, .js_heroAccordion',
            accordionBtns = '.js_spAccordion_ttl, .js_heroAccordion_btn';
        $(hash).parents(accordionWrappers).find(accordionBtns).trigger('click')
        return defer.resolve();
      } else {
        return defer.resolve();
      }
    }

    function mover(){
      var position = $(hash).offset().top;
      if(spChecker()){
        var diffPosition = position - headerHeight - 10;//良い感じに調整
      } else {
        var diffPosition = position - headerHeight - 50;
      }

      $("html, body").animate({
        scrollTop: diffPosition
      }, 550, "swing");
    }

    accordionExpander().then(function(){
      setTimeout(function(){
        mover();
      }, animationSpeed)
    });
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


// lateFadeIn
// -------------------------------------------------------------------
function lateFadeIn(){
  $('.js_lateFadeIn').each(function(){
    $('> *', $(this)).each(function(){
      var $this = $(this);
      setTimeout(function(){
        $this.animate({
          opacity: 1
        }, animationSpeed * 8);
      }, animationSpeed * 4);
    });
  });
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
  var spPhone = spChecker();

  if(!spPhone && $headerNavWrapper.hasClass('is_spOpen')) {
    // SPではなく、ヘッダーのwrapperClassに `is_spOpen` が付いていたら高さを初期化
    $headerNavWrapper.height('auto');
  }
}





// Dropdown
// -------------------------------------------------------------------
function dropDownMenu(){
  $('.js_dropDown').each(function(){
    var spPhone = spChecker();
    if(spPhone) return;

    var $this = $(this),
        $anchor = $('> a', $this);
        $body = $this.find('.js_dropDown_body');

    $this.on({
      mouseenter: function(){
        $anchor.addClass('is_active');
        $body.stop().fadeIn(animationSpeed);
      },
      mouseleave: function(){
        $body.stop().fadeOut(animationSpeed);
        $anchor.removeClass('is_active');
      }
    });
  });
}


// Accordion
// -------------------------------------------------------------------
// function accordion(){
//   $('.js_accordion').each(function(){

//     var $this = $(this),
//         $btn = $this.find('.js_accordion_btn');
//         $body = $this.find('.js_accordion_body');

//     $this.on({
//       click: function(){
//         $anchor.addClass('is_active');
//         $body.stop().fadeIn(animationSpeed);
//       }
//     });
//   });
// }



// -------------------------------------------------------------------
// Plugins
// -------------------------------------------------------------------


// matchHeight.js
// -------------------------------------------------------------------
function execmatchHeight(){
  $.fn.matchHeight._maintainScroll = true;  // ウィンドウサイズを変更すると勝手にスクロールされてしまうバグ対応
  var itemArry = [
    '.js_matchHeight',
    '.js_matchHeight02',
    '.js_matchHeight03',
    '.js_matchHeight04',
    '.js_matchHeight05'
  ];
  $.each(itemArry, function(i,val) {
    $(val).matchHeight();
  });
  // js_matchHeightを多数使用すると高さがズレる要素があるのでアップデートをかける
  $.fn.matchHeight._update();
}


// Hiraku.js
// -------------------------------------------------------------------

function execHiraku(){
  $(".js_offcanvas").hiraku({
    btn: ".js_offcanvas_btn",
    direction: "right",
    breakpoint: spWidth
  });
}




// -------------------------------------------------------------------
// window event
// -------------------------------------------------------------------
$(function(){
  execmatchHeight();
  execHiraku();
  dropDownMenu();
  smoothScroll();
});

$(window).on('load', function(){
  lateFadeIn();

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
