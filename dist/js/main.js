'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(parameters) {
        _classCallCheck(this, Player);

        this.state = {
            src: parameters.src,
            muted: parameters.muted,
            autoloop: parameters.autoloop,
            width: parameters.width,
            height: parameters.height,
            poster: parameters.poster,
            class: parameters.class
        };
        this.controls = {};
        this.init();
    }

    _createClass(Player, [{
        key: 'init',
        value: function init() {
            this.buildPlayer();
            this.buildToolbar();
            this.initControls();
        }
    }, {
        key: 'buildPlayer',
        value: function buildPlayer() {
            this.$video = document.createElement('video');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.state)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var attribute = _step.value;

                    this.state[attribute] !== undefined ? this.$video.setAttribute(attribute, this.state[attribute]) : '';
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.$player = document.createElement('div');
            this.$player.classList.add('player');
            this.$player.appendChild(this.$video);
            document.body.appendChild(this.$player);
        }
    }, {
        key: 'buildToolbar',
        value: function buildToolbar() {
            /**
             * Seekbar
             */
            this.$seekbar = document.createElement('div');
            this.$seekbar.classList.add('player__seekbar');
            this.$player.appendChild(this.$seekbar);

            this.$seekbarFiller = document.createElement('div');
            this.$seekbarFiller.classList.add('filler');
            this.$seekbar.appendChild(this.$seekbarFiller);

            /**
             * Seekbar Thumbnail
             */

            this.$seekbarThumbnail = document.createElement('video');
            this.$seekbarThumbnail.classList.add('player__seekbar__thumbnail');
            this.$seekbar.appendChild(this.$seekbarThumbnail);
            this.$seekbarThumbnail.src = this.state.src;

            /**
             * Controls container
             */
            this.controls.$toolbar = document.createElement('div');
            this.controls.$toolbar.classList.add('player__toolbar');
            this.$player.appendChild(this.controls.$toolbar);

            /**
             * Time display
             */
            this.controls.$timeDisplay = document.createElement('p');
            this.controls.$timeDisplay.classList.add('player__toolbar__time-display');
            this.controls.$toolbar.appendChild(this.controls.$timeDisplay);

            /**
             * Play button
             */
            this.controls.$playpauseButton = document.createElement('button');
            this.controls.$playpauseButton.textContent = 'Play';
            this.controls.$playpauseButton.classList.add('player__toolbar__playpause-button');
            this.controls.$toolbar.appendChild(this.controls.$playpauseButton);

            /**
             * Volume
             */

            this.controls.volume = {};

            this.controls.volume.$container = document.createElement('div');
            this.controls.volume.$container.classList.add('player__toolbar__volume-container');
            this.controls.$toolbar.appendChild(this.controls.volume.$container);

            this.controls.volume.$muteButton = document.createElement('button');
            this.controls.volume.$muteButton.textContent = 'Mute';
            this.controls.volume.$muteButton.classList.add('player__toolbar__mute-button');
            this.controls.volume.$container.appendChild(this.controls.volume.$muteButton);

            this.controls.volume.$slider = document.createElement('div');
            this.controls.volume.$slider.classList.add('player__toolbar__volume-container__volume-slider');
            this.controls.volume.$sliderFiller = document.createElement('div');
            this.controls.volume.$sliderFiller.classList.add('filler');
            this.controls.volume.$slider.appendChild(this.controls.volume.$sliderFiller);
            this.controls.volume.$container.appendChild(this.controls.volume.$slider);

            /**
             * Fullscreen
             */

            this.controls.$fullscreenButton = document.createElement('button');
            this.controls.$fullscreenButton.classList.add('player__toolbar__fullscreen-button');
            this.controls.$fullscreenButton.textContent = 'Full Screen';
            this.controls.$toolbar.appendChild(this.controls.$fullscreenButton);
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this = this;

            /**
             * Seekbar running
             */

            var seekbarRun = function seekbarRun() {
                var playedRatio = _this.$video.currentTime / _this.$video.duration;
                _this.$seekbarFiller.style.transform = 'scaleX(' + playedRatio + ')';
                window.requestAnimationFrame(seekbarRun);
            };
            seekbarRun();

            /**
             * Seekbar interaction
             */
            var seekbarRect = this.$seekbar.getBoundingClientRect();

            //Time movement
            var isSeekbarClicked = false;
            this.$seekbar.addEventListener('mousedown', function (e) {
                isSeekbarClicked = true;
                var clickedTime = Math.floor((e.clientX - seekbarRect.left) / seekbarRect.width * _this.$video.duration);
                _this.$video.currentTime = clickedTime;
            });
            window.addEventListener('mousemove', function (e) {
                if (isSeekbarClicked) {
                    var time = Math.floor((e.clientX - seekbarRect.left) / seekbarRect.width * _this.$video.duration);
                    time > _this.$video.duration ? time = _this.$video.duration : '';
                    time < 0 ? time = 0 : '';
                    _this.$video.currentTime = time;
                }
            });
            window.addEventListener('mouseup', function () {
                isSeekbarClicked = false;
            });

            //Thumbnail
            this.$seekbar.addEventListener('mousemove', function (e) {
                var xPosition = e.clientX - seekbarRect.left;
                var time = Math.floor(xPosition / seekbarRect.width * _this.$video.duration);

                _this.$seekbarThumbnail.currentTime = time;
                _this.$seekbarThumbnail.style.transform = 'translateX(' + xPosition + 'px)';
            });

            /**
             * Time Display
             */
            var displayCurrentTime = function displayCurrentTime() {
                var timeElapsed = new Date(null);
                timeElapsed.setSeconds(Math.floor(_this.$video.currentTime));
                var totalTime = new Date(null);
                var duration = _this.$video.duration ? _this.$video.duration : 0;

                totalTime.setSeconds(Math.floor(duration));

                _this.controls.$timeDisplay.textContent = timeElapsed.toISOString().substr(14, 5) + ' / ' + totalTime.toISOString().substr(14, 5);
                window.requestAnimationFrame(displayCurrentTime);
            };
            displayCurrentTime();

            /**
             * 
             * Play and pause on video click
             */

            this.$video.addEventListener('click', function () {
                _this.doPlayPause();
            });

            /**
             * 
             * Play and pause on button click
             */

            this.controls.$playpauseButton.addEventListener('click', function () {
                _this.doPlayPause();
            });

            /**
             * Handle Volume
             */

            //Muting
            this.controls.volume.$muteButton.addEventListener('click', function () {
                _this.mute();
            });

            //Volume slider
            var volumeSliderRect = this.controls.volume.$slider.getBoundingClientRect();

            var isSliderClicked = false;
            this.controls.volume.$slider.addEventListener('mousedown', function (e) {
                isSliderClicked = true;
                var ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width;
                _this.controls.volume.$sliderFiller.style.transform = 'scaleX(' + ratio + ')';
                _this.$video.volume = ratio;
            });
            window.addEventListener('mouseup', function () {
                _this.controls.volume.$sliderFiller.style.transition = 'transform .3s';
                isSliderClicked = false;
            });
            window.addEventListener('mousemove', function (e) {
                if (isSliderClicked) {
                    _this.controls.volume.$sliderFiller.style.transition = 'none';
                    var ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width;
                    ratio > 1 ? ratio = 1 : '';
                    ratio < 0 ? ratio = 0 : '';
                    _this.controls.volume.$sliderFiller.style.transform = 'scaleX(' + ratio + ')';
                    _this.$video.volume = ratio;
                }
            });

            /**
             * Handle Fullscreen
             */

            var isFullScreen = false;
            this.controls.$fullscreenButton.addEventListener('click', function () {
                isFullScreen = _this.goFullscreen(isFullScreen);
            });
        }
    }, {
        key: 'doPlayPause',
        value: function doPlayPause() {
            this.$video.paused ? this.$video.play() : this.$video.pause();
        }
    }, {
        key: 'mute',
        value: function mute() {
            if (this.$video.muted) {
                this.$video.muted = false;
                this.controls.volume.$sliderFiller.style.transform = 'scaleX(' + this.$video.volume + ')';
            } else {
                this.$video.muted = true;
                this.controls.volume.$sliderFiller.style.transform = 'scaleX(0)';
            }
        }
    }, {
        key: 'goFullscreen',
        value: function goFullscreen(isFullScreen) {
            isFullScreen ? document.webkitExitFullscreen() : this.$player.webkitRequestFullScreen();
            return !isFullScreen;
        }
    }]);

    return Player;
}();
"use strict";

var player = new Player({
    src: "videos/video.mp4",
    muted: false,
    autoloop: false,
    poster: "videos/poster.png",
    class: "video-player"
});
// const textInput = document.querySelector('#playlistName')
// const $playlistContainer = document.querySelector('.playlists')
// const $savedListsContainer = document.querySelector('.saved-playlists ul')
// let playlistIndex = 0
// let playlists = localStorage.getItem('playlists') ? JSON.parse(localStorage.getItem('playlists')) : {}

// for (const list of Object.keys(playlists)) {
//     let $list = document.createElement('li')
//     $list.innerHTML = playlists[list].name
//     $savedListsContainer.appendChild($list)
// }

// textInput.addEventListener('change',()=>
// {
//     let listName = textInput.value
//     if(listName !== ''){
//         addNewList(listName)
//         playlists[listName] = {}
//         playlists[listName].name = listName
//         localStorage.setItem('playlists',JSON.stringify(playlists))
//         updateDisplayedPlaylists(listName)

//     }
// })

// const addNewList = (name)=>
// {
//     playlistIndex++
//     let newList = document.createElement('div');
//     newList.classList.add('playlist')
//     let check = document.createElement('input')
//     check.setAttribute('type','checkbox')
//     check.setAttribute('id', `playlist${playlistIndex}`)
//     check.checked = true
//     newList.appendChild(check)
//     let label = document.createElement('label')
//     label.setAttribute('for', `playlist${playlistIndex}`)
//     label.innerHTML = name
//     newList.appendChild(label)

//     $playlistContainer.appendChild(newList)
// }

// const updateDisplayedPlaylists = (list)=>{
//     let $list = document.createElement('li');
//     $list.innerHTML = playlists[list].name;
//     $savedListsContainer.appendChild($list);
// }
"use strict";