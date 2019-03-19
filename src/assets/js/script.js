import WOW from 'wow.js/dist/wow.js';

// Accordion Widget for FAQ
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
    }

    function mobilePlayVid() { 
        mobileVid.currentTime = 0;
        mobileVid.play();
    }

    function desktopPauseVid() { 
        desktopVid.pause(); 
        desktopVid.classList.add('broadcast-chat__video-fadeOut')
		if(mobileVid.classList.contains('broadcast-chat__video-fadeOut')){
			mobileVid.classList.remove('broadcast-chat__video-fadeOut')
		}
		mobileVid.classList.add('broadcast-chat__video-fadeIn')
		mobilePlayVid();   
    }

    function mobilePauseVid() { 
        mobileVid.pause(); 
        mobileVid.classList.add('broadcast-chat__video-fadeOut') 
		if(desktopVid.classList.contains('broadcast-chat__video-fadeOut')){
			desktopVid.classList.remove('broadcast-chat__video-fadeOut')
		}
		desktopVid.classList.add('broadcast-chat__video-fadeIn')
		desktopPlayVid()  
    }
})();

$(document).ready(function () {
	new WOW().init();

	// check user session

	var tkpdSession = [{
		userId: undefined
	}]

	if(tkpdSession.userId == undefined){
		$('.main-text__subtitle').html('Segera Hadir.<br>Sampaikan Pesan Promosi Dalam Sekali Kirim.');
		$('.btn-try-broadcast').hide();
		$('.try-content__title').html('Nantikan Fitur Broadcast Chat');
	}
})

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 50
    }, 500);
});