import WOW from 'wow.js/dist/wow.js';

(function() {
	var yScroll = 0;
	var scrollProgress = 0;
	var viewportHeight = window.innerHeight;
	var viewportWidth = window.innerWidth;
	var pageHeight = document.body.scrollHeight;
    var target = document.getElementsByClassName('parallax');

	function liftElement(element) {
		var translateLimit = element.dataset.translationLimit || 100
		var translateValue = Math.floor(scrollProgress * translateLimit);
		var fadeThreshold = element.dataset.parallaxFadeThreshold || 1;

		element.style.transform = 'translate3d(0, '+ translateValue +'px, 0)';

		if (element.dataset.parallaxFadeout == 'true') {
			element.style.opacity = 1 - (scrollProgress * fadeThreshold);
		}
	}

	function parallax() {
		if (!target.length) return;
		
		for (var i = 0, j = target.length; i < j; i++) {
			liftElement(target[i]);
		}
	}

	if (window.requestAnimationFrame) {
		function scrollUpdater() {
			yScroll = window.scrollY;
			pageHeight = document.body.offsetHeight;
			scrollProgress = (yScroll / (pageHeight - viewportHeight))
			viewportWidth = window.innerWidth;

			if (viewportWidth >= 970) {
				parallax();
			}
			
			requestAnimationFrame(scrollUpdater);
		}
		
		scrollUpdater();
	}
})();

/*Accordion Widget for FAQ*/
var accordion = (function(){
	var head = document.getElementsByClassName('accordion-item__head');
	var body = document.getElementsByClassName('accordion-item__body');
	var setInitialStyle = (function(){
		for (var i = 0; i < body.length; i++) {
			var elementStyle = window.getComputedStyle(body[i]);
			var elementStyleVals = {
				padding: elementStyle.getPropertyValue('padding-top'),
				height: body[i].offsetHeight + 'px'
			}
			body[i].dataset.initialHeight = elementStyleVals.height;
			body[i].dataset.initialPadding = elementStyleVals.padding;
		}
	})();

	function hideBody() {
		for (var i = 0; i < body.length; i++) {
			body[i].style.cssText = "padding-top: 0; padding-bottom: 0; height: 0; visibility: hidden;";
			body[i].previousElementSibling.classList.remove('is--expanded');
		}
	}

	function showBody(elem) {
		var elemPadding = elem.dataset.initialPadding;
		var elemHeight = elem.dataset.initialHeight;

		elem.style.cssText = "padding-top: "+elemPadding+"; padding-bottom: "+elemPadding+"; height: "+elemHeight+"; visibility: visible;"
	}

	hideBody();

	for (var j = 0; j < head.length; j++) {
		head[j].addEventListener('click', function(e){
			if (this.classList.contains('is--expanded')) {
				this.classList.remove('is--expanded');
				hideBody();
			} else {
				hideBody();
				showBody(this.nextElementSibling);
				this.classList.add('is--expanded');
			}
		});
	}
})();

(function () {
    var desktopVid = document.getElementById('broadcast-desktop-vid');
    var mobileVid = document.getElementById('broadcast-mobile-vid');

    desktopVid.ontimeupdate = function() {
        if( Math.ceil(desktopVid.currentTime) === Math.ceil(desktopVid.duration)){
            desktopPauseVid();
        }
    };

    mobileVid.ontimeupdate = function() {
        if( Math.ceil(mobileVid.currentTime) === Math.ceil(mobileVid.duration)){
            mobilePauseVid();
        }
    };

    function desktopPlayVid() { 
        desktopVid.currentTime = 0;
        desktopVid.play();
        /*if(mobileVid.classList.contains('broadcast-chat__video-fadeOut')){
            mobileVid.classList.remove('broadcast-chat__video-fadeOut')
        }*/
    }

    function mobilePlayVid() { 
        mobileVid.currentTime = 0;
        mobileVid.play();
        /*if(desktopVid.classList.contains('broadcast-chat__video-fadeOut')){
            desktopVid.classList.remove('broadcast-chat__video-fadeOut')
        }*/ 
    }

    function desktopPauseVid() { 
        desktopVid.pause(); 
        desktopVid.classList.add('broadcast-chat__video-fadeOut')
        /* setTimeout(() => {*/
            if(mobileVid.classList.contains('broadcast-chat__video-fadeOut')){
                mobileVid.classList.remove('broadcast-chat__video-fadeOut')
            }
            mobileVid.classList.add('broadcast-chat__video-fadeIn')
            mobilePlayVid();
        /* }, 500);    */
    }

    function mobilePauseVid() { 
        mobileVid.pause(); 
        mobileVid.classList.add('broadcast-chat__video-fadeOut') 
        /* setTimeout(() => {*/
            if(desktopVid.classList.contains('broadcast-chat__video-fadeOut')){
                desktopVid.classList.remove('broadcast-chat__video-fadeOut')
            }
            desktopVid.classList.add('broadcast-chat__video-fadeIn')
            desktopPlayVid()
        /*}, 500);    */
    }
})();

var getTopchatBroadcastMetadataGql= function() {
    var body = `{
        chatBlastSellerMetadata{
            status
        }
    }`;
    var query = JSON.stringify({
        "query": body,
        "variables" : null,
        "operationName" : null,
	});
	var gqlUrl;
	try {	
		var isStaging = (tkpAccountUrl == 'https://accounts-staging.tokopedia.com') ? true : false;
		gqlUrl = (isStaging ? 'https://gql-staging.tokopedia.com' : 'https://gql.tokopedia.com');  
	} catch(error) {
		gqlUrl = 'http://localhost:9000';
	}	

    var promise = $.ajax({
        url: gqlUrl,
        type: 'POST',
        data: query,
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        success: function(response){}
	});
	
    return promise
}

function triggerUnavailable() {
	$('.main-text__subtitle').html('Segera Hadir.<br>Sampaikan Pesan Promosi Dalam Sekali Kirim.');
	$('.btn-try-broadcast').hide();
	$('.try-content__title').html('Nantikan Fitur Broadcast Chat');
}

$(document).ready(function () {
	new WOW().init();

	/*check user session*/

	/*var tkpdSession = {
		userId: 2059,
		shopId: 1624
	};*/
	
	try {
		if(tkpdSession.userId !== undefined && tkpdSession.shopId !== undefined && tkpdSession.shopId > 0){
			var promise = getTopchatBroadcastMetadataGql();
			promise.done(function(response){
				if(response.data) {
					if(response.data.chatBlastSellerMetadata) {
						var metadata = response.data.chatBlastSellerMetadata;
						if(metadata.status != 1) {
							triggerUnavailable();
						}
					}
				}
			});
		}
	} catch(error) {
		/*catch if tkpdSession not initialized*/
	}
})

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 50
    }, 500);
});