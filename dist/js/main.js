'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(parameters) {
        _classCallCheck(this, Player);

        this.video = {
            title: parameters.title,
            attributes: {
                src: parameters.attributes.src,
                muted: parameters.attributes.muted,
                autoloop: parameters.attributes.autoloop,
                width: parameters.attributes.width,
                height: parameters.attributes.height,
                poster: parameters.attributes.poster,
                class: parameters.attributes.class
            }
        };
        this.$container = document.querySelector(parameters.container);
        this.controls = {};
        this.seekbar = {};
        this.isFullScreen = false;
        this.init();
    }

    _createClass(Player, [{
        key: 'init',
        value: function init() {
            this.buildPlayer();
            this.buildToolbar();
            this.initControls();
            this.initKeyboardControls();
        }
    }, {
        key: 'buildPlayer',
        value: function buildPlayer() {
            this.video.$video = document.createElement('video');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.video.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var attribute = _step.value;

                    this.video.attributes[attribute] !== undefined ? this.video.$video.setAttribute(attribute, this.video.attributes[attribute]) : '';
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
            this.$player.appendChild(this.video.$video);
            this.$container.appendChild(this.$player);
        }
    }, {
        key: 'buildToolbar',
        value: function buildToolbar() {
            /**
             * Play pause icon in the center
             */
            this.$stateIcon = document.createElement('i');
            this.$stateIcon.classList.add('player__state-icon');
            this.$stateIcon.classList.add('fas');
            this.$stateIcon.classList.add('fa-pause');
            this.$player.appendChild(this.$stateIcon);

            /**
             * Title bar
             */
            this.$titlebar = document.createElement('h3');
            this.$titlebar.classList.add('player__titlebar');
            this.$titlebar.textContent = this.video.title;
            this.$player.appendChild(this.$titlebar);

            /**
             * Seekbar
             */
            this.seekbar.$seekbar = document.createElement('div');
            this.seekbar.$seekbar.classList.add('player__seekbar');
            this.$player.appendChild(this.seekbar.$seekbar);

            this.seekbar.$seekbarFiller = document.createElement('div');
            this.seekbar.$seekbarFiller.classList.add('filler');
            this.seekbar.$seekbar.appendChild(this.seekbar.$seekbarFiller);

            this.seekbar.$seekbarDragger = document.createElement('div');
            this.seekbar.$seekbarDragger.classList.add('dragger');
            this.seekbar.$seekbar.appendChild(this.seekbar.$seekbarDragger);

            /**
             * Seekbar Thumbnail
             */

            this.seekbar.$seekbarThumbnail = document.createElement('video');
            this.seekbar.$seekbarThumbnail.classList.add('player__seekbar__thumbnail');
            this.seekbar.$seekbar.appendChild(this.seekbar.$seekbarThumbnail);
            this.seekbar.$seekbarThumbnail.src = this.video.attributes.src;

            /**
             * Controls container
             */
            this.controls.$toolbar = document.createElement('div');
            this.controls.$toolbar.classList.add('player__toolbar');
            this.$player.appendChild(this.controls.$toolbar);

            /**
             * Play button
             */
            this.controls.$playpauseButton = document.createElement('button');
            this.controls.$playpauseButton.classList.add('player__toolbar__playpause-button');
            this.controls.$playpauseButton.classList.add('fas');
            this.controls.$playpauseButton.classList.add('fa-play');
            this.controls.$toolbar.appendChild(this.controls.$playpauseButton);

            /**
             * Time display
             */
            this.controls.$timeDisplay = document.createElement('p');
            this.controls.$timeDisplay.classList.add('player__toolbar__time-display');
            this.controls.$toolbar.appendChild(this.controls.$timeDisplay);
            /**
             * Volume
             */

            this.controls.volume = {};

            this.controls.volume.$container = document.createElement('div');
            this.controls.volume.$container.classList.add('player__toolbar__volume-container');
            this.controls.$toolbar.appendChild(this.controls.volume.$container);

            this.controls.volume.$muteButton = document.createElement('button');
            this.controls.volume.$muteButton.classList.add('player__toolbar__mute-button');
            this.controls.volume.$muteButton.classList.add('fas');
            this.controls.volume.$muteButton.classList.add('fa-volume-up');
            this.controls.volume.$container.appendChild(this.controls.volume.$muteButton);

            this.controls.volume.$slider = document.createElement('div');
            this.controls.volume.$slider.classList.add('player__toolbar__volume-container__volume-slider');
            this.controls.volume.$sliderFiller = document.createElement('div');
            this.controls.volume.$sliderFiller.classList.add('filler');
            this.controls.volume.$slider.appendChild(this.controls.volume.$sliderFiller);
            this.controls.volume.$sliderDragger = document.createElement('div');
            this.controls.volume.$sliderDragger.classList.add('dragger');
            this.controls.volume.$slider.appendChild(this.controls.volume.$sliderDragger);

            this.controls.volume.$container.appendChild(this.controls.volume.$slider);

            /**
             * Fullscreen
             */

            this.controls.$fullscreenButton = document.createElement('button');
            this.controls.$fullscreenButton.classList.add('player__toolbar__fullscreen-button');
            this.controls.$fullscreenButton.classList.add('fas');
            this.controls.$fullscreenButton.classList.add('fa-expand');
            this.controls.$toolbar.appendChild(this.controls.$fullscreenButton);
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this = this;

            /**
             * Tool and seekbar fading in and out on mouse hover
             */

            this.$player.addEventListener('mouseleave', function () {
                if (!_this.video.$video.paused) {
                    _this.controls.$toolbar.style.transitionDelay = '0.5s';
                    _this.seekbar.$seekbar.style.transitionDelay = '0.5s';
                    _this.$titlebar.style.transitionDelay = '0.5s';
                    _this.controls.$toolbar.style.opacity = '0';
                    _this.seekbar.$seekbar.style.opacity = '0';
                    _this.$titlebar.style.opacity = '0';
                }
            });
            this.$player.addEventListener('mouseenter', function () {
                _this.controls.$toolbar.style.transitionDelay = '0s';
                _this.seekbar.$seekbar.style.transitionDelay = '0s';
                _this.$titlebar.style.transitionDelay = '0s';
                _this.controls.$toolbar.style.opacity = '1';
                _this.seekbar.$seekbar.style.opacity = '1';
                _this.$titlebar.style.opacity = '1';
            });
            this.$player.addEventListener('mousemove', function () {
                _this.controls.$toolbar.style.transitionDelay = '0s';
                _this.seekbar.$seekbar.style.transitionDelay = '0s';
                _this.$titlebar.style.transitionDelay = '0s';
                _this.controls.$toolbar.style.opacity = '1';
                _this.seekbar.$seekbar.style.opacity = '1';
                _this.$titlebar.style.opacity = '1';
            });

            /**
             * Seekbar running
             */
            var seekbarRect = this.seekbar.$seekbar.getBoundingClientRect();
            window.addEventListener('resize', function () {
                seekbarRect = _this.seekbar.$seekbar.getBoundingClientRect();
            });

            var seekbarRun = function seekbarRun() {
                var playedRatio = _this.video.$video.currentTime / _this.video.$video.duration;
                _this.seekbar.$seekbarFiller.style.transform = 'scaleX(' + playedRatio + ')';
                _this.seekbar.$seekbarDragger.style.transform = 'translateX(' + playedRatio * seekbarRect.width + 'px)';
                window.requestAnimationFrame(seekbarRun);
            };
            seekbarRun();

            /**
             * Seekbar interaction
             */

            //Time movement
            var isSeekbarClicked = false;
            this.seekbar.$seekbar.addEventListener('mousedown', function (e) {
                isSeekbarClicked = true;
                var clickedTime = Math.floor((e.clientX - seekbarRect.left) / seekbarRect.width * _this.video.$video.duration);
                _this.video.$video.currentTime = clickedTime;
            });
            window.addEventListener('mousemove', function (e) {
                if (isSeekbarClicked) {
                    var time = Math.floor((e.clientX - seekbarRect.left) / seekbarRect.width * _this.video.$video.duration);
                    time > _this.video.$video.duration ? time = _this.video.$video.duration : '';
                    time < 0 ? time = 0 : '';
                    _this.video.$video.currentTime = time;
                }
            });
            window.addEventListener('mouseup', function () {
                isSeekbarClicked = false;
            });

            //Thumbnail
            this.seekbar.$seekbar.addEventListener('mousemove', function (e) {
                var xPosition = e.clientX - seekbarRect.left;
                var time = Math.floor(xPosition / seekbarRect.width * _this.video.$video.duration);

                _this.seekbar.$seekbarThumbnail.currentTime = time;
                _this.seekbar.$seekbarThumbnail.style.transform = 'translateX(' + xPosition + 'px)';
            });

            /**
             * Time Display
             */
            var displayCurrentTime = function displayCurrentTime() {
                var timeElapsed = new Date(null);
                timeElapsed.setSeconds(Math.floor(_this.video.$video.currentTime));
                var totalTime = new Date(null);
                var duration = _this.video.$video.duration ? _this.video.$video.duration : 0;

                totalTime.setSeconds(Math.floor(duration));

                _this.controls.$timeDisplay.textContent = timeElapsed.toISOString().substr(14, 5) + ' / ' + totalTime.toISOString().substr(14, 5);
                window.requestAnimationFrame(displayCurrentTime);
            };
            displayCurrentTime();

            /**
             * 
             * Play and pause on video click
             */

            this.video.$video.addEventListener('click', function () {
                _this.doPlayPause();
            });

            /**
             * HAndle click on icon
             */
            this.$stateIcon.addEventListener('click', function () {
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
            window.addEventListener('resize', function () {
                volumeSliderRect = _this.controls.volume.$slider.getBoundingClientRect();
            });

            var volumeDraggerPosition = function volumeDraggerPosition() {
                if (_this.video.$video.muted) {
                    _this.controls.volume.$sliderDragger.style.transform = 'translateX(0)';
                } else {
                    _this.controls.volume.$sliderDragger.style.transform = 'translateX(' + _this.video.$video.volume * volumeSliderRect.width + 'px)';
                }
                window.requestAnimationFrame(volumeDraggerPosition);
            };
            volumeDraggerPosition();

            var isSliderClicked = false;
            this.controls.volume.$slider.addEventListener('mousedown', function (e) {
                isSliderClicked = true;
                var ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width;
                ratio > 1 ? ratio = 1 : '';
                ratio < 0 ? ratio = 0 : '';

                if (ratio === 0) {
                    _this.controls.volume.$muteButton.classList.remove('fa-volume-down');
                    _this.controls.volume.$muteButton.classList.remove('fa-volume-up');
                    _this.controls.volume.$muteButton.classList.add('fa-volume-mute');
                } else if (ratio < 0.5) {
                    _this.controls.volume.$muteButton.classList.remove('fa-volume-up');
                    _this.controls.volume.$muteButton.classList.remove('fa-volume-mute');
                    _this.controls.volume.$muteButton.classList.add('fa-volume-down');
                } else {
                    _this.controls.volume.$muteButton.classList.remove('fa-volume-down');
                    _this.controls.volume.$muteButton.classList.remove('fa-volume-mute');
                    _this.controls.volume.$muteButton.classList.add('fa-volume-up');
                    _this.video.$video.muted = false;
                }
                _this.controls.volume.$sliderFiller.style.transform = 'scaleX(' + ratio + ')';
                _this.video.$video.volume = ratio;
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
                    if (ratio === 0) {
                        _this.controls.volume.$muteButton.classList.remove('fa-volume-down');
                        _this.controls.volume.$muteButton.classList.add('fa-volume-mute');
                    } else if (ratio < 0.5) {
                        _this.controls.volume.$muteButton.classList.remove('fa-volume-up');
                        _this.controls.volume.$muteButton.classList.remove('fa-volume-mute');
                        _this.controls.volume.$muteButton.classList.add('fa-volume-down');
                    } else {
                        _this.controls.volume.$muteButton.classList.remove('fa-volume-down');
                        _this.controls.volume.$muteButton.classList.add('fa-volume-up');
                        _this.video.$video.muted = false;
                    }
                    _this.controls.volume.$sliderFiller.style.transform = 'scaleX(' + ratio + ')';
                    _this.video.$video.volume = ratio;
                }
            });

            /**
             * Handle Fullscreen
             */

            this.controls.$fullscreenButton.addEventListener('click', function () {
                _this.goFullscreen();
            });
            this.video.$video.addEventListener('dblclick', function () {
                _this.goFullscreen();
            });
        }
    }, {
        key: 'initKeyboardControls',
        value: function initKeyboardControls() {
            var _this2 = this;

            document.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case 75:
                        _this2.doPlayPause();
                        break;
                    case 76:
                        _this2.video.$video.currentTime + 10 < _this2.video.$video.duration ? _this2.video.$video.currentTime += 10 : _this2.video.$video.currentTime = _this2.video.$video.duration;
                        break;
                    case 74:
                        _this2.video.$video.currentTime - 10 > 0 ? _this2.video.$video.currentTime -= 10 : _this2.video.$video.currentTime = 0;
                        break;
                    case 77:
                        _this2.mute();
                        break;
                    case 70:
                        _this2.goFullscreen();
                        break;
                }
            });
        }
    }, {
        key: 'doPlayPause',
        value: function doPlayPause() {
            var _this3 = this;

            if (this.video.$video.paused) {
                this.video.$video.play();
                this.controls.$toolbar.style.transitionDelay = '0.5s';
                this.seekbar.$seekbar.style.transitionDelay = '0.5s';
                this.$titlebar.style.transitionDelay = '0.5s';
                this.controls.$toolbar.style.opacity = '0';
                this.seekbar.$seekbar.style.opacity = '0';
                this.$titlebar.style.opacity = '0';
            } else {
                this.video.$video.pause();
                this.controls.$toolbar.style.transitionDelay = '0s';
                this.seekbar.$seekbar.style.transitionDelay = '0s';
                this.$titlebar.style.transitionDelay = '0s';
                this.controls.$toolbar.style.opacity = '1';
                this.seekbar.$seekbar.style.opacity = '1';
                this.$titlebar.style.opacity = '1';
            }
            this.controls.$playpauseButton.classList.toggle('fa-play');
            this.controls.$playpauseButton.classList.toggle('fa-pause');
            this.$stateIcon.classList.toggle('fa-play');
            this.$stateIcon.classList.toggle('fa-pause');
            this.$stateIcon.classList.add('showing');
            window.setTimeout(function () {
                _this3.$stateIcon.classList.remove('showing');
            }, 700);
        }
    }, {
        key: 'mute',
        value: function mute() {
            if (this.video.$video.muted) {
                this.controls.volume.$muteButton.classList.remove('fa-volume-mute');
                this.video.$video.volume < 0.5 ? this.controls.volume.$muteButton.classList.add('fa-volume-down') : this.controls.volume.$muteButton.classList.add('fa-volume-up');
                this.video.$video.muted = false;
                this.controls.volume.$sliderFiller.style.transform = 'scaleX(' + this.video.$video.volume + ')';
            } else {
                this.controls.volume.$muteButton.classList.add('fa-volume-mute');
                this.video.$video.volume < 0.5 ? this.controls.volume.$muteButton.classList.remove('fa-volume-down') : this.controls.volume.$muteButton.classList.remove('fa-volume-up');
                this.video.$video.muted = true;
                this.controls.volume.$sliderFiller.style.transform = 'scaleX(0)';
            }
        }
    }, {
        key: 'goFullscreen',
        value: function goFullscreen() {
            this.controls.$fullscreenButton.classList.toggle('fa-expand');
            this.controls.$fullscreenButton.classList.toggle('fa-compress');
            this.isFullScreen ? document.webkitExitFullscreen() : this.$player.webkitRequestFullScreen();
            this.controls.$toolbar.style.transitionDelay = '0.5s';
            this.seekbar.$seekbar.style.transitionDelay = '0.5s';
            this.$titlebar.style.transitionDelay = '0.5s';
            this.controls.$toolbar.style.opacity = '0';
            this.seekbar.$seekbar.style.opacity = '0';
            this.$titlebar.style.opacity = '0';
            this.isFullScreen = !this.isFullScreen;
        }
    }]);

    return Player;
}();
"use strict";

var player = new Player({
    title: "Death Stranding : Trailer",
    attributes: {
        src: "videos/video.mp4",
        muted: false,
        autoloop: false,
        poster: "videos/poster.png",
        class: "video-player"
    },
    container: ".container"
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