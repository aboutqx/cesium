/*global define*/
define(['../createCommand',
        '../../Core/defaultValue',
        '../../Core/Fullscreen',
        '../../ThirdParty/knockout'
        ], function(
            createCommand,
            defaultValue,
            Fullscreen,
            knockout) {
    "use strict";

    /**
     * The ViewModel for {@link FullscreenButton}.
     * @alias FullscreenButtonViewModel
     * @constructor
     *
     * @param {Element} [fullscreenElement=document.body] The element to be placed into fullscreen mode.
     */
    var FullscreenButtonViewModel = function(fullscreenElement) {
        var that = this;
        var isFullscreen = knockout.observable(Fullscreen.isFullscreen());
        var tmp = knockout.observable(Fullscreen.isFullscreenEnabled());
        var isFullscreenEnabled = knockout.computed({
            read : function() {
                return tmp();
            },
            write : function(value) {
                tmp(value && Fullscreen.isFullscreenEnabled());
            }
        });

        /**
         * Gets a writable observable indicating if fullscreen functionality should be available.
         * @type Observable
         *
         * @see Fullscreen.isFullscreenEnabled
         */
        this.isFullscreenEnabled = isFullscreenEnabled;

        /**
         * Gets a writable observable indicating if fullscreen mode is activated.
         * @type Observable
         */
        this.toggled = isFullscreen;

        /**
         * Gets the command for toggling fullscreen mode.
         * @type Command
         */
        this.command = createCommand(function() {
            if (Fullscreen.isFullscreen()) {
                Fullscreen.exitFullscreen();
            } else {
                Fullscreen.requestFullscreen(that.fullscreenElement());
            }
        }, isFullscreenEnabled);

        /**
         * Gets a readonly observable of the current button tooltip.
         * @type Observable
         */
        this.tooltip = knockout.computed(function() {
            if (!isFullscreenEnabled()) {
                return 'Full screen unavailable';
            }
            return isFullscreen() ? 'Exit full screen' : 'Full screen';
        });

        /**
         * Gets a writable observable whose value is the HTML element to place
         * into fullscreen mode when the corresponding button is pressed.
         * By default, the entire page will enter fullscreen. By specifying
         * another container, only that container will be in fullscreen.
         *
         * @type {Observable}
         */
        this.fullscreenElement = knockout.observable(defaultValue(fullscreenElement, document.body));

        this._callback = function() {
            isFullscreen(Fullscreen.isFullscreen());
        };
        document.addEventListener(Fullscreen.getFullscreenChangeEventName(), this._callback);
    };

    /**
     * Destroys the view model.  Should be called to
     * properly clean up the view model when it is no longer needed.
     * @memberof FullscreenButtonViewModel
     */
    FullscreenButtonViewModel.prototype.destroy = function() {
        document.removeEventListener(Fullscreen.getFullscreenChangeEventName(), this._callback);
    };

    return FullscreenButtonViewModel;
});
