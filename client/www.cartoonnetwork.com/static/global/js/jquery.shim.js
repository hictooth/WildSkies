/**
 * Creates an iFrame shim behind the given elements to allow them to appear on
 * top of non-windowed elements (flash)
 * 
 * @function shim
 * @param options
 * @author rbridges
 * @ rfaraj 10/13/2001 - refactored to get all css properties on one go
 */
(function($){
	
	$.fn.shim = function(options){
		if(window.playerWindowMode !== 'transparent' && !$.browser.mozilla) {
		  /**added for IE8 browser to have z-index property 
		   *otherwise it's value was blank - emangor		   
		   */
		  if (document.all && document.querySelector && !document.addEventListener) {
            var props = [ 'display', 'position', 'top', 'bottom', 'left', 'right', 
				              'zIndex', 'filter', 'opacity' ];			  
		  } else {
			  var props = [ 'display', 'position', 'top', 'bottom', 'left', 'right', 
				              'z-index', 'filter', 'opacity' ];
		  }
			this.each(function(){
			  
				var element = $(this),
			      iframe = element.prev('.shim').first(),
				    cloneCss = {
				      background : 'black',
				      //background : 'transparent',
				      width : element.outerWidth() + 'px',
					  height : element.outerHeight() + 'px'
				    }, 
				    style;
				    
        if( document.defaultView && document.defaultView.getComputedStyle ){ // W3C (same as window.getComputedStyle)
          style = document.defaultView.getComputedStyle( element[ 0 ], null );
          $.each( props, function W3CCurrentStyle( index, val ) {
            cloneCss[ val ] = style.getPropertyValue( val );
          });
			  } else if( style = element[ 0 ].currentStyle ) {
			    $.each( props, function IECurrentStyle( index, val ) {   			
            cloneCss[ val ] = Object.prototype.hasOwnProperty.call( style, val ) ? style[val] : '';
          });
			  } else { // catch all to use jQuery css call foreach prop
          $.each( props, function DefaultCurrentStyle( index, val ) {
            cloneCss[ val ] = element.css( val );
          });
        }
				
				if( ! iframe || iframe.length === 0 ) {
					iframe = $('<iframe class="shim" frameborder="0" />').appendTo( element.parent() );
				}
				
				iframe.css(cloneCss);
				element.before(iframe);
			});
		}
		return this;
	};
	/**
	 * removes a shim
	 * 
	 * @function unshim
	 * @author rbridges
	 */
	$.fn.unshim = function(){
		this.each(function(){
			$(this).prev(".shim").remove();
		});
		return this;
	};
})(jQuery);
