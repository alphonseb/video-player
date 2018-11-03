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
        this.init();
    }

    _createClass(Player, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.buildPlayer();
            this.$video.addEventListener('click', function () {
                _this.doPlayPause();
            });
            this.buildToolBar();
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

            var $container = document.createElement('div');
            $container.classList.add('player');
            $container.appendChild(this.$video);
            document.body.appendChild($container);
        }
    }, {
        key: 'doPlayPause',
        value: function doPlayPause() {
            this.$video.paused ? this.$video.play() : this.$video.pause();
        }
    }, {
        key: 'buildToolBar',
        value: function buildToolBar() {
            var _this2 = this;

            this.$toolBar = document.createElement('div');
            this.$toolBar.classList.add('player__toolbar');
            this.$video.parentNode.appendChild(this.$toolBar);

            var $playpauseButton = document.createElement('button');
            $playpauseButton.textContent = 'Play';
            $playpauseButton.classList.add('player__toolbar__playpause-button');
            this.$toolBar.appendChild($playpauseButton);
            $playpauseButton.addEventListener('click', function () {
                _this2.doPlayPause();
            });

            var $volumeContainer = document.createElement('div');
            $volumeContainer.classList.add('player__toolbar__volume-container');
            this.$toolBar.appendChild($volumeContainer);

            var $muteButton = document.createElement('button');
            $muteButton.textContent = 'Mute';
            $muteButton.classList.add('player__toolbar__mute-button');
            $volumeContainer.appendChild($muteButton);
            $muteButton.addEventListener('click', function () {
                if (_this2.$video.muted) {
                    _this2.$video.muted = false;
                    $volumeSliderFiller.style.transform = 'scaleX(' + _this2.$video.volume + ')';
                } else {
                    _this2.$video.muted = true;
                    $volumeSliderFiller.style.transform = 'scaleX(0)';
                }
            });

            var $volumeSlider = document.createElement('div');
            $volumeSlider.classList.add('player__toolbar__volume-container__volume-slider');
            var $volumeSliderFiller = document.createElement('div');
            $volumeSliderFiller.classList.add('filler');
            $volumeSlider.appendChild($volumeSliderFiller);
            $volumeContainer.appendChild($volumeSlider);

            var volumeSliderRect = $volumeSlider.getBoundingClientRect();

            var isSliderClicked = false;
            $volumeSlider.addEventListener('mousedown', function (e) {
                isSliderClicked = true;
                var ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width;
                $volumeSliderFiller.style.transform = 'scaleX(' + ratio + ')';
                _this2.$video.volume = ratio;
            });
            window.addEventListener('mouseup', function () {
                $volumeSliderFiller.style.transition = 'transform .3s';
                isSliderClicked = false;
            });
            window.addEventListener('mousemove', function (e) {
                if (isSliderClicked) {
                    $volumeSliderFiller.style.transition = 'none';
                    var ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width;
                    ratio > 1 ? ratio = 1 : '';
                    ratio < 0 ? ratio = 0 : '';
                    $volumeSliderFiller.style.transform = 'scaleX(' + ratio + ')';
                    _this2.$video.volume = ratio;
                }
            });

            var $fullscreenButton = document.createElement('button');
            $fullscreenButton.classList.add('player__toolbar__fullscreen-button');
            $fullscreenButton.textContent = 'Full Screen';
            this.$toolBar.appendChild($fullscreenButton);
            var isFullScreen = false;
            $fullscreenButton.addEventListener('click', function () {
                if (isFullScreen) {
                    document.webkitExitFullscreen();
                    isFullScreen = false;
                } else {
                    isFullScreen = true;
                    _this2.$video.parentNode.webkitRequestFullScreen();
                }
            });
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