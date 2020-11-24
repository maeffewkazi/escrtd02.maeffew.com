
var $body = $('body'),
		//thisPage = $body.attr('data-page'),
		device = $body.attr('data-device'),
		site = $body.attr('data-site'),
		height = $(window).height(),
		width = $(window).width()
;



	if ( ! Modernizr.objectfit ) {
		$('.objectFitWrapper').each(function () {
			var $container = $(this),
			imgUrl = $container.find('img').prop('src');
			if (imgUrl) {
				$container
				.css('backgroundImage', 'url(' + imgUrl + ')')
				.addClass('objectFitFallBack');
			}  
		});
	}

(function($){
	
	$.fn.rhLazy=function(options){
		
		var settings = $.extend({ 
			scrollThreshold:1000,
			ajax:false
		},options);
		
				
		function offset(el) {
		    var rect = el.getBoundingClientRect();
		    
		    if (settings.ajax === false) {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			} else {
				var ajaxContainer = document.getElementById('ajaxContainer');
				scrollTop = ajaxContainer.scrollTop;
			}

		    return { top: rect.top + scrollTop }
		}

		
			var lazyloadImages = document.querySelectorAll("img.lazy");    
			var lazyloadThrottleTimeout;
			
			lazyload();
		  
			function lazyload() { 
				
				lazyloadImages = document.querySelectorAll("img.lazy"); 
			  
			    if(lazyloadThrottleTimeout) {
			      clearTimeout(lazyloadThrottleTimeout);
			    }    
		    
			    lazyloadThrottleTimeout = setTimeout(function() {
			     	if (settings.ajax === false) {
						var scrollTop = window.pageYOffset;
					} else {
						var ajaxContainer = document.getElementById('ajaxContainer');
						scrollTop = ajaxContainer.scrollTop;
					}
						       
			        lazyloadImages.forEach(function(img) {

						var divOffset = offset(img);

			            if(divOffset.top < (window.innerHeight + scrollTop + settings.scrollThreshold)) {
			              img.src = img.dataset.src;
			              img.classList.remove('lazy');
			            }
			        });
			        if(lazyloadImages.length == 0) { 
			          document.removeEventListener("scroll", lazyload);
			          window.removeEventListener("resize", lazyload);
			          window.removeEventListener("orientationChange", lazyload);
			        }
			    }, 20);
		    
			}
 
			if (settings.ajax === false) {
				document.addEventListener("scroll", lazyload);
			} else {
				document.getElementById('ajaxContainer').addEventListener("scroll", lazyload);
			}
			
			window.addEventListener("resize", lazyload);
			window.addEventListener("orientationChange", lazyload);
		
	}
}(jQuery));	

  






(function($){
	
	$.fn.rhBanner=function(options){
		
		var settings = $.extend({ 
			parallaxRatio:1.4,
			ajax:false,
			selector:'body'
		},options);
		
		// Detect css transform
		var cssTransform = (function(){
		    var prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' '), 
		    	cssTransform, 
		    	i = 0
				while( cssTransform === undefined ){ 
		       		cssTransform = document.createElement('div').style[prefixes[i]] != undefined ? prefixes[i] : undefined
			   		i++
				}
		     return cssTransform;
		    
		})() 
		
		// Detect request animation frame
		var rhParallaxScroll = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60) }
		
			// set up vars
			var rhParallaxElements=this,
			rhParallaxSize = rhParallaxElements.length,
			matrix = [],
			lastPosition,
			wHeight;
				
			// Pre calculate sizes to get better perfs
			function rhParallaxSizes(){
			    lastPosition = -1 // Force a recalculation
			    wHeight = window.innerHeight
			    var i = 0
			    
			    for (i =0; i<rhParallaxSize; i++){
			        matrix[i] = matrix[i] || { el: rhParallaxElements[i] }	       
			        
					var rect=matrix[i].el.getBoundingClientRect();
					matrix[i].height=matrix[i].el.offsetHeight;
					
					if (settings.ajax === false) {  
						matrix[i].start=rect.top+window.pageYOffset;
					} else {  
						matrix[i].start=rect.top;
					}

					matrix[i].stop=matrix[i].start+matrix[i].height;
					matrix[i].child=matrix[i].el.childNodes[1];
					
					matrix[i].child.style.height = matrix[i].height * settings.parallaxRatio + 'px';
					
					matrix[i].childHeight=matrix[i].child.offsetHeight;
					matrix[i].offset=matrix[i].childHeight-matrix[i].height;
			    }
			}
			
			$(window).resize(function() {
				rhParallaxSizes();
			});
			
			// Lets Do This
			rhParallaxSizes();
			loop();
			
			
		
		function setTop(m, t){
		    if (cssTransform)
		        m.child.style[cssTransform] = "translate3d(0, "+ t +"px,0)"
		    else
		        m.child.style["top"] = t
		}
		
		function loop(){ 
			
			var parallaxScrollPos;
			
			if (settings.ajax === false) { 
				parallaxScrollPos = window.pageYOffset;
			} else { 
				parallaxScrollPos = $(settings.selector).scrollTop();
			}
				
				// Avoid calculations if not needed
			    if (lastPosition == parallaxScrollPos) {
			        rhParallaxScroll(loop)
			        return false
			        
			    } else { 
				    
				    if (settings.ajax === false) {
						lastPosition = window.pageYOffset
					} else {
						lastPosition = $(settings.selector).scrollTop();
					}
								    
				    var i = 0
				    for (i =0; i<rhParallaxSize; i++){
				        // Is it visible right now?        
				       
				         if (lastPosition >= matrix[i].start - wHeight && lastPosition <= matrix[i].stop){
				          	// Do something				
							
							var beginScroll = matrix[i].start - wHeight,
							endScroll = matrix[i].stop,
							scrollDistance = endScroll - beginScroll,				
							
							// How far through scrollDistance have we travelled?
							ratio = (lastPosition - beginScroll) / scrollDistance,
							
							// Apply ratio to parallax taking into account height of inner and outer
							parallax = matrix[i].offset * ratio,
							
							// offset so that inner finishes at the top of outer
							parallaxTop = -matrix[i].offset + parallax;
							
							// Few! Lets do it...
							setTop(matrix[i], parallaxTop)          
			                 
			        	} 
			        
				    }
				   
				    rhParallaxScroll(loop)
				    
			    }
					    
		    
		} // end loop

	}

}(jQuery));	

	
	
	
	
	


 
	

	


(function($){
	
	$.fn.rhLoadIn=function(options){
		
		var settings = $.extend({ 
				scrollThreshold:500,
				ajax:false
			},options);
				
		function offset(el) {
		    var rect = el.getBoundingClientRect();
		    
		    if (settings.ajax === false) {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			} else {
				var ajaxContainer = document.getElementById('ajaxContainer');
				scrollTop = ajaxContainer.scrollTop;
			}

		    return { top: rect.top + scrollTop }
		}

		var rhLoadInElements = document.querySelectorAll(".loadIn"), 
			rhLoadThrottleTimeout;
		
		loadInScroll();
		
		function loadInScroll() {
			
			rhLoadInElements = document.querySelectorAll(".loadIn"); 
	
			if(rhLoadThrottleTimeout) {
		      clearTimeout(rhLoadThrottleTimeout);
		    }		    
		    
		    rhLoadThrottleTimeout = setTimeout(function() {
			    
		    	if (settings.ajax === false) {
					var scrollTop = window.pageYOffset;
				} else {
					var ajaxContainer = document.getElementById('ajaxContainer');
					scrollTop = ajaxContainer.scrollTop;
				}
		      		        
		        rhLoadInElements.forEach(function(el) {

					var divOffset = offset(el);

		            if(divOffset.top < (window.innerHeight + scrollTop + settings.scrollThreshold)) {
		            	
					el.classList.add('isVisible');
					
					setTimeout(function(){ 
						el.classList.remove('loadIn');
					}, 600);
					
		            }
		        });
		        
		        if(rhLoadInElements.length == 0) { 
		          document.removeEventListener("scroll", loadInScroll);
		          window.removeEventListener("resize", loadInScroll);
		          window.removeEventListener("orientationChange", loadInScroll);
		        }
		        
		    }, 20);
	    
		}
 
		if (settings.ajax === false) {
			document.addEventListener("scroll", loadInScroll);
		} else {
			document.getElementById('ajaxContainer').addEventListener("scroll", loadInScroll);
		}
		window.addEventListener("resize", loadInScroll);
		window.addEventListener("orientationChange", loadInScroll);

	
}

}(jQuery));	






var $searchButton = $('#searchButton'),
    $searchWrapper = $('#searchWrapper'),
    $searchInner = $('#searchInner'),
    searchIsActive = false,
    searchOpen = new TimelineMax({}),
    searchClose = new TimelineMax({});


$searchButton.on('click', function(e){
	e.preventDefault();
	
	$searchButton.addClass('working');
	
	searchIsActive = !searchIsActive;

	if (searchIsActive) {
		opensearchAnimations();
	} else {
		closesearchAnimations();
	}
	
	setTimeout(function(){ 
		$searchButton.removeClass('working');
	}, 200);

});



$(document).on( 'submit', '#searchForm', function() {
    var $form = $(this);
    var $input = $form.find('input[name="s"]');
    var ajaxUrl = $form.attr('action');
    var query = $input.val(); 
    var $serpsWrapper = $('#serpsWrapper')
    
    $.ajax({
        type : 'post',
        url : ajaxUrl,
        data : {
            action : 'load_search_results',
            query : query
        },
        beforeSend: function() { 
            $input.prop('disabled', true);
            $serpsWrapper.addClass('loading').empty();
        },
        success : function( response ) {
            $input.prop('disabled', false);
            $serpsWrapper.removeClass('loading');
            $serpsWrapper.html( response );
        }
    });
    
    return false;
})


$(document).on('click','.searchCategoryButton', function(e) {
	
	e.preventDefault();
	
	$('.searchCategoryButton').removeClass('active');
	$(this).addClass('active');
	
	var type = $(this).data('type'); 
	
	if (type == 'all') {
		$('.searchResultsSection').show();
	} else {
		$('.searchResultsSection').hide();
		$('.searchResultsSection.' + type).show();
	}
		
});



//functions
function opensearchAnimations() {
	
	$body.addClass('stopScrolling');
	$searchButton.addClass('active');
	
	if (width > 600) {
		searchOpen.to($searchWrapper, 0.3, { xPercent:-100 })
			.fromTo($searchInner, 0.3, { xPercent:100 }, { xPercent:0 }, '-=0.1')
		;
	} else {
		searchOpen.to($searchWrapper, 0.3, { xPercent:-100 });
	}
	

	
}

function closesearchAnimations() {

	$searchButton.removeClass('active');
	$body.removeClass('stopScrolling');
	
	if (width > 600) {
		searchClose.fromTo($searchInner, 0.3, { xPercent:0 }, { xPercent:100 })
			.to($searchWrapper, 0.3, { xPercent:0 }, '-=0.2')
		;
	} else {
		searchClose.fromTo($searchWrapper, 0.3, { xPercent:-100 }, { xPercent:0 });
	}
	
	
	
	
}


var $menuButton = $('#menuButton'),
	$menuX = $menuButton.find('.x'),
	$menuY = $menuButton.find('.y'),
    $menuWrapper = $('#menuWrapper'),
    $menuInner = $('#menuInner'),
    $menuBG = $('#menuBG'),
    navIsActive = false,
    navOpen = gsap.timeline({paused:true}),
    navClose = gsap.timeline({paused:true}),
    st,
    $headerLogo = $('#headerLogo'),
    $headerLogoMobile = $('#headerLogoMobile');
  //  $footerWrapper = $('#footerWrapper'),
 //   $footerBG = $('#footerBG');

	

  var mql = window.matchMedia('(max-width: 600px)');

  function screenTest(e) {
    if (e.matches) {
      /* the viewport is 600 pixels wide or less */
      
      	navOpen.to( $menuX, 0.1, { y: '4px' })
			.to( $menuY, 0.1, { y: '-4px' }, '-=0.1')
			.to( $menuX, 0.1, { rotation: 45 }, '+=0.2')
			.to($menuY, 0.1, {rotation: -45}, '-=0.1')
			.to($menuWrapper, 0.3, { xPercent:-100, ease:"power1.easeInOut" }, '-=0.3')
			//.fromTo($menuInner, 0.3, { xPercent:100 }, { xPercent:0, ease:"power1.easeInOut" }, '-=0.3')
			.to($searchButton, 0.3, { autoAlpha:0 }, '-=0.2')
		;
		
		navClose.to($menuWrapper, 0.3, { xPercent:0, ease:"power1.easeInOut" })
			.to( $menuX, 0.1, { rotation:0 }, '-=0.3')
			.to($menuY, 0.1, {rotation: 0}, '-=0.3')
			.to( $menuX, 0.1, { y: '0' }, '-=0.1')
			.to( $menuY, 0.1, { y: '0' }, '-=0.1')
			.to($searchButton, 0.1, { autoAlpha:1 })
			//.fromTo($menuInner, 0.3, { xPercent:0 }, { xPercent:100, ease:"power1.easeInOut" }, '-=0.3')
			
		;

    } else {
      /* the viewport is more than than 600 pixels wide */
      
      	navOpen.to( $menuX, 0.1, { y: '4px' })
			.to( $menuY, 0.1, { y: '-4px' }, '-=0.1')
			.to( $menuX, 0.1, { rotation: 45 }, '+=0.2')
			.to($menuY, 0.1, {rotation: -45}, '-=0.1')
			.to($menuWrapper, 0.3, { xPercent:-100, ease:"power1.easeInOut" }, '-=0.3')
			.fromTo($menuInner, 0.3, { xPercent:100 }, { xPercent:0, ease:"power1.easeInOut" }, '-=0.2')
			.to($searchButton, 0.3, { autoAlpha:0 }, '-=0.2')
			.to($menuBG, 140, { xPercent:-33 }, '-=0.1')
		;
		
		navClose.to( $menuX, 0.1, { rotation:0 })
			.to($menuY, 0.1, {rotation: 0}, '-=0.1')
			.to( $menuX, 0.1, { y: '0' }, '+=0.2')
			.to( $menuY, 0.1, { y: '0' }, '-=0.1')
			.to($searchButton, 0.1, { autoAlpha:1 })
			.fromTo($menuInner, 0.3, { xPercent:0 }, { xPercent:100, ease:"power1.easeInOut" }, '-=0.3')
			.to($menuWrapper, 0.3, { xPercent:0, ease:"power1.easeInOut" }, '-=0.2')
			.to($menuBG, 0.1, { xPercent:0}, '-=0.1')
		;

    }
  }
  screenTest(mql)
  mql.addListener(screenTest);




	
	
	

/*
	if ($footerWrapper.length > 0) {
		// $(window).on('scroll',footerScroll);
	}
*/

if($headerLogo.length > 0) {
     var $thinkingSingleLogo = $('#thinkingSingleLogo');
     $(window).on('scroll',headerScroll);
}


function headerScroll() { 
	st = $(this).scrollTop(); 
	
	if (st > 50) {
		TweenMax.to($headerLogo, 0.4, { autoAlpha:0 });
		if($thinkingSingleLogo.length > 0) {
			TweenMax.to($thinkingSingleLogo, 0.4, { autoAlpha:0 });
		}
	} else {
		TweenMax.to($headerLogo, 0.4, { autoAlpha:1 });
		if($thinkingSingleLogo.length > 0) {
			TweenMax.to($thinkingSingleLogo, 0.4, { autoAlpha:1 });
		}
	}

}


if ($headerLogoMobile.length > 0 ) {
     $(window).on('scroll',headerMobilecroll);
}
function headerMobilecroll() { 
	st = $(this).scrollTop(); 
	
	if ( (width < 600) && (st > 50)) {
		TweenMax.to($headerLogoMobile, 0.4, { autoAlpha:0 });
	} else {
		TweenMax.to($headerLogoMobile, 0.4, { autoAlpha:1 });
	}

}



/*
function footerScroll() {
	st = $(this).scrollTop();
	
	var footerTop = $footerWrapper.offset().top,
		footerTriggerPoint = footerTop - height,
		footerFadeOffest = Math.round(st - footerTriggerPoint),
		footerHeight = $footerWrapper.outerHeight();
	
	if (st > footerTriggerPoint) {
		var footerRatio =  footerFadeOffest / footerHeight;
		footerRatio = footerRatio.toFixed(2);
		//console.log(footerRatio);
		$footerBG.css({'opacity':footerRatio});	
	} else {
		//console.log('n');	
		$footerBG.css({'opacity':'0'});	
	}
	
	
}
*/


$menuButton.on('click', function(e){
	e.preventDefault();
	
	$menuButton.addClass('working');
	
	navIsActive = !navIsActive;

	if (navIsActive) { //console.log('open');
		openMenuAnimations();
	} else { // console.log('close');
		closeMenuAnimations();
		if (searchIsActive) {
               closesearchAnimations();
               searchIsActive = !searchIsActive;
		}		
	}
	
	setTimeout(function(){ 
		$menuButton.removeClass('working');
	}, 200);

});

//functions
function openMenuAnimations() {
	
	$body.addClass('stopScrolling');
	$menuButton.addClass('active');

	navClose.pause();

	navOpen.restart();

}

function closeMenuAnimations() {

	$menuButton.removeClass('active');
	$body.removeClass('stopScrolling');
	
	navOpen.pause();
	
	navClose.restart();
	
}


// $menuWrapper.on('click', 'a', function(e){
//      closeMenuAnimations();
// });


	var $splashWrapper = $('#splashWrapper');
	if($splashWrapper.length > 0) {
		
		var splash = new TimelineMax({}),
			$splashLoader = $('#splashLoader'),
			$homepageAnimate = $('.homepageAnimate');
		
		splash.to( $splashLoader, 3.5, { width:"100%" })
			.to( $splashWrapper, 0.4, { yPercent:-100, ease:Power1.easeInOut});
			
			splash.eventCallback("onComplete", function() {
				TweenMax.staggerTo($homepageAnimate, 0.2, {autoAlpha: 1}, 0.1);
				
				TweenMax.to($notificationWrapper, 0.4, {xPercent:-100, ease:Power3.easeInOut});
				
				//$splashWrapper.remove();
			});
		
	}


	var $homepageScrollButton = $('#homepageScrollButton');
	if($homepageScrollButton.length > 0) {
		$homepageScrollButton.on('click', function(e){
			e.preventDefault();
			$(window).scrollTo(height, 768, {axis:'y'} );
		});
	}
	
	
	var $notificationWrapper = $('#notificationWrapper'),
		$closeNotification = $('#closeNotification');
		
		if ($notificationWrapper.length > 0) {
			
			$closeNotification.on('click', function(e){
				e.preventDefault();
				
				TweenMax.to($notificationWrapper, 0.3, {autoAlpha: 0});
	
				setTimeout(function(){ 
					$notificationWrapper.remove();
				}, 500);
	
			});
	
		}
				
		
	var $homepageNewsCarousel = $('#homepageNewsCarousel');
	$homepageNewsCarousel.flickity({
		wrapAround: true,	 
		autoPlay: false,
		pageDots: false,
		prevNextButtons: false,
		cellSelector: '.newsSlide',
		cellAlign: 'left',
		lazyLoad: true,
		groupCells:1,
		setGallerySize:true,
		imagesLoaded: true
	});
	
/*
	$homepageNewsCarousel.on( 'staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
		if ( !cellElement ) {
			return;
		}
		$homepageNewsCarousel.flickity( 'select', cellIndex );
	});
*/
	
	
	
	
	
	
	var homepageSectionWrapper = document.getElementById('homepageSectionWrapper');

	if (homepageSectionWrapper) {
		
 		var $homepageIndexLink = $('#homepageIndexWrapper').find('.homepageIndexLink'),
	 		homepageIndexID,
	 		homepageIndexActive = true;

		$homepageIndexLink.on('click', function(e){
			e.preventDefault();
			
			homepageIndexID = $(this).data('id'); 		
			if (width > 768) {
				$(window).scrollTo((homepageMatrix[homepageIndexID].start + (0.2 * height)), 768, {axis:'y'} );
			} else {
				//$(window).scrollTo(homepageMatrix[homepageIndexID].start, 768, {axis:'y'} );
				$(window).scrollTo($('#homeSection' + homepageIndexID), 768, {axis:'y'} );
			}
			
		});
		
/*
		if (width <= 768) {
			$homepageSection.css({"margin-top":"400px"});
		}
*/
		
		var $homepageCardsWrapper = $('.homepageCardsWrapper');
		
		$homepageCardsWrapper.each( function( i, container ) {
		
			var $container = $(container),
			$homepageCardsnav = $container.find('.homepageCardsnav');
			
			var $homeCarousel = $container.flickity({
				wrapAround: false,	 
				autoPlay: false,
				pageDots: false,
				prevNextButtons: false,
				setGallerySize: true,
				cellSelector: '.card',
				cellAlign: 'left',
				lazyLoad: 3,
				imagesLoaded:true,
				adaptiveHeight:false,
				watchCSS: true
			});
			
			$homepageCardsnav.on('click', function(e) {
				e.preventDefault();	
				$homeCarousel.flickity('next');
			});
			
		});
		
		var tapArea, startX ;
	        tapArea = document.querySelectorAll('.homepageCardsnav');
	        startX = 0;
	        for (var item of tapArea) {
	            item.ontouchstart = function(e) {
	                startX = e.touches[0].clientX;
	            };
	            item.ontouchmove = function(e) {
	                if (Math.abs(e.touches[0].clientX - startX) > 5 && e.cancelable ) {
	                    e.preventDefault();
	                }
	            };
	        }
		
	 	var wHeight = window.innerHeight,
	 		lastPosition = 0,
	 		homepageElements = document.getElementsByClassName("homepageSection"),
	 		homepageSectionSize = homepageElements.length,
	 		homepageMatrix = [],
	 		i = 0,
	 		doit;
	 		
	 		homepageSizes();
	 		window.onresize = function(){
				clearTimeout(doit);
				doit = setTimeout(resizedw, 100);
			};	

			var homepageSectionWrapperHeight = $('#homepageSectionWrapper').outerHeight(true);
			$(window).on('scroll',homepageScroll);
					
	}
	
	
	
	function resizedw(){ 
	    homepageMatrix = [];		   
		homepageSizes();				
	}
	
	
	function homepageSizes(){
	
		for (i =0; i<homepageSectionSize; i++){
		
			// Get the element
			homepageMatrix[i] = homepageMatrix[i] || { el: homepageElements[i] }
			
			// get height 
			if (width > 768) {
			homepageMatrix[i].height = homepageMatrix[i].el.offsetHeight;
			} else {
				if (i == 0) {
					homepageMatrix[i].height = homepageMatrix[i].el.offsetHeight + height; // needs to be 400 for all but the first
				} else {
					homepageMatrix[i].height = homepageMatrix[i].el.offsetHeight + 400; // needs to be 400 for all but the first
				}
				
			}
			
			// start position is either 0 or last elements stop position
			if (width > 768) {
				homepageMatrix[i].start = homepageMatrix[i-1] ? homepageMatrix[i-1].stop : 0; 
			} else {
				homepageMatrix[i].start = homepageMatrix[i-1] ? homepageMatrix[i-1].stop : height; 
			}
	        
	        // stop position is either the last elements stop + this height, or just this height	
	        if (width > 768) {
				homepageMatrix[i].stop = homepageMatrix[i-1] ? homepageMatrix[i-1].stop + homepageMatrix[i].height : homepageMatrix[i].height; 	   
	        } else {
		        // 400 is the height of the index links
				homepageMatrix[i].stop = homepageMatrix[i-1] ? homepageMatrix[i-1].stop + homepageMatrix[i].height : homepageMatrix[i].height + 400; 	   
			}
			
	        // Get the margin     
	        homepageMatrix[i].margin = homepageMatrix[i-1] ? homepageMatrix[i-1].stop : 0;
	        
	        // force each section on top of previous
	        homepageMatrix[i].el.style.zIndex = (i+1) * 10; 
					
		}	
		
		//console.log(homepageMatrix);	
		
		// Set the height of the wrapper so there is no jump when elements switch to fixed position
		//homepageSectionWrapper.style.height = (homepageMatrix[i-1].stop ) + "px";

	}
	
	
	function homepageScroll(){
		
		lastPosition = $(this).scrollTop(); 

		var i = 0;
		for (i =0; i<homepageSectionSize; i++){
		
			if (width > 768) {
				 					
				if (
					(lastPosition >= (homepageMatrix[i].start)) && 
			        (lastPosition < (homepageMatrix[i].stop))
				) {
					homepageMatrix[i].el.classList.add("active");
					$homepageIndexLink.eq(i).addClass('active');
				} else {
					homepageMatrix[i].el.classList.remove("active");
					$homepageIndexLink.eq(i).removeClass('active');
				}
				
				if (lastPosition >= (homepageMatrix[i].start + (0.2 * wHeight))) {
					homepageMatrix[i].el.classList.add("loadAnimation");
				}
				
			} else {
				
				if (
					(lastPosition >= (homepageMatrix[i].start - wHeight)) && 
			        (lastPosition < (homepageMatrix[i].stop - wHeight))
				) {
					homepageMatrix[i].el.classList.add("active");
					$homepageIndexLink.eq(i).addClass('active');
				} else {
					homepageMatrix[i].el.classList.remove("active");
					$homepageIndexLink.eq(i).removeClass('active');
				}
				
				if (lastPosition >= (homepageMatrix[i].start + (0.2 * wHeight))) {
					homepageMatrix[i].el.classList.add("loadAnimation");
				}
				
			}
				
		}
		
		if (lastPosition > 50) {
			TweenMax.to($homepageScrollButton, 0.3, {autoAlpha:0});
			if ($notificationWrapper.length > 0) {
				TweenMax.to($notificationWrapper, 0.3, {autoAlpha:0});
			}
		} else {
			TweenMax.to($homepageScrollButton, 0.3, {autoAlpha:1});
			if ($notificationWrapper.length > 0) {
				TweenMax.to($notificationWrapper, 0.3, {autoAlpha:1});
			}
		}
	
		if ((lastPosition + wHeight) > homepageSectionWrapperHeight) { 
				
			if (homepageIndexActive) {
				homepageIndexActive = !homepageIndexActive;
				TweenMax.staggerTo($homepageAnimate, 0.3, {autoAlpha:0}, -0.06);
			}
							
		} else {
			
			if (!homepageIndexActive) {
				homepageIndexActive = !homepageIndexActive;
				TweenMax.staggerTo($homepageAnimate, 0.3, {autoAlpha:1}, -0.06);
			}
			
		}
	
	}

 




var $peopleCards = $('.peopleCard');

if ($peopleCards.length > 0) {
			
	var $peopleAjaxContainer = $('#peopleAjaxContainer'),
		$closePeopleAjaxButton = $('#closePeopleAjaxButton'),
		peopleAjaxOpen = false,
		originalHref,
		peopleAjaxHref,
// 		$ajaxHolder = $('#ajaxHolder'),
		$peopleLoading = $('#peopleLoading');
		
	
	$peopleAjaxContainer.on('scroll',peopleScroll);

	$('#ajaxContainer').rhLoadIn({
		ajax:true
	});

	$('#ajaxContainer').rhLazy({
		ajax:true
	});

	
	$(document).on("click", '.peopleCard', function(e) {
	    e.preventDefault();
		
		$peopleCards.removeClass('active');
		$(this).addClass('active');
		
		TweenMax.to($peopleLoading, 0.4, { autoAlpha:1 });

	  	peopleAjaxHref = $(this).attr('href');

	    if (peopleAjaxOpen == false) {

			peopleAjaxOpen = true;

			originalHref = window.location.href;
			
			$peopleAjaxContainer.addClass('active');
			openPeopleAjax(peopleAjaxHref);
			
			TweenMax.to($closePeopleAjaxButton, 0.4, { autoAlpha:1 });

	    } else { 
			
			emptyPeopleAjax();
			
			setTimeout(function(){ 
				openPeopleAjax(peopleAjaxHref);
			}, 500);

		}

	    history.pushState({}, '', peopleAjaxHref);

	});
	
	//close ajax
	$closePeopleAjaxButton.on('click', function(e) {
	    e.preventDefault();

		$peopleCards.removeClass('active');
	    peopleAjaxOpen = false;

	  	//TweenMax.to($peopleAjaxContainer, 0.4, {xPercent:0, ease:Power4.easeInOut,onComplete: emptyPeopleAjax});
	  	$peopleAjaxContainer.removeClass('active');
	  	
		TweenMax.to($closePeopleAjaxButton, 0.4, { autoAlpha:0 });
		
		setTimeout(function(){ 
			emptyPeopleAjax();
		}, 400);

	  	history.pushState({}, '', originalHref);
	});
	

}



function openPeopleAjax(peopleAjaxHref) {

	$ajaxHolder.load(peopleAjaxHref + " #ajaxTarget", function() {

		TweenMax.to($peopleLoading, 0.4, { autoAlpha:0 });
		
		TweenMax.to($ajaxHolder, 0.4, { autoAlpha:1 });

		$peopleAjaxContainer.imagesLoaded(function(){
			
			$('#peopleAjaxContainer').rhLoadIn({
				ajax:true
			});
			
			$('#peopleAjaxContainer').rhLazy({
				ajax:true
			});
			
		});

	});

}

function emptyPeopleAjax() {
	
	TweenMax.to($ajaxHolder, 0.4, { autoAlpha:0 });
	
	setTimeout(function(){ 
		$ajaxHolder.empty();
	}, 400);
	
}




function peopleScroll() { 
	var peopleST = $peopleAjaxContainer.scrollTop(); 
	
	if (peopleST > 50) {
		TweenMax.to($headerLogo, 0.4, { autoAlpha:0 });
			} else {
		TweenMax.to($headerLogo, 0.4, { autoAlpha:1 });
		
	}

}


/*

function initPeople() {
	
	TweenMax.set('.blob', {
	    xPercent: -50,
	    yPercent: -50
	})

	for(i = 0; i < peopleCards.length; i++){
	
	    peopleCards[i].addEventListener('mousemove', onMouseMove);
	    peopleCards[i].addEventListener('mouseleave', onMouseLeave);
	    
		var rect = peopleCards[i].getBoundingClientRect(); 
	    var center = {
	        w: Math.round((rect.width - 16) * 0.5),
	        h: Math.round(rect.height * 0.5)
	    }
	    var peopleCursor = peopleCards[i].querySelector('.blob');
	    TweenMax.set( peopleCursor, {
	        x: center.w,
	        y: center.h,
	        ease: Back.easeOut.config(1.4)
	    } );
		    
	}

}


function onMouseMove(e) {
   var peopleCursor = this.querySelector('.blob');    
    TweenMax.to(peopleCursor, 0.8, {
        x: e.offsetX,
        y: e.offsetY,
        opacity:1,
        ease:Power4.easeOut
    })
}


function onMouseLeave() {
/*
    var rect = this.getBoundingClientRect();
    var center = {
        w: Math.round((rect.width - 16) * 0.5),
        h: Math.round(rect.height * 0.5)
    }

    var peopleCursor = this.querySelector('.blob');
    
    TweenMax.to( peopleCursor,2, {
        opacity:0,
        ease: Back.easeOut.config(1.4)
    });
}
*/



/* ========================================================================== 
  VIDEO PLAY Widgets
  ========================================================================== */	

/*
      
   var ytVideoEmbeds = document.getElementsByClassName('videoEmbedYoutube'); 



  if (ytVideoEmbeds) {
  		
	  	var tag = document.createElement('script');
	    tag.src = "https://www.youtube.com/iframe_api";
	    var firstScriptTag = document.getElementsByTagName('script')[0];
	    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
		var players = new Array();
	    var YT;
	    var playerReady = false;
    
		function onYouTubeIframeAPIReady() { 
		    for (var i = 0; i < ytVideoEmbeds.length; i++) {
		        var curplayer = createPlayer(ytVideoEmbeds[i]);
				 players[i] = curplayer;
		    }
	    }
	    
	    function createPlayer(videoWrapper) { 
		    return new YT.Player(videoWrapper, {
		        height: videoWrapper.height,
		        width: videoWrapper.width,
		        videoId: videoWrapper.dataset.src,
		        playerVars: { 'autoplay': 0, 'controls': 1,'autohide':1,'origin':'window.location' }
		    });
		}
	    
	    function onPlayerReady(event) {
	        playerReady = true;
	    }
	    
	    function onPlayerStateChange(event) {
	        if (event.data == YT.PlayerState.ENDED) {  }
	    }
	  
	  
	  	$(document).on("click", '.videoPlayButton', function(e) {
			e.preventDefault(); 
			
			var videoType = $(this).data('type'); 
			var $videoEmbed = $(this).parent().find('.vimeoEmbed');
					
			if (videoType == 'vimeo') {
				var vimeoPlayer = new Vimeo.Player($videoEmbed);
			    vimeoPlayer.setVolume(1);
			    vimeoPlayer.play();
			} else {
				var player = $videoEmbed.data('player') - 1;
				players[player].playVideo();
			}
		   		
			$videoEmbed.fadeIn();
			
		});
	
}
	
	
*/
	
	
	
/* ========================================================================== 
  HTML5 VIDEO PLAY
  ========================================================================== */	
/*


var videoElems = document.getElementsByClassName('inlineVideo');
	
	if (videoElems.length > 0) {
		inlineVideo();
	}
	
	function inlineVideo() {
		
		for(i = 0; i < videoElems.length; i++){ 
						
			videoElems[i].addEventListener('canplay', videoReady);
			
			var videoElement = videoElems[i]; 
			
			if (videoElement.readyState > 3) { 
				videoElems[i].classList.add('ready');
			}

		}
		
	}
		
	function videoReady(){
		this.classList.add('ready');
	}
	
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazyVideo"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }
          video.target.load();
          video.target.classList.remove("lazyVideo");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    }, {rootMargin: "0px 0px 500px 0px"});

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
*/




	
	
	var $projectFilterWrapper = $('#projectFilterWrapper'),
		projectFilterOpen = false,
		$projectFilterButton = $('.projectFilterButton'),
		$projectFilterCloseButtion = $projectFilterWrapper.find('.projectFilterCloseButtion');

	
	if ($projectFilterButton.length > 0) {
		 		
		$projectFilterCloseButtion.on('click', function(e){
			e.preventDefault();
			projectFilterOpen = false;
			TweenMax.to($projectFilterWrapper, 0.4, { yPercent:0, ease:Power1.easeInOut });
			$body.removeClass('stopScrolling');
		});
		
		$projectFilterButton.on('click', function(e){
			e.preventDefault();
			
			if (device != 'desktop') {
				$body.addClass('stopScrolling');
			}
			projectFilterOpen = true;
			TweenMax.to($projectFilterWrapper, 0.4, { yPercent:100, ease:Power1.easeInOut });
		});
		
		if (device == 'desktop') {
			$(window).scroll(function(){
			
				if (projectFilterOpen) {
					projectFilterOpen = false;
					TweenMax.to($projectFilterWrapper, 0.4, { yPercent:0, ease:Power1.easeInOut });
				}
				
			});
		}

		
	} 
		
	var $projectFeaturedImage = $('#projectFeaturedImage');

	if ($projectFeaturedImage.length > 0) {
		
		// everything needs to be wrapped in a function so that it can be re-fired on ajax load
		projectsPageInit();
		
	}
	
		
	var $relatedProjects = $('#relatedProjects');
	if ($relatedProjects.length > 0) {
		relatedProjectsSlideshow();
	}
		
	
		
	

	
	
	
	
	

function projectsPageInit() {
	
	var $projectFeaturedImage = $('#projectFeaturedImage'),
		$projectTitleWrapper = $('#projectTitleWrapper'),
		projectTitleheight = $projectTitleWrapper.outerHeight(),
		$projectScrollButton = $('#projectScrollButton'),
		$projectShowMoreButton = $('#projectShowMoreButton');
		
		$projectFeaturedImage.imagesLoaded({},function(){
			$projectFeaturedImage.animate({"opacity":"1"}, 500);
		});
				
		//console.log($projectFeaturedImage);
		
		
		
		if (ajaxOpen) {
			if (width > 600) {
				$ajaxContainer.scrollTo( projectTitleheight + 'px', 600, {axis:'y'} );
			}
			$ajaxContainer.on('scroll',projectScroll);	
		} else {
			if (width > 600) {
				$(window).scrollTo( projectTitleheight + 'px', 600, {axis:'y'} );
			}
			$(window).on('scroll',projectScroll);
		}
		
		
		
		
		
		$projectScrollButton.on('click', function(e){
			e.preventDefault();
			$(window).scrollTo(height, 600, {axis:'y'} );
			if (ajaxOpen) {
				$ajaxContainer.scrollTo( height, 600, {axis:'y'} );
			} else {
				$(window).scrollTo( height, 600, {axis:'y'} );
			}
		});
		
		$projectShowMoreButton.on('click', function(e){
			e.preventDefault();
			
			$(this).hide();
			$(this).next('.mobToggle').show();
		});
		
		
		
		   

		var $panoramaWrapper = $('.panoramaWrapper'); 
		
		if ($panoramaWrapper.length > 0) {
					
			$panoramaWrapper.each(function() {
				
				var $panoramaImage = $(this).find('.panoramaImage'),
				panoramaImageHeight = $panoramaImage.height(),
				panoramaImageRatio = $panoramaImage.data('ratio'),
				panoramaImageWidth = panoramaImageHeight * panoramaImageRatio,
				panoramaOffset = width - panoramaImageWidth;
				
				$(this).find('img').draggable({ 
				    drag: function(event, ui) { 
				    								
						if (ui.position.left > 0) {
							ui.position.left = 0;
						}
						
						if (ui.position.left < panoramaOffset) {
							ui.position.left = panoramaOffset;
						}
				         
				      },
				    axis: "x",
				    scroll: true 
				});
				
			});
			
		}
		
		

							
				


			
		
	

}




function relatedProjectsSlideshow() {
		
		var $relatedSlideshow = $('#relatedProjects').flickity({
			wrapAround: false,	 
			autoPlay: false,
			pageDots: false,
			prevNextButtons: false,
			setGallerySize: true,
			cellSelector: '.card',
			cellAlign: 'left',
			lazyLoad: 2,
			imagesLoaded: true ,
			adaptiveHeight: false,
			watchCSS: true
		});
		
		
		
		var $relatedNextButton = $('#relatedNextButton');
			
			$relatedNextButton.on('click', function(e) {
				e.preventDefault();	
				$relatedSlideshow.flickity('next');
				$relatedSlideshow.flickity('stopPlayer');
			});

	}



function projectScroll() {

	var projectImageOffset = $(this).scrollTop() / 2;	
	
	$('#projectFeaturedImage').css({ 'transform' : 'translateY(' + projectImageOffset + 'px)' });
	
	if ($(this).scrollTop() > 200) {
		TweenMax.to($('#projectScrollButton'), 0.4, { autoAlpha:0 });
	} else {
		TweenMax.to($('#projectScrollButton'), 0.4, { autoAlpha:1 });
	}
	
}

/*
function projectScrollAjax() {
	
	projectImageOffset = st / 2;	
	
	$projectFeaturedImage.css({ 'transform' : 'translateY(' + projectImageOffset + 'px)' });
	
}
*/





/* ==========================================================================
  Ajax
	-----------------------------------------------
	- open class for elements = .ajaxOpen
	- target ajax item(s) = '#ajaxTarget'
	- scroll on .ajaxContainer (overflow: hidden)
	- call loadIn on #ajaxContainer
	
	- 	$(‘#ajaxContainer’).rhLoadIn({
       		ajax:true
		})
    
    - 	$('.parallax').rhParallax({
			parallaxRatio:1.4,
			ajax:true,
			selector:'#ajaxContainer'
		});
  ========================================================================== */

var $ajaxContainer = $('#ajaxContainer'),
     $ajaxHolder = $('#ajaxHolder'),
     $closeAjaxButton = $('#closeAjaxButton'),
     ajaxOpen = false,
     ajaxHref,
     $loader = $('#loader'),
     ajaxType = '',
     $newsSingleNavHolder = $('#newsSingleNavHolder');

	//ajax for cards
	$(document).on("click", '.ajaxOpen', function(e) {
	    e.preventDefault();
		
		ajaxType = $(this).data('type');
          ajaxHref = $(this).attr('href');
          
	     $loader.show();

	     if (ajaxOpen == false) {

               ajaxOpen = true;
               originalHref = window.location.href;
               $body.addClass("stopScrolling");

               if (ajaxType == "news") {

                    var newsTitle = $(this).data("title"),
                         newsDate = $(this).data("date"),
                         newsImage = $(this).data("image"),
                         newsCaption = $(this).data("caption");

                         $("#newsTitle").text(newsTitle);
                         $("#newsDate").text(newsDate);
                         $("#mobileNewsFeaturedImage").attr("src", newsImage);
                         $("#mobileNewsAnnotation").text(newsCaption);

                         $newsSingleNavHolder.load(ajaxHref + " #newsSingleNav", function () {
                              $newsSingleNavHolder.fadeIn();
                         });

               }

               TweenMax.to($ajaxContainer, 0.4, {
                    display: "block",
                    autoAlpha: 1,
                    top: "0",
                    ease: Power4.easeInOut,
                    onComplete: openAjax,
                    onCompleteParams: [ajaxHref]
               });

               TweenMax.to($closeAjaxButton, 0.3, {
                    display: "block",
                    autoAlpha: 1,
                    ease: Power4.easeInOut,
                    delay: 1
               });
               
          }

	    history.pushState({}, '', ajaxHref);

	});


	//close ajax
	$closeAjaxButton.on("click", function (e) {
          e.preventDefault();
          closeAjax();
          history.pushState({}, '', originalHref);
     });
	
     var $newsOverlayBG = $('#newsOverlayBG');
     if ($newsOverlayBG.length > 0) {
          $newsOverlayBG.on('click', function(e) {
               e.preventDefault();
               closeAjax();
          });
     }

	// ESCAPE KEY
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			
			if (ajaxOpen == true ) {
	
				if (insightActive) { 
                         closeInsight();
				} else {
                         closeAjax();
                         history.pushState({}, '', originalHref);
				}
	
			} else if (insightActive) {
                    closeInsight();					
			} 	
			
		}
    });

	

	//history pop state
	window.onpopstate = function() { 

		if (ajaxOpen == true ) {
	
               if (insightActive) { 
                    closeInsight();
                    history.pushState({}, '', ajaxHref);
               } else {

                    if (quoteInsightActive) {
                         quoteInsightActive = !quoteInsightActive;
                         quoteClose.fromTo($quoteOverlayClose, 0.3, { xPercent:-100 }, { xPercent:0, ease:Power1.easeInOut })
                              .to($quoteAjaxWrapper, 0.3, {xPercent:0, ease:Power1.easeInOut },'-=0.3')
                              .to($headerWrapper, 0.1, { autoAlpha:1 },'-=0.05')
                              .to($closeAjaxButton, 0.1, { autoAlpha:1 }, '-=0.1')
                              .to($sideNavWrapper, 0.1, { autoAlpha:1 }, '-=0.1')
                         ;
                    }
                    closeAjax();
                    history.pushState({}, '', originalHref);
               }

          } else if (insightActive) {
               closeInsight();					
          } else {
               window.location.href = window.location.href;
          }	

     };

	


function openAjax(ajaxHref) {

	$ajaxHolder.load(ajaxHref + " #ajaxTarget", function() {

		$loader.fadeOut();

		$ajaxContainer.imagesLoaded(function(){
			
			$('#ajaxContainer').rhLoadIn({
				ajax:true
			});
			
			$('#ajaxContainer').rhLazy({
				ajax:true
			});
			
			projectsPageInit();
			//galleryInit();
			
			var $slideshowWidget = $('.slideshowWidget');
			if ($slideshowWidget.length > 0) {
				slideshowInit();
			}
			
			ytVideoEmbeds = document.getElementsByClassName('videoEmbedYoutube');
			if (ytVideoEmbeds.length>0) {
				for (var i = 0; i < ytVideoEmbeds.length; i++) { 
			        var curplayer = createPlayer(ytVideoEmbeds[i]); 
					 inlinePlayers[i] = curplayer;  
			    }
			}
			
			var $thinkingSingleLogo = $('#thinkingSingleLogo');
			if ($thinkingSingleLogo.length > 0) { 
				$ajaxContainer.on('scroll',scrollAjax);
			}
			
			var $openInsight = $('.openInsight');
               if ($openInsight.length > 0) { 
                    var insightCloseAnimation = new TimelineMax({});
                    insightsInit();		
			}
			
			var $openQuoteInsight = $('.openQuoteInsight');
			if ($openQuoteInsight.length > 0) {
				quoteInsightsInit();
			}
			
			var $relatedProjects = $('#relatedProjects');
			if ($relatedProjects.length > 0) {
				relatedProjectsSlideshow();
               }
               
               var $relatedArticleSlideshow = $('.relatedArticleSlideshow');
               if ($relatedArticleSlideshow.length > 0) {
                    relatedArticleSlideshowInit();
               }
			
			TweenMax.to($ajaxHolder, 0.4, { autoAlpha:1 });
			TweenMax.to($thinkingLoading, 0.4, { autoAlpha:0 });
			
		});

	});
	
}


function scrollAjax() {
	var ajaxSt = $ajaxContainer.scrollTop();

	if (ajaxSt > 50) {
		TweenMax.to($('#thinkingSingleLogo'), 0.4, { autoAlpha:0 });
	} else {
		TweenMax.to($('#thinkingSingleLogo'), 0.4, { autoAlpha:1 });
	}
}

function closeAjax() {
		ajaxOpen = false;
	
		$body.removeClass('stopScrolling');

		if (ajaxType == 'news') {
	 		$newsSingleNavHolder.fadeOut();
		} 

		TweenMax.to($ajaxContainer, 0.4, {display: 'none', autoAlpha:0, top:'100%', ease:Power4.easeInOut,onComplete: emptyAjax});
		TweenMax.to($closeAjaxButton, 0.3, {'display':'none', autoAlpha:0, ease:Power4.easeInOut});
}


function emptyAjax() {
	TweenMax.to($thinkingLoading, 0.4, { autoAlpha:1 });
	$ajaxHolder.empty();
}




var $videoOverlay = $('#videoOverlay'),
    $videoOverlayClose = $('#videoOverlayClose'),
    videoID,
	fullScreenPlayer,
	inlinePlayers = new Array(),
	YT,
// 	$playInlineVideo = $('.playInlineVideo'),
	ytVideoEmbeds = document.getElementsByClassName('videoEmbedYoutube');
				
		//get the last video id so the player has something to get
		//videoID = $playVideo.data('id'); 

		var tag = document.createElement('script');
	    tag.src = "../www.youtube.com/iframe_api";
	    var firstScriptTag = document.getElementsByTagName('script')[0];
	    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		function onYouTubeIframeAPIReady() { 
			
/*
			if (videoID) { console.log('init video overlay player');
				fullScreenPlayer = new YT.Player('player', {
					height: '390',
					width: '640',
					videoId: videoID, // this will change when user clickers button
				    host: 'https://www.youtube-nocookie.com',
					playerVars: { 'autoplay':0, 'controls':1,'autohide':1,'origin':'window.location', 'playsinline':1,'modestbranding':1 }
				});
			}
*/
			var player = document.getElementById('player');
			if (player) {
				fullScreenPlayer = createPlayer(player);
			}
				
			if (ytVideoEmbeds.length>0) { 

				for (var i = 0; i < ytVideoEmbeds.length; i++) { 
			        var curplayer = createPlayer(ytVideoEmbeds[i]); 
					inlinePlayers[i] = curplayer; 
			    }
			    
			}
			
		}
		
		
		
		function createPlayer(videoWrapper) {   
		    return new YT.Player(videoWrapper, {
		        height: videoWrapper.height,
		        width: videoWrapper.width,
		        videoId: videoWrapper.dataset.src,
		        playerVars: { 'autoplay':0, 'controls': 1,'autohide':1,'origin':'window.location' }
		    });
		    			    

		}

		
		$body.on('click', '.playVideo', function(e){ 
			e.preventDefault();
			
			$body.addClass('stopScrolling');
			
			videoID = $(this).data('id'); 
			fullScreenPlayer.loadVideoById(videoID, 0, "default");
			
			TweenMax.to( $videoOverlay, 0.3, { autoAlpha:1 });
		
		});
		
		$videoOverlayClose.on('click', function(e){
		    e.preventDefault();
		    
			$body.removeClass('stopScrolling');
		    
			TweenMax.to( $videoOverlay, 0.3, { autoAlpha:0 });
		    
			fullScreenPlayer.pauseVideo();

		});
		
			
		$body.on('click', '.playInlineVideo', function(e){ 

			e.preventDefault(); 
			
			var videoType = $(this).data('type'); 
			var $videoEmbed = $(this).parent().find('.vimeoEmbed'); 
					
			$videoEmbed.fadeIn();

			if (videoType == 'vimeo') { 	
				var vimeoPlayer = new Vimeo.Player($videoEmbed);
			    vimeoPlayer.setVolume(1);
			    vimeoPlayer.play();
			} else { 
			var playerNumber = $videoEmbed.data('player') - 1; 
				inlinePlayers[playerNumber].playVideo(); 
			}
			
		});
		
		
	
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
/*
	
	

var $playVideo = $('.playVideo'),
 	$videoOverlay = $('#videoOverlay'),
    $videoOverlayClose = $('#videoOverlayClose'),
    videoID,
	player,
	players = new Array(),
	YT,
	$playInlineVideo = $('.playInlineVideo');
	
	if ($playVideo) {
		
		//get the last video id so the player has something to get
		videoID = $playVideo.data('id'); 

		var tag = document.createElement('script');
	    tag.src = "https://www.youtube.com/iframe_api";
	    var firstScriptTag = document.getElementsByTagName('script')[0];
	    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		function onYouTubeIframeAPIReady() { 
			player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: videoID, // this will change when user clickers button
		    host: 'https://www.youtube-nocookie.com',
			playerVars: { 'autoplay':0, 'controls':1,'autohide':1,'origin':'window.location', 'playsinline':1,'modestbranding':1 }
			});
		}

		
		$body.on('click', '.playVideo', function(e){ 
			e.preventDefault();
			
			$body.addClass('stopScrolling');
			
			videoID = $(this).data('id'); 
			player.loadVideoById(videoID, 0, "default");
			
			TweenMax.to( $videoOverlay, 0.3, { autoAlpha:1 });
		
		});
		
		$videoOverlayClose.on('click', function(e){
		    e.preventDefault();
		    
			$body.removeClass('stopScrolling');
		    
			TweenMax.to( $videoOverlay, 0.3, { autoAlpha:0 });
		    
			player.pauseVideo();

		});
			
	}
	
	if ($playInlineVideo.length> 0) { 
		
		var ytVideoEmbeds = document.getElementsByClassName('videoEmbedYoutube');
		 
		function onYouTubeIframeAPIReady() {   
		    for (var i = 0; i < ytVideoEmbeds.length; i++) { 
		        var curplayer = createPlayer(ytVideoEmbeds[i]); 
				 players[i] = curplayer;  
		    }
	    }
	    
	    function createPlayer(videoWrapper) {   
		    return new YT.Player(videoWrapper, {
		        height: videoWrapper.height,
		        width: videoWrapper.width,
		        videoId: videoWrapper.dataset.src,
		        playerVars: { 'autoplay':0, 'controls': 1,'autohide':1,'origin':'window.location' }
		    });
		}
			
		$body.on('click', '.playInlineVideo', function(e){ 

			e.preventDefault(); 
			
			var videoType = $(this).data('type'); 
			var $videoEmbed = $(this).parent().find('.vimeoEmbed'); 
					
			if (videoType == 'vimeo') { 	
				var vimeoPlayer = new Vimeo.Player($videoEmbed);
			    vimeoPlayer.setVolume(1);
			    vimeoPlayer.play();
			} else {
				var player = $videoEmbed.data('player') - 1;
				players[player].playVideo();
			}
		   		
			$videoEmbed.fadeIn();
			
		});
		
		
	}
		
	
*/


     var $openInsight = $('.openInsight'),
          insightActive = false,
          
          $openInsight,
          $insightAjaxWrapper,
          $insightOverlayClose,
          insightOpenAnimation,
          insightCloseAnimation,
          $insightAjaxHolderRight,
          $headerWrapper,
          $sideNavWrapper,
          $insightAjaxTitle,
          $insightAjaxSubTitle,
          $insightAjaxIntro,
          insightAjaxHref;

     
     if ($openInsight.length > 0) {

		insightsInit();
	}
	
	

function insightsInit() { 
     // redeclare for AJAX reasons
     $openInsight = $('.openInsight'),
     $insightAjaxWrapper = $('#insightAjaxWrapper'),
     $insightOverlayClose = $('#insightOverlayClose'),
     insightOpenAnimation = new TimelineMax({}),
     insightCloseAnimation = new TimelineMax({}),

     $insightAjaxHolderRight = $('#insightAjaxHolderRight'),
     $headerWrapper = $('#headerWrapper'),
     $sideNavWrapper = $('#sideNavWrapper'),
     $insightAjaxTitle = $('#insightAjaxTitle'),
     $insightAjaxSubTitle = $('#insightAjaxSubTitle'),
     $insightAjaxIntro = $('#insightAjaxIntro');
               
	$openInsight.on('click', function(e){
		e.preventDefault();
          openInsight($(this));
	});
	
	$insightOverlayClose.on('click', function(e){
		e.preventDefault();
          closeInsight();
     });
	    
}

function openInsight(elem) {
     $thisElem = elem;
     insightActive = true;
     $body.addClass('stopScrolling');
     $ajaxContainer.addClass('stopScrolling');
     $insightAjaxHolderRight.empty();
     
     insightAjaxHref = $thisElem.attr('href');
     var thisTitle = $thisElem.data('title'); 
     var thisSubTitle = $thisElem.data('subtitle');
     var thisIntro = $thisElem.data('intro');

     $insightAjaxTitle.text(thisTitle);
     $insightAjaxSubTitle.text(thisSubTitle);
     $insightAjaxIntro.html(thisIntro);
     
     $insightAjaxHolderRight.load(insightAjaxHref + " #insightRightColumn", function() {
          
          TweenMax.to($insightAjaxHolderRight.find('.insightWidgetWrapper'), 0.4, { autoAlpha:1 });
          
          ytVideoEmbeds = document.getElementsByClassName('videoEmbedYoutube');
          if (ytVideoEmbeds.length>0) {
               for (var i = 0; i < ytVideoEmbeds.length; i++) { 
                  var curplayer = createPlayer(ytVideoEmbeds[i]); 
                     inlinePlayers[i] = curplayer;  
              }
          }
          
     });
     
     insightOpenAnimation.to($headerWrapper, 0.1, { autoAlpha:0 })
          .to($closeAjaxButton, 0.1, { autoAlpha:0 }, '-=0.1')
          .to($sideNavWrapper, 0.1, { autoAlpha:0 }, '-=0.1')
          .to($insightAjaxWrapper, 0.5, { xPercent:-100, ease:Power1.easeInOut }, '-=0.3')
          .fromTo($insightAjaxHolderRight, 0.5, { xPercent:100 }, { xPercent:0, ease:Power1.easeInOut }, '-=0.3')
          .fromTo($insightOverlayClose, 0.3, { xPercent:0 }, { xPercent:-100, ease:Power1.easeInOut }, '-=0.3')
     ;
     
     history.pushState({}, '', ajaxHref);
}

function closeInsight() {
     insightActive = false;
     $body.removeClass('stopScrolling');
     $ajaxContainer.removeClass('stopScrolling');

     insightCloseAnimation.fromTo($body.find('#insightOverlayClose'), 0.3, { xPercent:-100 }, { xPercent:0, ease:Power1.easeInOut })
          .fromTo($body.find('#insightAjaxHolderRight'), 0.5, { xPercent:0 }, { xPercent:100, ease:Power1.easeInOut }, '-=0.5')
          .to($insightAjaxWrapper, 0.5, {xPercent:0, ease:Power1.easeInOut },'-=0.3')
          .to($headerWrapper, 0.1, { autoAlpha:1 },'-=0.05')
          .to($closeAjaxButton, 0.1, { autoAlpha:1 }, '-=0.1')
          .to($sideNavWrapper, 0.1, { autoAlpha:1 }, '-=0.1')
     ;
}
    









var $openQuoteInsight = $('.openQuoteInsight'),
     quoteInsightActive = false,
     $openQuoteInsight = $('.openQuoteInsight'),
		$quoteAjaxWrapper = $('#quoteAjaxWrapper'),
		$quoteOverlayClose = $('#quoteOverlayClose'),
		quoteOpen = new TimelineMax({}),
		quoteClose = new TimelineMax({}),
		$quoteTarget = $('#quoteTarget'),
		$quoteName = $('#quoteName'),
		$quoteRole= $('#quoteRole'),
          $quoteImage = $('#quoteImage'),
          $headerWrapper = $('#headerWrapper'),
		$sideNavWrapper = $('#sideNavWrapper');

	if ($openQuoteInsight.length > 0) {
		quoteInsightsInit();
	}
	
	
function quoteInsightsInit() {
     $openQuoteInsight = $('.openQuoteInsight'),
     $quoteAjaxWrapper = $('#quoteAjaxWrapper'),
     $quoteOverlayClose = $('#quoteOverlayClose'),
     quoteOpen = new TimelineMax({}),
     quoteClose = new TimelineMax({}),
     $quoteTarget = $('#quoteTarget'),
     $quoteName = $('#quoteName'),
     $quoteRole= $('#quoteRole'),
     $quoteImage = $('#quoteImage'),
     $headerWrapper = $('#headerWrapper'),
     $sideNavWrapper = $('#sideNavWrapper');
	
	$openQuoteInsight.on('click', function(e){
		e.preventDefault();
          
          quoteInsightActive = true;

		$body.addClass('stopScrolling');
		$ajaxContainer.addClass('stopScrolling');
	
		var thisQuote = $(this).data('quote'),
			thisQuoteName = $(this).data('name'),
			thisQuoteRole = $(this).data('role'),
			thisQuoteImage = $(this).data('image');
			
			$quoteTarget.text(thisQuote);
			$quoteName.text(thisQuoteName);
			$quoteRole.text(thisQuoteRole);
			$quoteImage.attr('src',thisQuoteImage);
		
		quoteOpen.to($headerWrapper, 0.1, { autoAlpha:0 })
			.to($closeAjaxButton, 0.1, { autoAlpha:0 }, '-=0.1')
			.to($sideNavWrapper, 0.1, { autoAlpha:0 }, '-=0.1')
			.to($quoteAjaxWrapper, 0.3, { xPercent:-100, ease:Power1.easeInOut }, '-=0.1')
			.fromTo($quoteOverlayClose, 0.3, { xPercent:0 }, { xPercent:-100, ease:Power1.easeInOut }, '-=0.3')
		;
		
	});
	
	$quoteOverlayClose.on('click', function(e){
		e.preventDefault();
          
          quoteInsightActive = false;

		$body.removeClass('stopScrolling');
          $ajaxContainer.removeClass('stopScrolling');
          	
		quoteClose.fromTo($quoteOverlayClose, 0.3, { xPercent:-100 }, { xPercent:0, ease:Power1.easeInOut })
			.to($quoteAjaxWrapper, 0.3, {xPercent:0, ease:Power1.easeInOut },'-=0.3')
			.to($headerWrapper, 0.1, { autoAlpha:1 },'-=0.05')
			.to($closeAjaxButton, 0.1, { autoAlpha:1 }, '-=0.1')
			.to($sideNavWrapper, 0.1, { autoAlpha:1 }, '-=0.1')
		;
	
	});
	

}





		
	var $slideshowWidget = $('.slideshowWidget');

	if ($slideshowWidget.length > 0) {
		
		slideshowInit();
		
	}
	
	function slideshowInit() {
		$slideshowWidget = $('.slideshowWidget');
		
		$slideshowWidget.each( function( i, container ) {
			
			var $container = $(container);
			
			var $cbCarousel = $container.flickity({
				wrapAround: true,	 
				autoPlay: false,
				pageDots: false,
				prevNextButtons: false,
				setGallerySize: true,
				cellSelector: '.slide',
				cellAlign: 'left',
				lazyLoad: 3,
				imagesLoaded:true,
				adaptiveHeight:false
			});
			
		var $nextButton = $container.find('.slideshowWidgetNav');
			
			$nextButton.on('click', function(e) {
				e.preventDefault();	
				$cbCarousel.flickity('next');
				$cbCarousel.flickity('stopPlayer');
			});

/*
			var $previousButton = $container.find('.cbCarouselNav.previous');
			
			$previousButton.on('click', function(e) {
				e.preventDefault();	
				$cbCarousel.flickity('previous');
				$cbCarousel.flickity('stopPlayer');
			});
			
			var $nextButton = $container.find('.cbCarouselNav.next');
			
			$nextButton.on('click', function(e) {
				e.preventDefault();	
				$cbCarousel.flickity('next');
				$cbCarousel.flickity('stopPlayer');
			});
*/
			
			
			// This fixes the issue where the height is calculated incorrectly
			setTimeout(function(){ 
				$cbCarousel.flickity('resize'); 
			}, 2000);

			
			
			$cbCarousel.on( 'staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
				if ( !cellElement ) {
					return;
				}
				$cbCarousel.flickity( 'select', cellIndex );
			});
				
			
			var tapArea, startX ;
		        tapArea = document.querySelectorAll('.slideshowWidget');
		        startX = 0;
		        for (var item of tapArea) {
		            item.ontouchstart = function(e) {
		                startX = e.touches[0].clientX;
		            };
		            item.ontouchmove = function(e) {
		                if (Math.abs(e.touches[0].clientX - startX) > 5 && e.cancelable ) {
		                    e.preventDefault();
		                }
		            };
		        }
		
		
		});
		
	}



	var $splashLogo = $('#splashLogo');

	if ($splashLogo.length > 0) {	
	


   var animationData = {"v":"5.7.1","fr":25,"ip":0,"op":60,"w":504,"h":402,"nm":"Comp 1","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"dRMM Outlines 3","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.825],"y":[1]},"o":{"x":[0.407],"y":[0.847]},"t":11,"s":[39.237]},{"t":20,"s":[180]}],"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":11,"s":[123.667,120.667,0],"to":[0.506,-0.253,0],"ti":[-0.212,0.106,0]},{"t":20,"s":[125,120,0]}],"ix":2},"a":{"a":0,"k":[15.8,14.8,0],"ix":1},"s":{"a":0,"k":[737,737,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[1.691,5.072],[1.691,-5.072],[0,-6.762],[-1.691,-5.072],[-1.691,5.072],[0,6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":14,"s":[15.934,18.697],"to":[0,0.667],"ti":[0,-0.667]},{"t":18,"s":[15.934,22.697]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[0.167,0.167],"y":[0,0]},"t":14,"s":[100,0]},{"t":18,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":13,"s":[0]},{"t":15,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 12","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-4.227,1.691],[4.226,1.691],[5.917,-0.001],[4.226,-1.691],[-4.227,-1.691],[-5.917,-0.001]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":13,"s":[19.045,14.728],"to":[0.667,0],"ti":[-0.667,0]},{"t":17,"s":[23.045,14.728]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[0.167,0.167],"y":[0,0]},"t":13,"s":[0,100]},{"t":17,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":12,"s":[0]},{"t":14,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 14","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[4.227,1.691],[5.918,-0.001],[4.227,-1.691],[-4.227,-1.691],[-5.918,-0.001],[-4.227,1.691]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":12,"s":[13.805,14.728],"to":[-0.833,0],"ti":[0.833,0]},{"t":17,"s":[8.805,14.728]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[0.333,0.333],"y":[0,0]},"t":12,"s":[0,100]},{"t":17,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":11,"s":[0]},{"t":13,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 16","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.691,-5.072],[-1.691,5.073],[0,6.762],[1.691,5.073],[1.691,-5.072],[0,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":11,"s":[15.934,10.765],"to":[0,-0.667],"ti":[0,0.667]},{"t":16,"s":[15.934,6.765]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[0.333,0.333],"y":[0,0]},"t":11,"s":[100,0]},{"t":16,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":10,"s":[0]},{"t":12,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 13","np":2,"cix":2,"bm":0,"ix":4,"mn":"ADBE Vector Group","hd":false}],"ip":-13,"op":187,"st":-13,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"dRMM Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[254,204,0],"ix":2},"a":{"a":0,"k":[33.5,26,0],"ix":1},"s":{"a":0,"k":[737,737,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.691,-5.071],[-1.691,5.072],[0.001,6.762],[1.691,5.072],[1.691,-5.071],[0.001,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":3,"s":[15.929,48.356],"to":[0,-0.667],"ti":[0,0.667]},{"t":5,"s":[15.929,44.357]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":3,"s":[100,0]},{"t":5,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 10","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.69,-5.073],[-1.69,5.074],[-0.001,6.762],[1.69,5.072],[1.69,-5.071],[-0.001,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":2,"s":[1.69,48.356],"to":[0,-0.666],"ti":[0,0.666]},{"t":4,"s":[1.69,44.357]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":2,"s":[100,0]},{"t":4,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 9","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.691,-5.071],[-1.691,5.072],[-0.001,6.762],[1.691,5.072],[1.691,-5.071],[-0.001,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":4,"s":[30.168,48.356],"to":[0,-0.667],"ti":[0,0.667]},{"t":6,"s":[30.168,44.357]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":4,"s":[100,0]},{"t":6,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 8","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.69,-5.071],[-1.69,5.072],[0.001,6.762],[1.69,5.072],[1.69,-5.071],[0.001,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":5,"s":[36.126,48.356],"to":[0,-0.667],"ti":[0,0.667]},{"t":7,"s":[36.126,44.357]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":5,"s":[100,0]},{"t":7,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 4","np":2,"cix":2,"bm":0,"ix":4,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.691,-5.071],[-1.691,5.072],[-0.001,6.762],[1.691,5.072],[1.691,-5.071],[-0.001,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":6,"s":[50.367,48.356],"to":[0,-0.667],"ti":[0,0.667]},{"t":8,"s":[50.367,44.357]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":6,"s":[100,0]},{"t":8,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 5","np":2,"cix":2,"bm":0,"ix":5,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.69,-5.071],[-1.69,5.072],[0,6.762],[1.69,5.072],[1.69,-5.071],[0,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":8,"s":[64.605,48.356],"to":[0,-0.667],"ti":[0,0.667]},{"t":10,"s":[64.605,44.356]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":8,"s":[100,0]},{"t":10,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 3","np":2,"cix":2,"bm":0,"ix":6,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[4.227,-1.691],[-4.227,-1.691],[-5.918,-0.003],[-4.227,1.691],[4.227,1.691],[5.918,-0.003]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":7,"s":[15.805,43.395],"to":[-0.412,-0.412],"ti":[0.787,0.787]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":9,"s":[9.138,38.729],"to":[-1.017,-1.017],"ti":[0.426,0.426]},{"t":10,"s":[8.805,36.395]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":7,"s":[-91]},{"t":10,"s":[0]}],"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":7,"s":[0]},{"t":8,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 7","np":2,"cix":2,"bm":0,"ix":7,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[4.226,-1.691],[-4.227,-1.691],[-5.917,-0.003],[-4.227,1.691],[4.226,1.691],[5.917,-0.003]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":9,"s":[16.044,44.395],"to":[0.741,-0.847],"ti":[-1.771,2.025]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":11,"s":[22.71,39.062],"to":[1.017,-1.162],"ti":[-0.426,0.486]},{"t":12,"s":[23.044,36.395]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":9,"s":[90]},{"t":12,"s":[0]}],"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":9,"s":[0]},{"t":10,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 6","np":2,"cix":2,"bm":0,"ix":8,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[4.227,-1.691],[-4.227,-1.691],[-5.917,-0.003],[-4.227,1.691],[4.227,1.691],[5.917,-0.003]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[50.244,43.395],"to":[-0.741,-0.741],"ti":[1.771,1.771]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":12,"s":[43.578,38.729],"to":[-1.017,-1.017],"ti":[0.426,0.426]},{"t":13,"s":[43.244,36.395]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[-90]},{"t":13,"s":[0]}],"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[0]},{"t":11,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 2","np":2,"cix":2,"bm":0,"ix":9,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[4.228,-1.691],[-4.226,-1.691],[-5.918,-0.003],[-4.226,1.691],[4.228,1.691],[5.918,-0.003]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":11,"s":[50.483,43.395],"to":[0.741,-0.741],"ti":[-1.771,1.771]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":13,"s":[56.149,38.729],"to":[1.017,-1.017],"ti":[-0.426,0.426]},{"t":14,"s":[57.483,36.395]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":11,"s":[90]},{"t":14,"s":[0]}],"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":11,"s":[0]},{"t":12,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":10,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-4.227,-1.692],[-5.918,-0.001],[-4.227,1.692],[4.227,1.692],[5.918,-0.001],[4.227,-1.692]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":12,"s":[8.805,36.674],"to":[0,-1],"ti":[0,1]},{"t":16,"s":[8.805,30.674]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"t":14,"s":[100,0]},{"t":15,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":12,"s":[0]},{"t":16,"s":[100]}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 15","np":2,"cix":2,"bm":0,"ix":11,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-1.691,-5.072],[-1.691,5.072],[0.001,6.762],[1.691,5.072],[1.691,-5.072],[0.001,-6.762]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.564,"y":0.87},"o":{"x":0.182,"y":0},"t":14,"s":[1.691,30.698],"to":[0,-0.113],"ti":[0,0.264]},{"i":{"x":0.664,"y":0.821},"o":{"x":0.322,"y":0.107},"t":15,"s":[1.691,28.094],"to":[0,-0.171],"ti":[0,0.473]},{"i":{"x":0.829,"y":1},"o":{"x":0.425,"y":0.345},"t":16,"s":[1.691,25.763],"to":[0,-0.959],"ti":[0,0.148]},{"t":18,"s":[1.691,22.698]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[1,1]},"o":{"x":[0.167,0.167],"y":[0,0]},"t":14,"s":[100,0]},{"t":18,"s":[100,100]}],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 11","np":2,"cix":2,"bm":0,"ix":12,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":200,"st":0,"bm":0}],"markers":[]};    
  
    
    var params = {
        container: document.getElementById('splashLogo'),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: animationData
    };

    var anim = lottie.loadAnimation(params);
    
    }
    


	var $filterThinking = $('#filterThinking'),
		$ajaxType = 'full',
		$thinkingLoading = $('#thinkingLoading'),
		pageNumber,
		URLString,
		radioValue,
		firstFilter = true,
		filterArray,
		$ajaxHolderThinking = $('#ajaxHolderThinking'),
		$thinkingLoadingInfinite = $('#thinkingLoadingInfinite'),
		newPage,
		nextPage,
		totalPages,
		$mobileThinkingFilterButton = $('#mobileThinkingFilterButton'),
		$thinkingPageWrapper = $('#thinkingPageWrapper');


	
	var $relatedArticleSlideshow = $('.relatedArticleSlideshow');

	if ($relatedArticleSlideshow.length > 0) {
		
		relatedArticleSlideshowInit();
		
	}


function relatedArticleSlideshowInit() {
		$relatedArticleSlideshow = $('.relatedArticleSlideshow');
		
		$relatedArticleSlideshow.each( function( i, container ) {
			
			var $container = $(container);
			
			var $cbCarousel = $container.flickity({
				wrapAround: false,	 
				autoPlay: false,
				pageDots: false,
				prevNextButtons: false,
				setGallerySize: true,
				cellSelector: '.card',
				cellAlign: 'left',
				lazyLoad: 3,
				imagesLoaded:true,
				adaptiveHeight:false,
				contain:true,
				watchCSS: true
			});
			
			var $nextButton = $container.find('.slideshowWidgetNav');
				
			$nextButton.on('click', function(e) {
				e.preventDefault();	
				$cbCarousel.flickity('next');
			});
			
			
			var tapArea, startX ;
		        tapArea = document.querySelectorAll('.relatedCards');
		        startX = 0;
		        for (var item of tapArea) {
		            item.ontouchstart = function(e) {
		                startX = e.touches[0].clientX;
		            };
		            item.ontouchmove = function(e) {
		                if (Math.abs(e.touches[0].clientX - startX) > 5 && e.cancelable ) {
		                    e.preventDefault();
		                }
		            };
		        }
		
		
		});
		
	}



if ($filterThinking.length > 0) {	
	
	$('#filterThinking').on('change', function(e) { 
		e.preventDefault();
		
		//$(this).prev('.tagField').prop("checked", true );
		
		$('#pageNumber').val('1'); 	
		submitThinkingFilter($ajaxType);
		
	});
	
	submitThinkingFilter($ajaxType);
	
	
	$mobileThinkingFilterButton.on('click', function(e) { 
		e.preventDefault();
		
		TweenMax.to($thinkingPageWrapper, 0.4, { yPercent:100, ease:Power1.easeInOut });
		
	});
	
	

}


	var $thinkingLoadingAnimation = $('.thinkingLoadingAnimation');
	
	if ($thinkingLoadingAnimation.length > 0) {	
	
		if ($thinkingLoadingAnimation.length > 0) {
			var loader = new TimelineMax({repeat:-1}),
				$circleStroke1 = $('.circleStroke1'),
				$circleStroke2 = $('.circleStroke2');
			
			loader.to( $circleStroke1, 0.4, { rotation:135, ease:Power1.easeIn })
				.to( $circleStroke2, 0.4, { rotation:315 })
				.to( $circleStroke1, 0.4, { rotation:315 })
				.to( $circleStroke2, 0.4, { rotation:495, ease:Power1.easeOut });
		}
		
	}
	
	
	
function submitThinkingFilter($ajaxType) {
	
	$body.addClass('working');
	
	if (width < 900) {
		TweenMax.to($thinkingPageWrapper, 0.4, { yPercent:0, ease:Power1.easeInOut });
	}
				
	if ($ajaxType == 'full') {
		$(window).scrollTo( 0, 600, {axis:'y'} );
		$ajaxHolderThinking.animate({"opacity":"0"},300);	
		TweenMax.to($thinkingLoading, 0.4, { autoAlpha:1 });
	} else {
		TweenMax.to($thinkingLoadingInfinite, 0.4, { autoAlpha:1 });
	}	
	
	pageNumber = $('#pageNumber').val();
	
	URLString = '';
	
	radioValue = $("input[name='tagged']:checked").val(); 
	
	URLString = '?tagged=' + radioValue + '&pg=' + pageNumber;	
	
	if (firstFilter) {
		window.history.replaceState({},'', URLString);
	} else {
		window.history.pushState({},'', URLString);
	}

	firstFilter = false;
	
	filterArray = $filterThinking.serialize(); 
		
	$.ajax({
		url:$filterThinking.attr('action'),
		data: { term: filterArray },
		type:$filterThinking.attr('method'), 

		success:function(data){	
										
			$(window).off('scroll',infinineThinking);	
																
			if ($ajaxType == 'full') {					
				TweenMax.to($thinkingLoading, 0.4, { autoAlpha:0 });
				$ajaxHolderThinking.animate({"opacity":"1"}).html(data);
			} else {
				TweenMax.to($thinkingLoadingInfinite, 0.4, { autoAlpha:0 });
				$ajaxHolderThinking.append(data);	
			}				

/*
			totalResults = $("#resultsInfo").data('count');
			totalThinking = $("#resultsInfo").data('total');
*/
			newPage = $("#resultsInfo").data('page');
			nextPage = newPage + 1;
			totalPages = $("#resultsInfo").data('pages');

			$('#pageNumber').val(newPage);
			
			if (nextPage <= totalPages) {
				$('#ajaxPagination').attr('data-next', nextPage );
				$(window).on('scroll',infinineThinking);
			} else {
				//$('#ajaxPagination').hide();	
			}
			
			$body.rhLoadIn();
			
			$body.rhLazy();
			
			videoElems = document.getElementsByClassName('inlineVideo');
			if (videoElems.length > 0) {
				inlineVideo();
			}
			
			setTimeout(function(){ 
				$body.removeClass('working');					
				
			}, 100);	
			
		}
	});
	return false;
	
}







function infinineThinking() { 		

	st = $(this).scrollTop();

	var infiniteLoadTrigger = $(document).height() - $(window).height() - 100;
			
	if ((st >= infiniteLoadTrigger) && (!$body.hasClass('working')) ) {
	
		
		$('#resultsInfo').remove();
	
		var $ajaxType = 'paginate';
		pageNumber = $('#ajaxPagination').attr('data-next'); 
	
		$('#pageNumber').val(pageNumber);
		submitThinkingFilter($ajaxType);	

	}		
	
}












var $approachHeroInner = $('#approachHeroInner');

	if ($approachHeroInner.length > 0) {
		
		var $approachStrapline = $('#approachStrapline');
		
		$(window).on('scroll',approachScroll);

		var $approachImages = $approachHeroInner.find('.toolTipImage'),
			 approachAni = new TimelineMax({});

		$approachImages.imagesLoaded({background:'.bgImgLoad'},function(){ 
			approachAni.staggerTo( $approachImages, 0.4, { scale:1, opacity:0.7, ease:Power1.easeInOut}, 0.2)
				.to( $approachHeroInner.find('img:last'), 0.4, { opacity:1, ease:Power1.easeInOut}, '-=0.4');
			
			$approachImages.draggable({
				revert: false,
		        start: function() {
		            /* Temporarily revert the transform so drag and dropping works as expected */
			            var parentRect = $(this).parent()[0].getBoundingClientRect();
			            var rect = this.getBoundingClientRect();
			            /* cssBrowserPrefix is one of: -moz -webkit -o */
			            $(this).css('transition', 'all 0 ease 0');
			            $(this).css('transform', 'none');
			            $(this).css('left', rect['left']-parentRect['left']);
		        },
		        stop: function() {
		          /* Revert the transformation changes done on start, if needed */
		        }			
			});
		});

		$approachImages.mousedown(function() {
			$approachImages.removeClass('active').addClass('animationComplete');
			$(this).addClass('active');
		});
		
		wHeight = window.innerHeight;
		
/*
		var $toolTip = $('#toolTip'),
				wHalftWidth = window.innerWidth * 0.41667,
			toolTipStartX = wHalftWidth-30,
			toolTipStartY = wHeight-30;
					
		TweenMax.set($toolTip, {
		    xPercent: -50,
		    yPercent: -50,
		    x:toolTipStartX,
		    y:toolTipStartY,
		    opacity:1
		})
		
		var toolTips = document.querySelectorAll('.toolTipImage'); 
		
		for ( i = 0 ; i < toolTips.length; i++) {
			 toolTips[i].addEventListener('mousemove', toolTipMove);
			 toolTips[i].addEventListener('mouseleave', toolTipLeave); 
		}
*/
	   
	}

/*
function toolTipMove(e) { 

    TweenMax.to($toolTip, 0.2, {
        x: e.clientX-wHalftWidth,
        y: e.clientY,
        ease:Power4.easeOut
    })

}
*/

/*
function toolTipLeave() {  

	TweenMax.to($toolTip, 0.4, {
	    xPercent: -50,
	    yPercent: -50,
	    x:toolTipStartX,
	    y:toolTipStartY,
	    ease: Back.easeOut.config(0.6)
	})

}
*/
 
function approachScroll() {
	
	if (st > 50) {
		TweenMax.to($approachStrapline, 0.3, {autoAlpha:0});
	} else {
		TweenMax.to($approachStrapline, 0.3, {autoAlpha:1});
	}
	
/*
	var approachFeaturedProjectTop = $approachFeaturedProject.offset().top - 200;

	if (st >= approachFeaturedProjectTop) {
		$approachFeaturedProject.addClass('active');
	} else {
		$approachFeaturedProject.removeClass('active');
	}
*/
	
}



var $approachMultipleImages = $('.approachMultipleImages');

if ($approachMultipleImages.length > 0) {
	approachSlideshowInit();	
}

function approachSlideshowInit() {
	$approachMultipleImages = $('.approachMultipleImages');
	
	$approachMultipleImages.each( function( i, container ) {
		
		var $container = $(container);
		
		var $cbCarousel = $container.flickity({
			wrapAround: false,	 
			autoPlay: false,
			pageDots: false,
			prevNextButtons: false,
			setGallerySize: true,
			cellSelector: '.multipleImage',
			cellAlign: 'left',
			lazyLoad: 3,
			imagesLoaded:true,
			adaptiveHeight:false,
			contain:true,
			watchCSS: true
		});
		

		var $nextButton = $container.find('.approachMobilenav');
			
		$nextButton.on('click', function(e) {
			e.preventDefault();	
			$cbCarousel.flickity('next');
		});

		
		var tapArea, startX ;
	        tapArea = document.querySelectorAll('.approachMultipleImages');
	        startX = 0;
	        for (var item of tapArea) {
	            item.ontouchstart = function(e) {
	                startX = e.touches[0].clientX;
	            };
	            item.ontouchmove = function(e) {
	                if (Math.abs(e.touches[0].clientX - startX) > 5 && e.cancelable ) {
	                    e.preventDefault();
	                }
	            };
	        }
	
	});
	
}








	var $randomiseWrapper = $('#randomiseWrapper');

	if ($randomiseWrapper.length > 0) {
		
		var $closeRandomiser = $('#closeRandomiser'),
			//$doRandomise = $('.doRandomise'),
			$randomiseBar = $('#randomiseBar'),
			$randomiseButton = $('#randomiseButton'),
			randomiserOpen = false,
			randomOpen = new TimelineMax({}),
			randomClose = new TimelineMax({}),
			randomAjax = new TimelineMax({}),
			$randomAjaxDestination = $('#randomAjaxDestination');
			
		$(window).on('scroll',randomScroll);

		$body.on('click','.doRandomise', function(e) {
			e.preventDefault();
			
			if (!randomiserOpen) {
				
				$randomAjaxDestination.empty();
				
				randomiserOpen = !randomiserOpen;
				
				randomOpen.to($randomiseWrapper, 0.3, { autoAlpha:1, ease:Power1.easeInOut })
					.to($randomiseBar, 0.4, { xPercent:100, ease:Power1.easeInOut }, '-=0.2')
					.to($closeRandomiser, 0.3, { autoAlpha:1, ease:Power1.easeInOut }, '-=0.3');
						
			} else {
				TweenMax.set($('#randomAuthor'),{ autoAlpha:0, ease:Power1.easeInOut });
				TweenMax.set($('#randomLink'), { autoAlpha:0, ease:Power1.easeInOut });
				TweenMax.set($('.randomImage'), { autoAlpha:0, scale:0, ease:Power1.easeInOut });
			}
			// changed for prod
			$randomAjaxDestination.load(site + '/wp2020/wp-content/themes/drmm/phpScripts/scrapbookContent.php' + " #randomAjaxSource", function() {
				
				var $titles = $('#randomTitle').find('li'),
				 	$count = 0; 	  
			 						
					var randomGo = setInterval(function () {
						
						$count++;
						if ($count<21) {
							
							randomiser($titles);
							
						} else {
							
							clearInterval(randomGo);
							
							randomAjax.staggerTo($('.randomImage'), 1.2, { autoAlpha:1, scale:1, ease: "elastic(1, 0.3)" }, 0.1)
								.to($('#randomAuthor'), 0.3, { autoAlpha:1, ease:Power1.easeInOut }, '-=0.6')
								.to($('#randomLink'), 0.3, { autoAlpha:1, ease:Power1.easeInOut }, '-=0.6');
								
						}
					     					
					
					}, 100); 
				
			});
						
		})
		
		$closeRandomiser.click(function(e) {
			e.preventDefault();
			
			randomiserOpen = !randomiserOpen;

			randomClose.to($closeRandomiser, 0.3, { autoAlpha:0, ease:Power1.easeInOut })
				.to($randomiseBar, 0.3, { xPercent:0, ease:Power1.easeInOut }, '-=0.3')
				.to($randomiseWrapper, 0.3, { autoAlpha:0, ease:Power1.easeInOut }, '-=0.3')
				.to($('#randomAuthor'), 0.3, { autoAlpha:0, ease:Power1.easeInOut }, '-=0.3')
				.to($('#randomLink'), 0.3, { autoAlpha:0, ease:Power1.easeInOut }, '-=0.3');
		})
	}


function randomiser($titles) {
	var $active = $titles.closest('.active');
	$active.removeClass('active');
	var $next = $active.next();
	if ($next.length === 0) { $next = $titles.closest('.first'); }
	$next.addClass('active');
}

function randomScroll() {
	var angle = $(this).scrollTop() / 600; 
	$randomiseButton.css({ transform: 'rotate(+' + angle + 'rad)' });	
}







	var $collaborationHeroImagesWrapper = $('#collaborationHeroImagesWrapper');
	
	if ($collaborationHeroImagesWrapper.length > 0) {
		
		var $collaborationHeroList = $collaborationHeroImagesWrapper.find('.collaborationHeroList');
		
		var $collaboratinsActive = $collaborationHeroList.find('.active');
		TweenMax.to($collaboratinsActive, 0.4, { autoAlpha:1 }); 
		
			$collaborationHeroList.each( function() {
				
				var slideDelay = $(this).data('delay'); 
				
				var $slides = $(this).find('li'); 
					                
	                setTimeout(function(){ 
		                
		                slideshow($slides);
		                
		                setInterval(function () {
		                	slideshow($slides);
		                }, 4000);
		                
	                }, slideDelay);
	                
			});

	}

		
	function slideshow($slides) {
		
		var $active = $slides.closest('.active');
		$active.removeClass('active');
		
		var $next = $active.next();
		if ($next.length === 0) { $next = $slides.closest('.first'); }
		$next.addClass('active');
		
		TweenMax.to($next, 0.4, { autoAlpha:1 });
		setTimeout(function(){ 
			TweenMax.to($active, 0.4, { autoAlpha:0 });
		 }, 1000);
		
	} 


	var $studioCultureHero = $('#studioCultureHero');
	
	if ($studioCultureHero.length > 0) {

		var $studioCultureContent = $('#studioCultureContent'),
			$studioCultureHeroImages = $studioCultureHero.find('img'),
			$studioAnimate = $studioCultureHero.find('.animate');
		
		$studioCultureHeroImages.on('click', function(e){
			e.preventDefault();
			
			var studioCultureContentTop = $studioCultureContent.offset().top,
				studioCultureOffset = studioCultureContentTop - (height / 2) - (width * 0.075);
				
				//console.log(studioCultureOffset);
			
			$(window).scrollTo(studioCultureOffset + 'px', 600, {axis:'y'} );
		
		});
				
		gsap.to($studioAnimate, {
		  duration: 0.4,
		  autoAlpha: 1,
		  ease: "power1.inOut",
		  stagger: {
		    from: "random",
		    amount: 1
		  }
		});



		var $panoramaWrapper = $('.panoramaWrapper'); 
		
		if ($panoramaWrapper.length > 0) {
               var firstScroll = true;

               if (firstScroll) {
                    $(window).scroll(function() {
                         clearTimeout($.data(this, 'scrollTimer'));
                         $.data(this, 'scrollTimer', setTimeout(function() {
                             // do something
                            // console.log("Haven't scrolled in 250ms!");
                             $('#groupImage').addClass('active');
                             firstScroll = false;
                         }, 500));
                     });
               }
              
					
			$panoramaWrapper.each(function() {
				
				var $panoramaImage = $(this).find('.panoramaImage'),
				panoramaImageHeight = $panoramaImage.height(),
				panoramaImageRatio = $panoramaImage.data('ratio'),
				panoramaImageWidth = panoramaImageHeight * panoramaImageRatio,
				panoramaOffset = width - panoramaImageWidth;
				
				$(this).find('img').draggable({ 
				    drag: function(event, ui) { 
				    								
						if (ui.position.left > 0) {
							ui.position.left = 0;
						}
						
						if (ui.position.left < panoramaOffset) {
							ui.position.left = panoramaOffset;
						}
				         
				      },
				    axis: "x",
				    scroll: false 
				});
				
			});
			
		}
          
          

          if (width < 600) {
               var scHeight = (height/2) + 50;
               $studioCultureHero.css({"height":scHeight+"px"});
          }
          
          var $studioCultureMobileSlides = $('#studioCultureMobileSlides');
          
          var $studioCultureMobileActive = $studioCultureMobileSlides.find('.active');
          TweenMax.to($studioCultureMobileActive, 0.4, { autoAlpha:1 }); 
               
          var $slides = $studioCultureMobileSlides.find('li'); 
                                   
          
          setInterval(function () {
               studioSlideshow($slides);
          }, 1000);
          
          	
	function studioSlideshow($slides) {
		
		var $active = $slides.closest('.active');
		$active.removeClass('active');
		
		var $next = $active.next();
		if ($next.length === 0) { $next = $slides.closest('.first'); }
		$next.addClass('active');
		
		TweenMax.to($next, 0.4, { autoAlpha:1 });
		TweenMax.to($active, 0.4, { autoAlpha:0 });
		
		
     } 
     
                    
               

         
          
		

	}
	




	
/*
	var targetImage,
		$imageZoomOverlay = $("<div class='imageZoomOverlay'>"),
		$imageZoomInner = $("<div class='imageZoomInner'>");
*/

	var targetImage,
		$imageZoomOverlay = $('#imageZoomOverlay'),
		$imageZoomInner = $('#imageZoomInner');
	
		
	$body.on('click','.zoom', function(e) { 
		e.preventDefault(); 
				
		var $this = $(this);
		targetImage = $this.data('zoom');
		
		TweenMax.to($imageZoomOverlay, 0.4, { autoAlpha:1 });

		var theImage = new Image();
        theImage.src = targetImage;
		
		if (theImage.complete) {
			openOverlay();
		} else {
			theImage.addEventListener('load', openOverlay )
			theImage.addEventListener('error', function() { 
				closeOverlay(); 
				$imageZoomOverlay.hide().empty();	
			});
		}			
 
	});

	$imageZoomOverlay.click( function() { 		
		closeOverlay();	    
	});
	

	
	function openOverlay() {		 
				
		$imageZoomInner.css({'background-image':'url(' + targetImage + ')'});
		    		
		$imageZoomOverlay.imagesLoaded( { background: 'div' }, function() {
			
			TweenMax.to($imageZoomInner, 0.4, { opacity:1 });
			
		});
		
	}	
		
	function closeOverlay() {
		TweenMax.to($imageZoomOverlay, 0.4, { autoAlpha:0 });
		TweenMax.to($imageZoomInner, 0.4, { opacity:0 });
	}





var $loadMoreNews = $('#loadMoreNews');

$loadMoreNews.on('click', function(e){
	e.preventDefault();
	loadNews();
});

function loadNews() {

var $loadingNews = $('#loadingNews'),
    $noMoreNews = $('#noMoreNews'),
    $loadingBay = $('#loadingBay'),
    totalPages, loadUrl, nextPage, nextURL, $elements;

    $body.addClass('working');
    loadUrl = $loadMoreNews.attr('href');
    totalPages = $loadMoreNews.data('total');
    nextPage = $loadMoreNews.data('next');
    $loadingNews.show();

  if (nextPage <= totalPages) {

    $loadingBay.load(loadUrl + " #newsAjaxHolder", function() {
      $elements = $loadingBay.find('.card');

      $('#newsAjaxHolder').append($elements);

      nextPage++;

      $loadMoreNews.data('next', nextPage);

      if (nextPage > totalPages) {
          $loadMoreNews.hide();
          $noMoreNews.show();
          $loadingNews.hide();
      }

      nextURL = site + '/news/page/' + nextPage;
      $loadMoreNews.attr('href', nextURL);

      if (location.href != loadUrl) {
        history.pushState({}, '', loadUrl);
      }

      $loadingBay.empty();
      $body.removeClass('working');
      $loadingNews.hide();

	  $body.rhLoadIn();

		$body.rhLazy();



    });

  }

}





var videoElems = document.getElementsByClassName('inlineVideo');
	
	if (videoElems.length > 0) {
		inlineVideo();
	}
	
	function inlineVideo() {
		
		for(i = 0; i < videoElems.length; i++){ 
						
			videoElems[i].addEventListener('canplay', videoReady);
			
			var videoElement = videoElems[i]; 
			
			if (videoElement.readyState > 3) { 
				videoElems[i].classList.add('ready');
			}

		}
		
	}
		
	function videoReady(){
		this.classList.add('ready');
	}
/*
	
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazyVideo")); 

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(video) { 
        if (video.isIntersecting) { 
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }
          video.target.load();
          video.target.classList.remove("lazyVideo");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    }, {rootMargin: "0px 0px 500px 0px"});

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
*/




	// selectors not cached because of AJAX
	
	var shareActive = false;
	
		
	$('body').on('click', '#shareTrigger', function(e){
		e.preventDefault();

	});
	
	$('body').on('mouseenter', '#shareTrigger', function(){
		shareActive = true;
		$('#shareTrigger').addClass('active');
		gsap.to($('.shareAnimate'), 0.3, {autoAlpha: 1, stagger:0.1});
	});

	$('body').on('mouseleave', '#shareButtons', function(){
		if (shareActive) {
			shareActive = false;
			$('#shareTrigger').removeClass('active');
			gsap.to($('.shareAnimate'), 0.3, {autoAlpha:0, stagger:-0.2});
		}
	});

    	
	var winWidth = 520, 
		winHeight = 350,
		winTop = (screen.height / 2) - (winHeight / 2),
		winLeft = (screen.width / 2) - (winWidth / 2),
		popupMeta = 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight;
	
	function socialShare(network, url, title) { 
		
		if (network == 'facebook') {
			window.open('../www.facebook.com/loginf2dc.html?u=' + url, 'sharer', popupMeta);
		} else if (network == 'twitter') {
			window.open('https://twitter.com/intent/tweet?text=' + title + '%20-%20&url=' + url, 'sharer', popupMeta);
		}
		
	}    



// @codekit-prepend "global/vars.js";
// @codekit-prepend "components/objectFit.js";
// @codekit-prepend "components/rhLazy.js";
// @codekit-prepend "components/rhBanner.js";
// @codekit-prepend "components/loadIn.js";
// @codekit-prepend "components/search.js";
// @codekit-prepend "components/nav.js";
// @codekit-prepend "components/homepage.js";
// @codekit-prepend "components/people.js";
// @codekit-prepend "components/projects.js";
// @codekit-prepend "components/ajax.js";
// @codekit-prepend "components/insight-video.js";
// @codekit-prepend "components/insights.js";
// @codekit-prepend "components/slideshows.js";
// @codekit-prepend "components/loadingLogo.js";
// @codekit-prepend "components/thinking.js";
// @codekit-prepend "components/approach.js"; 
// @codekit-prepend "components/randomise.js"; 
// @codekit-prepend "components/collaborations.js"; 
// @codekit-prepend "components/studio.js"; 
// @codekit-prepend "components/imageZoom.js"; 
// @codekit-prepend "components/infiniteLoad.js";
// @codekit-prepend "components/video.js";
// @codekit-prepend "components/share.js";


// @codekit-append "global/resize.js";


//on ready
$(document).ready(function(){

	$body.rhLoadIn();

	$body.rhLazy();
	
	$('.parallax').rhBanner({
		parallaxRatio:1.4
	});

}); // end doc ready


	var $fullHeight = $('.fullHeight');
	if ($fullHeight.length > 0) {
		$fullHeight.css({"height":height+"px"});
		
		$(window).resize(function() { 
			height = $(window).height();
			$fullHeight.css({"height":height+"px"});
		});

	}
	
	
	var $opportunitiesScrollButton = $('#opportunitiesScrollButton');
	if($opportunitiesScrollButton.length > 0) {
		$opportunitiesScrollButton.on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			$(window).scrollTo(height, 600, {axis:'y'} );
		});
	}
	


$(window).resize(function() {

  if ( $(window).width() != width ) {
    //console.log('width has changed');

  }

  //height = $(window).height();
  width = $(window).width();






});
