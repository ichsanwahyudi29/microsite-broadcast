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

$(document).ready(function () {
    console.log('masuk')
})

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 50
    }, 500);
});