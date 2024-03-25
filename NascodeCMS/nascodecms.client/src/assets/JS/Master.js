var myClickEvent = ('ontouchstart' in document.documentElement ? "click" : "click");
var Section4Anim = 0;


$(document).ready(function (e) {
  setTimeout(function () {
    $('.BackPreloader').hide(); 
  }, 1000);
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) { console.log(e); }
  // Use our detect's results. passive applied if supported, capture will be false either way.
  document.addEventListener('touchstart', e, supportsPassive ? { passive: true } : false);
  MyMasterLoad();
});
function MyMasterLoad() {
  //loadPayment();
  //$('.sweet-overlay').on("click", function () {
  //  window.location.href = "http://localhost:4200";
  //});

  //$('.sweet-alert').unbind("click").bind("click", function (e) {
  //  e.stopPropagation();
  //});
  SetCustomScrollBar();

  //$('.openData').off("click").on("click", function (e) {

  //  if ($('.HdnfrontendLang').val() == 1) {
  //    $(".ProfileData").css({
  //      'top': $(this).height() + 42,
  //      'right': $(this).width() + 45
  //    }).stop(true, true).slideToggle(200);
  //    e.stopPropagation();
  //  }
  //  else {
  //    $(".ProfileData").css({
  //      'top': $(this).height() + 42,
  //      'left': $(this).width() + 45
  //    }).stop(true, true).slideToggle(200);
  //    e.stopPropagation();
  //  }



  //});
  $('.openCufexData').off("click").on("click", function (e) {

    if ($('.HdnfrontendLang').val() == 1) {
      $(".ProfileData").css({
        'top': $(this).height() + 18,
        'right': $(this).width() - 135
      }).stop(true, true).slideToggle(200);
    }
    else {
      $(".ProfileData").css({
        'top': $(this).height() + 18,
        'left': $(this).width() - 135
      }).stop(true, true).slideToggle(200);
    }

    e.stopPropagation();

  });

  $(document).off("click").on("click", function () {
    $('.ProfileData').stop(true, true).slideUp(200);
    $('.CCCLgroup').stop(true, true).slideUp();
  });


  $('.Option').unbind(myClickEvent).bind(myClickEvent, function (e) {
    $('.Option').not(this).removeClass("OptionSelected");
    $(this).addClass("OptionSelected");
  });

  $('.openGroups').unbind(myClickEvent).bind(myClickEvent, function (e) {
    $('.ProfileData').stop(true, true).slideUp();
    $('.CCCLgroup').stop(true, true).slideToggle();
    e.stopPropagation();
  });

  $('.openData').unbind(myClickEvent).bind(myClickEvent, function (e) {
    $('.CCCLgroup').stop(true, true).slideUp();
    $('.ProfileData').stop(true, true).slideToggle();
    e.stopPropagation();
  });

  $('.openGroupsMobile').unbind(myClickEvent).bind(myClickEvent, function (e) { 
    $('.CCCLgroupMobile').stop(true, true).slideToggle();
    e.stopPropagation();
  });
  
  $('.openLangMobile').unbind(myClickEvent).bind(myClickEvent, function (e) { 
    $('.LangMobile').stop(true, true).slideToggle();
    e.stopPropagation();
  });
 
  


  setFooterLinks();

  $(window).scroll(function () {
    if ($(location).attr("href").indexOf("new-details") !== -1
      || $(location).attr("href").indexOf("newsroom") !== -1
      || $(location).attr("href").indexOf("crowdfunding") !== -1
      || $(location).attr("href").indexOf("new-details2") !== -1
      || $(location).attr("href").indexOf("my-account") !== -1
      || $(location).attr("href").indexOf("survey") !== -1
      || $(location).attr("href").indexOf("awards") !== -1) {

    }
    else if ($(location).attr("href").indexOf("") !== -1) {
      var AllPage = parseInt($(window).height());
      var myScroll = $(window).scrollTop();
      if ($('.Section4').length > 0) { Section4 = $('.Section4').offset().top; }
      if ($('.Section4').length > 0) {
        if (myScroll > (Section4 - AllPage) && Section4Anim == 0) {
          Section4Anim = 1;
          NumberIncrementer();
        }
      }
    }
    else {
      showHideMenu();
    }
  });

  ResizeME();
  $(window).resize(function () {
    ResizeME();
    setClass();
  });

  CaptchaLoad();


  // $('.MainTabs').unbind("click").on("click", function () { 
  //     alert()
  //     var myID = $(this).data('tab');
  //     $('.MainTabs').not(this).removeClass("TabSelected");
  //     $(this).addClass("TabSelected");
  //     $('.MyTabs').not('.Tab' + myID).hide();
  //     $('.Tab' + myID).show();

  //     $('.ActionTabs').not('.ActionTabs' + myID).hide();
  //     $('.ActionTabs' + myID).show(); 
  //     if (myID == 1){
  //        // alert('2');
  //         $('.HiddenSelectedTab').val('News');
  //     }
  //     if (myID == 2){
  //        // alert('2');
  //         $('.HiddenSelectedTab').val('Events');
  //     }
  //     if (myID == 3) {
  //         $('.HiddenSelectedTab').val('Upcoming'); 
  //     }

  //     if (myID == 4) {
  //         $('.HiddenSelectedTab').val('PatientsStories');
  //         //alert($('.HiddenSelectedTab').val()); 
  //     }
  //     if (myID == 5) {
  //         $('.HiddenSelectedTab').val('RelatedFiles'); 
  //     }
  // }); 

}

function setFooterLinks() {

  $('.hideParent').parent('.parentFooter').hide();

  $('.slideMe').unbind(myClickEvent).bind(myClickEvent, function (e) {
    var MYChild = $(this).find('.openSub');
    var slideUp = $(this).find('.slideUp');
    $('.openSub').not(MYChild).stop(true, true).slideUp();
    $(MYChild).stop(true, true).slideToggle();
    $('.slideUp').not(slideUp).removeClass('rotateUp');
    $(slideUp).toggleClass('rotateUp');
  });

  $('.slideMe1').unbind(myClickEvent).bind(myClickEvent, function (e) {
    var MYChild = $(this).find('.openSub1');
    var slideUp = $(this).find('.slideUp');
    $('.openSub1').not(MYChild).stop(true, true).slideUp();
    $(MYChild).stop(true, true).slideToggle();
    $('.slideUp').not(slideUp).removeClass('rotateUp');
    $(slideUp).toggleClass('rotateUp');
  });
}

function setDate() {
  var $input = $('.datepicker2New').pickadate({
    formatSubmit: 'dd-mm-yyyy',
    container: '.container111',
    labelMonthNext: 'Go to the next month',
    labelMonthPrev: 'Go to the previous month',
    labelMonthSelect: 'Pick a month from the dropdown',
    labelYearSelect: 'Pick a year from the dropdown',
    firstDay: 1,
    selectMonths: true,
    selectYears: true,
    closeOnSelect: true,
    closeOnClear: false
  });

  $(".selectorDate").flatpickr({
    enableTime: true,
    dateFormat: "d-m-Y H:i",
    time_24hr: true
  });


  $('.datepicker2New').change(function () {
    var thisIsMe = $(this);
    var mypage = $('.MainPageTitle').data('myid');
    thisIsMe.parents('.datepicker3Container').find('.SetMyDateHere').val(thisIsMe.val());
    //if (mypage !== "Portal_Users_Loans" && mypage !== "Portal_Coupon") {
    //  LoadItems(0);
    //}
  });
  $('.datepicker2Calendar').change(function () {
    var thisIsMe = $(this);
    thisIsMe.parents('.datepicker3Container').find('.SetMyDateHere').val(thisIsMe.val());
    // LoadItems(0);
  });
  $('.datepicker2Activities').change(function () {
    $(this).parents('.datepicker3Container').find('.SetMyDateHere').val(thisIsMe.val());
    //  LoadItems(0);
  });

  $('.SetMyDateHere').change(function () {
    if ($(this).val() != '' && isValidDate($(this).val())) {
      var picker1 = $(this).parents('.datepicker3Container').find($input).pickadate('picker');
      picker1.set('select', $(this).val(), { format: 'dd-mm-yyyy' });
    }
  });


  $('.SetMyDateHere').each(function () {
    if ($(this).val() != '' && isValidDate($(this).val())) {
      var picker1 = $(this).parents('.datepicker3Container').find($input).pickadate('picker');
      picker1.set('select', $(this).val(), { format: 'dd-mm-yyyy' });
    }
  });

}

function showWhiteHeader(header) {
  if (window.location.href.toLowerCase().indexOf(404) !== -1) {
    $('.fiXedMenu').addClass('ShowMenu2fixed');
    $('.fiXedMenu').addClass('Menu2fixed');
    $('.showHeader1').hide();
    $('.ProfileData').stop(true, true).slideUp(200);
    $('.CCCLgroup').stop(true, true).slideUp(200);
  } else {
    if (header === 1) {
      // alert(header);
      $('.fiXedMenu').removeClass('ShowMenu2fixed');
      $('.fiXedMenu').addClass('Menu2fixed');
      $('.showHeader1').removeClass('u-hide');
      $('.ProfileData').stop(true, true).slideUp(200);
      $('.CCCLgroup').stop(true, true).slideUp(200);
    } else if (header === 2) {
      $('.fiXedMenu').addClass('ShowMenu2fixed');
      $('.fiXedMenu').addClass('Menu2fixed');
      // $('.fiXedMenu').removeClass('Menu2fixed');
      // $('.fiXedMenu').addClass('ShowMenu2fixed');
      $('.showHeader1').hide();
      $('.ProfileData').stop(true, true).slideUp(200);
      $('.CCCLgroup').stop(true, true).slideUp(200);
    }

  }


}

function NumberIncrementer() {
  $(".numberIncr").each(function () {
    var $el = $(this);
    var number = 0;
    var value = parseInt($('.child').val());

    var interval = setInterval(function () {
      if ($('.HdnfrontendLang').val() == 3) $('.numberIncr').text(ArNumber(number));
      else $('.numberIncr').text(number);

      if (number >= value) {
        clearInterval(interval);
        if ($('.HdnfrontendLang').val() == 3) $('.numberIncr').text(ArNumber(value));
        else $('.numberIncr').text(value);
      }
      number = number + 60;
    }, 30);
  });

  var number2 = 0;
  var value2 = parseInt($('.consult').val());
  var interval2 = setInterval(function () {
    if ($('.HdnfrontendLang').val() == 3) $('.numberIncr2').text(ArNumber(number2));
    else $('.numberIncr2').text(number2);

    if (number2 >= value2) {
      clearInterval(interval2);
      if ($('.HdnfrontendLang').val() == 3) $('.numberIncr2').text(ArNumber(value2));
      else $('.numberIncr2').text(value2);
    }
    number2 = number2 + 125;
  }, 30);


  var number3 = 0;
  var value3 = parseInt($('.percentage').val()); //$el.data("value");
  var interval3 = setInterval(function () {
    if ($('.HdnfrontendLang').val() == 3) $('.numberIncr3').text(ArNumber(number3));
    else $('.numberIncr3').text(number3);
    if (number3 >= value3) {
      clearInterval(interval3);

      if ($('.HdnfrontendLang').val() == 3) $('.numberIncr3').text(ArNumber(value3) + "%");
      else $('.numberIncr3').text(value3 + "%");

    }
    number3 = number3 + 5;
  }, 30);


  var number = 0;
  var value = parseInt($('.money').val()); //alert(parseInt($('.numberIncr4').text()));//$el.data("value");
  var interval = setInterval(function () {
    if ($('.HdnfrontendLang').val() == 3) $('.numberIncr4').text(ArNumber(number));
    else $('.numberIncr4').text(number);
    if (number >= value) {
      clearInterval(interval);
      if ($('.HdnfrontendLang').val() == 3) $('.numberIncr4').text("$" + ArNumber(value) + "م");
      else $('.numberIncr4').text("$" + value + "m");
    }
    number = number + 1;
  }, 30);
}

function ArNumber(text1) {
  if (text1 != '') {
    try {
      var myText = text1.toString();
      myText = myText.replaceAll("1", "١");
      myText = myText.replaceAll("2", "٢");
      myText = myText.replaceAll("3", "٣");
      myText = myText.replaceAll("4", "٤");
      myText = myText.replaceAll("5", "٥");
      myText = myText.replaceAll("6", "٦");
      myText = myText.replaceAll("7", "٧");
      myText = myText.replaceAll("8", "٨");
      myText = myText.replaceAll("9", "٩");
      myText = myText.replaceAll("0", "٠");
      return myText;
    }
    catch (e) {
      return text1;
    }
  }
  return text1;
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showHideMenu() {
  var showMenuhere = $(window).height() - 400;
  window.onscroll = function (e) {
    if (window.location.href.toLowerCase().indexOf(404) === -1) {
      if (this.scrollY > showMenuhere) {
        $('.fiXedMenu').slideDown(1000);
        $('.fiXedMenu').addClass('ShowMenu2fixed');
        $('.showHeader1').addClass('u-hide');
        $('.ProfileData').stop(true, true).slideUp(200);
        $('.CCCLgroup').stop(true, true).slideUp(200);
      }
      if (this.scrollY < 105) {
        // alert("600")
        $('.fiXedMenu').removeClass('ShowMenu2fixed');
        // $('.fiXedMenu').addClass('Menu2fixed');
        $('.showHeader1').removeClass('u-hide');
        $('.ProfileData').stop(true, true).slideUp(200);
        $('.CCCLgroup').stop(true, true).slideUp(200);
      }
      // }
    }
  }
}
function SetMainEvents(i) {
  //console.log("SetMainEvents")
  var MyParent = $('.OpenMe');
  var MYChild = MyParent.find('.openDesc' + i);
  var AbsoClose = MyParent.find('.AbsoClose' + i);
  // console.log(MyParent);
  // console.log("OpenMe");  
  $('.openDesc').not(MYChild).stop(true, true).slideUp();
  $(MYChild).stop(true, true).slideToggle();
  $('.AbsoClose').not(AbsoClose).removeClass('rotateP');
  $(AbsoClose).toggleClass('rotateP');
}
// function openProfileData(){
//         //position for cmb menu   
//         $(".ProfileData").css({
//             'top': $(this).height() + 22,
//             position: $(this).width() - 40
//         }).stop(true, true).slideToggle(200);
//         // e.stopPropagation();



//     // $('.openData').off("click").on("click", function (e) { 
//     //     // $('.ProfileData').stop(true, true).toggleClass('ProfileData');


//     // });
// }
//function Setlegacy(i) {
//  //     alert("test")        
//  //     var MyParent =  $('.OpenMe')[i];
//  //     var MYChild = $('.openDesc'+i); 

//  // setInterval(function(){
//  //    // alert("Hello")
//  //     console.log($('.OpenMe'+i))
//  //     $('.OpenMe'+i).trigger('click');
//  // },1000);

//  setTimeout(function () {
//    // console.log($('.OpenMe'+i))
//    // console.log( $('.AbsoClose'+i))
//    var MyParent = $('.OpenMe');
//    var AbsoClose = MyParent.find('.AbsoClose' + i);
//    $('.openDesc' + i).stop(true, true).slideDown();
//    $('.AbsoClose').not(AbsoClose).removeClass('rotateP');
//    $('.AbsoClose' + i).addClass('rotateP');
//    // var scrollTop     = $(window).scrollTop();
//    elementOffset = $('.openDesc' + i).offset().top;
//    // alert(elementOffset - scrollTop);
//    window.scroll({
//      top: elementOffset - 260,
//      behavior: 'smooth'
//    });
//    // if($(location).attr("href").indexOf("legacy-details") !== -1 ){

//    // }else if($(location).attr("href").indexOf("fundraising-programs-details") !== -1 ){
//    //     window.scroll({
//    //         top: elementOffset - 200,
//    //         behavior: 'smooth'  
//    //       });
//    // }

//    // distance      = (elementOffset - scrollTop);
//  }, 500);

//}

function openMobileMenu() {
  $('.MobileMenu').toggleClass('MobileMenuOpened');
}
function goToBottom() {
  //     $('.applynow').unbind("click").on("click", function () {
  // alert("test")
  //      });
  $("html, body").animate({ scrollTop: 1120 }, "slow");
  return false;
}

function SetCustomScrollBar() {
  if ($(".content_Y").length > 0) {
    //alert();
    $(".content_Y").mCustomScrollbar({
      updateOnContentResize: true,
      scrollButtons: {
        enable: true
      }
    });
  }

  if ($(".content_X").length > 0) {
    $(".content_X").mCustomScrollbar({
      axis: "x",
      theme: "light",
      updateOnContentResize: true,
      scrollButtons: {
        enable: true
      }
    });
  }

  //if ($(".content_XY").length > 0) {
  //    $(".content_XY").mCustomScrollbar({
  //        //axis: "yx",
  //        //theme: "light",
  //        //updateOnContentResize: true,
  //        //scrollButtons: {
  //        //    enable: true
  //        //}
  //        axis: "yx",
  //        scrollButtons: { enable: true },
  //        theme: "light",
  //        updateOnContentResize: true
  //    });
  //}
}

function scrollToTop() {
  //$(window).scrollTop(0);
  window.scroll({
    top: 0,
    behavior: 'smooth'
  });
}

function scrollToTop2() {
  var topTo = $('.scrollToHere').offset().top - $('.fiXedMenu').height() - 50
  window.scroll({
    top: topTo,
    behavior: 'smooth'
  });
}
function scrollToCrowdFunding() {
  $("html, body").animate({ scrollTop: 1680 }, "slow");
}
function scrollToCampaigns() {
  $("html, body").animate({ scrollTop: 2400 }, "slow");
}

//function scrollToBottom() {
//  var documentHeight = $(document).height();
//  $("html, body").animate({ scrollTop: documentHeight }, "slow");
//}

function scrollToBottom() {
  var body = document.body,
    html = document.documentElement;
  var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
  console.log('Height' + height)
  $("html, body").animate({ scrollTop: height + 3000 }, "slow");
}

function ResizeME() {
  if ($('.contentSlideWidth').length > 0) {
    if (window.matchMedia("(min-width: 767px)").matches) {

      if ($('.HdnfrontendLang').val() == 3) {
        $('.contentSlideWidth').width($(window).width() * 0.62);
      }
      else {
        $('.contentSlideWidth').width($(window).width() - $('.contentSlideWidth').offset().left);
      }

    }
    else {

      var MyParent = $('.contentSlideWidth');
      var AbsoClose = MyParent.find('.AbsoContent');
      $('.AbsoContent').addClass('Class');
    }
  }

}
function setClass() {
  if ($('.contentWidth1').length > 0) {
    if (window.matchMedia("(max-width: 767px)").matches) {
      $('.contentWidth').removeClass('Section6Title');
      $('.contentWidth').addClass('Section6Title1');
    }
    else {
      $('.contentWidth').removeClass('Section6Title1');
      $('.contentWidth').addClass('Section6Title');
    }
  }
}


function fadeMenu(x) {
  var MyParent = $('.OpenM');
  var MYChild = MyParent.find('.openDesc' + x);
  $('.openDesc').not(MYChild).stop(true, true).slideUp();
  $('.openSubDesc').stop(true, true).slideUp();
  $('.openSubSubDesc').stop(true, true).slideUp();
  $(MYChild).stop(true, true).slideToggle();

}

function fadeSubMenu(x) {
  var MyParent = $('.OpenM');
  var MYChild = MyParent.find('.openSubDesc' + x);
  $('.openSubDesc').not(MYChild).stop(true, true).slideUp();
  $('.openSubSubDesc').stop(true, true).slideUp();
  $(MYChild).stop(true, true).slideToggle();
}

function fadeSubSubMenu(x) {
  var MyParent = $('.OpenM');
  var MYChild = MyParent.find('.openSubSubDesc' + x);
  $('.openSubSubDesc').not(MYChild).stop(true, true).slideUp();
  $(MYChild).stop(true, true).slideToggle();
}
function fadeCufexMenu() {
  var MyParent = $('.OpenM');
  var MYChild = MyParent.find('.openMainM');
  $('.openDesc').stop(true, true).slideUp();
  $('.openSubDesc').stop(true, true).slideUp();
  $('.openSubSubDesc').stop(true, true).slideUp();
  $(MYChild).stop(true, true).slideToggle();
}

function CaptchaLoad() {

  var siteKey = '6LcXvh4eAAAAABGmqM-upWzdsDOlyC50wdKhW8o7';
  $('.captchaSubmit').unbind(myClickEvent).bind(myClickEvent, function (e) {

    e.preventDefault();
    grecaptcha.ready(function () {
      grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
        // Add your logic to submit to your backend server here. 
        $('.hiddenToken').val(token);
        // alert();
        $('.btnsave').click();
      });
    });
  });


  //$('.captchaSubmit2').unbind(myClickEvent).bind(myClickEvent, function (e) {
  //  alert();
  //  e.preventDefault();
  //  grecaptcha.ready(function () {
  //    grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
  //      // Add your logic to submit to your backend server here. 
  //      $('.hiddenToken2').val(token);
  //      // alert();
  //      $('.btnsave2').click();
  //    });
  //  });
  //});
}





function errorCallback(error) {
  console.log(JSON.stringify(error));
}
function cancelCallback() {
  console.log('Payment cancelled');
}


function loadCaptcha() { 
  var siteKey = '6LcXvh4eAAAAABGmqM-upWzdsDOlyC50wdKhW8o7';
  grecaptcha.ready(function () {
    grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
      // Add your logic to submit to your backend server here. 
      $('.hiddenToken').val(token);
      // alert();
      $('.btnsave').click();
    });
  });
}

function loadCaptcha2() { 
  var siteKey = '6LcXvh4eAAAAABGmqM-upWzdsDOlyC50wdKhW8o7';
  grecaptcha.ready(function () {
    grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
      // Add your logic to submit to your backend server here. 
      $('.hiddenToken2').val(token); 
      // alert();
      $('.btnsave2').click();
    });
  });
}

function loadPayment() {



  var interval1 = setInterval(function () {
    var src1 = $('.hiddenScriptPath').val();
    var len = $('script[src="' + src1 + '"]').length;
    //console.log(len); 
    //if ($('.hiddenMyCategory').val() === "Monthly Donation") {

    //} else {

    //}


    //alert("merchant:" + $('.hiddenAreebaMerchantID').val() + "-----" +
    //  "amount:" + $('.hiddenMyAmount').val() + "-----" +
    //  "currency:" + $('.hiddenMyCur').val() + "-----" +
    //  "description:" + $('.hiddenMydesc').val() + "-----" +
    //  "id:" + $('.hiddenMyOrderID').val() + "-----" +
    //  "session:" + $('.hiddenSessionP').val() + "-----" +
    //  "reference:" + $('.hiddenMyOrderID').val()  ); 
    if (len == 1) {
      clearInterval(interval1);
      if ($('.hiddenSessionP').length > 0) {
        Checkout.configure({
          merchant: $('.hiddenAreebaMerchantID').val(),
          order: {
            amount: $('.hiddenMyAmount').val(),
            currency: $('.hiddenMyCur').val(),
            description: $('.hiddenMydesc').val(),
            id: $('.hiddenMyOrderID').val(),
            reference: $('.hiddenMyOrderID').val()
            // id: $('.hiddenMyID').val()
          },
          session: {
            id: $('.hiddenSessionP').val()
          },
          interaction: {
            operation: 'PURCHASE',
            merchant: {
              name: 'Children Cancer Center Lebanon',
              address: {
                line1: 'American University of Beirut, Medical Center (AUBMC)',
                line2: 'Building 56, Clémenceau Street - Beirut, Lebanon '
              }
            }
            , displayControl: {
              billingAddress: 'HIDE'
            }
          },

        });
      }

      setTimeout(function () {
        GoToPayment()
      }, 500);
    }

  }, 400);




}



function GoToPayment() {

  if ($('.btnPayWithPaymentPage').length > 0) {
    $('.btnPayWithPaymentPage').click();
  }
}



function checkRequiredFields(form) {
  var elements = form.elements;
  var invalid = false;
  for (var i = 0; i < elements.length; i++) {
    elements[i].className = elements[i].className.replace('bitpay-donate-error', '');
    if (elements[i].className.indexOf("required") !== -1 && elements[i].value.length < 1) {
      elements[i].className = elements[i].className + ' bitpay-donate-error';
      invalid = true;
    };
  }
  if (invalid) { return false; }
  var donationElement = document.getElementById('donation-value');
  if (donationElement) {
    var enteredDonation = Number(donationElement.value);
    var maximumDonation = Number(document.getElementById('reference-maximum').value);
    if (enteredDonation > maximumDonation) {
      alert("Your donation was larger than the allowed maximum of " + Number(maximumDonation).toFixed(2))
      return false;
    };
  };
  var buyerEmailField = document.querySelector('[name="buyerEmail"]');
  var orderIdField = document.querySelector('[name="orderID"]');
  if (buyerEmailField && orderIdField) {
    orderIdField.value = buyerEmailField.value;
  }
  return true;
};
