<<<<<<< HEAD

=======
>>>>>>> gh-pages
/*
 * Superfish v1.5 - jQuery menu widget
 * Copyright (c) 2012 Bob Gregor
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: https://github.com/bobbravo2/superfish/blob/master/changelog.txt
 */
<<<<<<< HEAD

;(function($){
	//Set up local instance with defaults
	var sf = {};
	sf.c = {
		menuClass   : 'sf-js-enabled',
		subClass		: 'sf-sub-indicator',
		anchorClass : 'sf-with-ul'
	};
	sf.defaults = {
		hoverClass	: 'sfHover',
		pathClass	: 'overideThisToUse',
		pathLevels	: 1,
		delay		: 700,
		animIn		: {opacity:'show'},//What animation object to use to show the submenus
		animOut		: {opacity:'hide'},//  "	"		   "	"  "  "	 hide  "     "
		easeIn		: "swing",
		easeOut		: "swing",
		speedIn		: 'normal',
		speedOut	: 'normal',
		autoArrows	: true,
		arrow		: '<span class="'+sf.c.subClass+'">&#187;</span>',//Markup to use for sub-menu indicators
		disableHI	: false,		// true disables hoverIntent detection
		//All Callbacks are passed the current superfish instance as an argument
		onInit		: function(){}, // Called on init, after plugin data initialized
		onAfterInit	: function(){}, // callback functions
		onBeforeShow: function(){}, //Passed the UL to be animated
		onShow		: function(){}, //Passed the UL just animated
		onBeforeHide: function(){},
		onHide		: function(){}
	};
	// Method calling logic
	$.fn.superfish = function(method) {
	    if ( sf.methods[method] ) {
	      return sf.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return sf.methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.superfish' );
	    }
	};
	sf.methods = {
			init: function  (opts) {
				return this.each(function() {
					//Set up local variables
					var _ = $(this),
					//Namespace instance data
					data = _.data('superfish'),
					o = $.extend({}, sf.defaults, opts);
					
					if (! data ) {
						//Initialize data
						var lis = _.find('li'); //Get all instance LI's
						var uls = lis.find('ul'); //Get all instance UL's
						_.data('superfish', {
							//Set namaspaced instance data
							target: _,
							timer: null,
							uls : uls, //Save all child UL dom nodes
							lis: lis,
							options: o
						});
						data = _.data('superfish');//make it easy for the rest of init()
					}
					//Sanity Checks
					//Check if jQuery.superfish has already been intitialized
					if (data.initialized) {
						if (typeof(console) != 'undefined') console.warn('superfish already initialized on',this);
						return this;
					}
					data.initialized = true;
					//Parse jquery strings for out speed
					if (typeof(o.speedOut) === 'string') o.speedOut = 600;
					if ($.browser.msie && (parseInt($.browser.version) <= 6)) return;//Degrade to CSS menus for IE6
					//make sure passed in element actually has submenus
					if (data.uls.length == 0 ) {
						if (typeof(console) != 'undefined') console.warn('no ul\'s found on parent menu item, exiting');
						return this;
					}
					//Add root menu CSS class
					_.addClass(sf.c.menuClass);
					//Call onInit Callback
					o.onInit.call(null,_);
					//Add Arrows
					if (o.autoArrows) {
						$('li:has(ul)',data.target).addClass(sf.c.anchorClass).children('A').append(o.arrow);
					}
					//Set all UL's to hidden
					data.uls.hide();
					data.lis.delegate('a','mouseenter mouseleave', function  (e) {
						//this is the event target, <a href="#"/>
						var $this = $(this),
						$li = $this.parent('li');
						$next = $li.children('UL').first();
						if (e.type == 'mouseenter') {
							//Clear Timeout
							clearTimeout(data.timer);
							//Clean up adjacent hover classes, but not the current xpath
							data.lis.not($li).not($li.parents()).removeClass(o.hoverClass);
							//Add hover class to current LI
							$li.addClass(o.hoverClass);
							//Find next UL and animate it
							if ($next.is(':hidden')) {
								o.onBeforeShow.call(null,$next); 
								$next.animate(o.animIn,o.speedIn,o.easeIn, function(){ 
									o.onShow.call(null,$next); 
								});
							}
						} else if (e.type == "mouseleave") {
							data.timer = setTimeout(function(){
								sf.methods.close(_);
							},o.delay);	
						} else {
							console.warn(' $(this), event.type', $(this), e.type);
						}
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					//@TODO
					if (o.pathClass !== sf.defaults.pathClass) {
						console.warn('@TODO pathClass enabled');
						$('li.'+o.pathClass,_).slice(0,o.pathLevels);
					}
					o.onAfterInit.call(null,_);
				});
				//End jQuery.each
			},
			//END INIT METHOD
			close: function  (elem) {
				//Handle API invoked method
				if (typeof(elem) == "undefined") var elem = $(this);
				return elem.each( function  () {
					var data  = elem.data('superfish'),
					o = data.options;
					o.onBeforeHide.call(null,elem);
					data.uls.animate(o.animOut,o.speedOut,o.easeOut, function(){
						o.onHide.call(null,$(this));
					});
					//Second timeout to run after animation is complete
					setTimeout( function  () {
						data.uls.hide();
						data.lis.removeClass(o.hoverClass);
					}, o.speedOut);			
				});
			},
			destroy: function  () {
				return this.each( function  () {
					if ($(this).data('superfish')) {
						var data = $(this).data('superfish'),
						o = data.options;
						data.target.removeClass(sf.c.menuClass);
						data.uls.removeAttr('style');
						if (o.autoArrows) {
							$('li:has(ul)',data.target).removeClass(sf.c.anchorClass);
							$("."+sf.c.subClass,data.target).remove();
						}
						data.lis.undelegate('a','mouseenter mouseleave');
						$(this).removeData('superfish');
					} else {
						if (typeof(console) !== "undefined") console.warn('Superfish not initialized on that dom element');
					}
				});
			}
	};
	//End Methods
})(jQuery);
=======
(function(b){var a={};a.c={menuClass:"sf-js-enabled",subClass:"sf-sub-indicator",anchorClass:"sf-with-ul"};a.defaults={hoverClass:"sfHover",pathClass:"overideThisToUse",pathLevels:1,delay:700,animIn:{opacity:"show"},animOut:{opacity:"hide"},easeIn:"swing",easeOut:"swing",speedIn:"normal",speedOut:"normal",autoArrows:true,arrow:'<span class="'+a.c.subClass+'">&#187;</span>',disableHI:false,onInit:function(){},onAfterInit:function(){},onBeforeShow:function(){},onShow:function(){},onBeforeHide:function(){},onHide:function(){}};b.fn.superfish=function(c){if(a.methods[c]){return a.methods[c].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof c==="object"||!c){return a.methods.init.apply(this,arguments)}else{b.error("Method "+c+" does not exist on jQuery.superfish")}}};a.methods={init:function(c){return this.each(function(){var e=b(this),g=e.data("superfish"),h=b.extend({},a.defaults,c);if(!g){var d=e.find("li");var f=d.find("ul");e.data("superfish",{target:e,timer:null,uls:f,lis:d,options:h});g=e.data("superfish")}if(g.initialized){if(typeof(console)!="undefined"){console.warn("superfish already initialized on",this)}return this}g.initialized=true;if(typeof(h.speedOut)==="string"){h.speedOut=600}if(b.browser.msie&&(parseInt(b.browser.version)<=6)){return}if(g.uls.length==0){if(typeof(console)!="undefined"){console.warn("no ul's found on parent menu item, exiting")}return this}e.addClass(a.c.menuClass);h.onInit.call(null,e);if(h.autoArrows){b("li:has(ul)",g.target).addClass(a.c.anchorClass).children("A").append(h.arrow)}g.uls.hide();g.lis.delegate("a","mouseenter mouseleave",function(j){var i=b(this),k=i.parent("li");$next=k.children("UL").first();if(j.type=="mouseenter"){clearTimeout(g.timer);g.lis.not(k).not(k.parents()).removeClass(h.hoverClass);k.addClass(h.hoverClass);if($next.is(":hidden")){h.onBeforeShow.call(null,$next);$next.animate(h.animIn,h.speedIn,h.easeIn,function(){h.onShow.call(null,$next)})}}else{if(j.type=="mouseleave"){g.timer=setTimeout(function(){a.methods.close(e)},h.delay)}else{console.warn(" $(this), event.type",b(this),j.type)}}j.preventDefault();j.stopPropagation();return false});if(h.pathClass!==a.defaults.pathClass){console.warn("@TODO pathClass enabled");b("li."+h.pathClass,e).slice(0,h.pathLevels)}h.onAfterInit.call(null,e)})},close:function(c){if(typeof(c)=="undefined"){var c=b(this)}return c.each(function(){var d=c.data("superfish"),e=d.options;e.onBeforeHide.call(null,c);d.uls.animate(e.animOut,e.speedOut,e.easeOut,function(){e.onHide.call(null,b(this))});setTimeout(function(){d.uls.hide();d.lis.removeClass(e.hoverClass)},e.speedOut)})},destroy:function(){return this.each(function(){if(b(this).data("superfish")){var c=b(this).data("superfish"),d=c.options;c.target.removeClass(a.c.menuClass);c.uls.removeAttr("style");if(d.autoArrows){b("li:has(ul)",c.target).removeClass(a.c.anchorClass);b("."+a.c.subClass,c.target).remove()}c.lis.undelegate("a","mouseenter mouseleave");b(this).removeData("superfish")}else{if(typeof(console)!=="undefined"){console.warn("Superfish not initialized on that dom element")}}})}}})(jQuery);
>>>>>>> gh-pages
