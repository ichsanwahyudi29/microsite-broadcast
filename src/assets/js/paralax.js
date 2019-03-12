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