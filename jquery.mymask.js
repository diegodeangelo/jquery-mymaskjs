// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		if (!jQuery().mask) throw new Error("O plugin Jquery Mask não foi carregado!");

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "mymask",
			defaults = {
				
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				$(this.element).find('input[data-type]').each(function(i, el){
					var data_type = $(el).data('type');
					var myMask = {};

					if (data_type.type) {
						myMask = data_type
					} else {
						myMask.type = data_type
					}

					if (myMask.onComplete) {
						var options = {
							onComplete: window[myMask.onComplete]
						}
					} else {
						var options = {}
					}

					if (myMask.type) {
						switch (myMask.type) {
							case "cpf":
								options.reverse = true;
								options.placeholder = "___.___.___-__";

								$(el).mask('000.000.000-00', options);
							break;
							case "cnpj":
								options.reverse = true;
								options.placeholder = "__.___.___/____-__";

  								$(el).mask('00.000.000/0000-00', options);
							break;
							case "cep":
								options.placeholder = "_____-___";

								$(el).mask('00000-000', options);
							break;
							case "data":
								options.placeholder = "__/__/____";

								$(el).mask('00/00/0000', options);
							break;
							case "telefone":
								options.placeholder = "(__) ____-____";

								$(el).mask("(00) 0000-0000", options);
							break;
							case "celular":
								var SPMaskBehavior = function(val) {
								  return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
								};

								options.onKeyPress = function(val, e, field, options) {
								      field.mask(SPMaskBehavior.apply({}, arguments), options);
								}
								
								options.placeholder = "(__) _____-____";

								$(el).mask(SPMaskBehavior, options);
							break;
							case "email":
								options.translation = {
							        "A": { pattern: /[\w@\-.+]/, recursive: true }
							    }

								$(el).mask("A", options);
							break;
						}
					}
				});
			}
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );