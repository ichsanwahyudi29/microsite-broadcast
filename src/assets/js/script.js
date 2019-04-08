import WOW from "wow.js/dist/wow.js";

/* Accordion Widget for FAQ*/
var accordion = (function() {
  	var head = document.getElementsByClassName("accordion-item__head");
	var body = document.getElementsByClassName("accordion-item__body");
	var setInitialStyle = (function() {
		for (var i = 0; i < body.length; i++) {
			var elementStyle = window.getComputedStyle(body[i]);
			var elementStyleVals = {
				padding: elementStyle.getPropertyValue("padding-top"),
				height: body[i].offsetHeight + "px"
			};
			body[i].dataset.initialHeight = elementStyleVals.height;
			body[i].dataset.initialPadding = elementStyleVals.padding;
		}
  })();

  function hideBody() {
    for (var i = 0; i < body.length; i++) {
      body[i].style.cssText = "padding-top: 0; padding-bottom: 0; height: 0; visibility: hidden;";
      body[i].previousElementSibling.classList.remove("is--expanded");
    }
  }

  function showBody(elem) {
    var elemPadding = elem.dataset.initialPadding;
    var elemHeight = elem.dataset.initialHeight;

    elem.style.cssText = "padding-top: "+elemPadding+"; padding-bottom: "+elemPadding+"; height: " +elemHeight+"; visibility: visible;";
  }

  hideBody();

  for (var j = 0; j < head.length; j++) {
		head[j].addEventListener("click", function(e) {
			if (this.classList.contains("is--expanded")) {
				this.classList.remove("is--expanded");
				hideBody();
			} else {
				hideBody();
				showBody(this.nextElementSibling);
				this.classList.add("is--expanded");
			}
		});
  }
})();

(function() {
  var desktopVid = document.getElementById("broadcast-desktop-vid");
  var mobileVid = document.getElementById("broadcast-mobile-vid");

  desktopVid.ontimeupdate = function() {
    if (Math.ceil(desktopVid.currentTime) === Math.ceil(desktopVid.duration)) {
      desktopPauseVid();
    }
  };

  mobileVid.ontimeupdate = function() {
    if (Math.ceil(mobileVid.currentTime) === Math.ceil(mobileVid.duration)) {
      mobilePauseVid();
    }
  };

  function desktopPlayVid() {
    desktopVid.currentTime = 0;
    desktopVid.play();
  }

  function mobilePlayVid() {
    mobileVid.currentTime = 0;
    mobileVid.play();
  }

  function desktopPauseVid() {
    desktopVid.pause();
    desktopVid.classList.add("broadcast-chat__video-fadeOut");
    if (mobileVid.classList.contains("broadcast-chat__video-fadeOut")) {
      mobileVid.classList.remove("broadcast-chat__video-fadeOut");
    }
    mobileVid.classList.add("broadcast-chat__video-fadeIn");
    mobilePlayVid();
  }

  function mobilePauseVid() {
    mobileVid.pause();
    mobileVid.classList.add("broadcast-chat__video-fadeOut");
    if (desktopVid.classList.contains("broadcast-chat__video-fadeOut")) {
      desktopVid.classList.remove("broadcast-chat__video-fadeOut");
    }
    desktopVid.classList.add("broadcast-chat__video-fadeIn");
    desktopPlayVid();
  }
})();

var getTopchatBroadcastMetadataGql = function() {
  var body = `{
        chatBlastSellerMetadata{
            status
        }
    }`;
  var query = JSON.stringify({
    "query": body,
    "variables": null,
    "operationName": null
  });
  var gqlUrl;
  try {
	var isStaging = tkpAccountUrl == "https://accounts-staging.tokopedia.com" ? true : false;
    gqlUrl = isStaging ? "https://gql-staging.tokopedia.com" : "https://gql.tokopedia.com";
  } catch (error) {
    gqlUrl = "http://localhost:9000";
  }

  var promise = $.ajax({
    url: gqlUrl,
    type: "POST",
    data: query,
    contentType: "application/json",
    dataType: "json",
    async: false,
    xhrFields: { withCredentials: true },
    success: function(response) {}
  });

  return promise;
};

function triggerAvailable() {
  $(".main-text__subtitle").html("Sampaikan Pesan Promosi Dalam Sekali Kirim");
  $(".btn-recognize-broadcast").show();
  $(".btn-try-broadcast").show();
  if( $(window).width() <= 1024){
    $(".btn-try-broadcast").addClass("js__dialog-blocker");
    $(".btn-try-broadcast").removeAttr("href");
  }
  $(".try-content__title").html("Yuk Coba<br>Broadcast Chat Sekarang");
}

function triggerUnavailable() {
  $(".main-text__subtitle").html("Segera Hadir.<br>Sampaikan Pesan Promosi Dalam Sekali Kirim.");
  $(".btn-recognize-broadcast").show();
  $(".btn-try-broadcast").show();
  $(".btn-try-broadcast").addClass("js__register-broadcast");
  $(".btn-try-broadcast").removeAttr("href");
  $(".btn-try-broadcast button").text("Daftar Sekarang");
  $(".try-content__title").html("Yuk daftar jadi salah satu penjual yang terpilih mencoba fitur Broadcast Chat");
}

$(document).ready(function() {
  new WOW().init();

  /* check user session */

  /*var tkpdSession = {
    userId: 2059,
    shopId: 1624
  };*/

  var isWhitelist = true;

	try {
		if (tkpdSession.userId !== undefined && tkpdSession.shopId !== undefined && tkpdSession.shopId > 0) {
			var promise = getTopchatBroadcastMetadataGql();
			promise.done(function(response){
				if(response.data) {
					if(response.data.chatBlastSellerMetadata) {
						var metadata = response.data.chatBlastSellerMetadata;
						if(metadata.status != 1) {
							isWhitelist = false
						}
					}
				}
			});
		}
	} catch (error) {
    	/*catch if tkpdSession not initialized*/
	}
	if (isWhitelist) {
		triggerAvailable();
	} else {
		triggerUnavailable();
	}
});

$(document).on("click", 'a[href^="#"]', function(e) {
  e.preventDefault();

  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top - 100
    },
    500
  );
});

$(function handleBtnBlockerVersion() {
  $(".js__dialog-blocker").on({
    click: function(e) {
	  e.stopPropagation();
      handleOpenDialog("#js__unf-dialog--blocker");
    }
  });
});

$(function handleBtnRegisterBroadcast() {
  $(".js__register-broadcast").on({
    click: function(e) {
	  e.stopPropagation();
      handleOpenDialog("#js__unf-dialog--success");
    }
  });
});

$(function globalCloseDialog() {
  $("body").on({
    click: function() {
      if ($(".unf-dialog").hasClass("unf-dialog--show")) {
        handleCloseDialog();
      }
    }
  });
});

$(function handleClickDialogInside() {
  $(".unf-dialog").on({
    click: function(e) {
      e.stopPropagation();
    }
  });
});

function handleOpenDialog(el) {
  $("body").css("overflow", "hidden");
  $(".unf-overlay").addClass("unf-overlay--show");
  $(el).addClass("unf-dialog--show");
}

window.handleCloseDialog = handleCloseDialog

function handleCloseDialog() {
  $("body").removeAttr("style");
  $(".unf-overlay").removeClass("unf-overlay--show");
  $(".unf-dialog").removeClass("unf-dialog--show");
}
