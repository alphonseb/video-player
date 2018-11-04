class Player{

    constructor(parameters){
        this.video = {
            title: parameters.title !== undefined ? parameters.title : '',
            attributes: {
                src: parameters.attributes.src,
                muted: parameters.attributes.muted,
                autoloop: parameters.attributes.autoloop,
                width: parameters.attributes.width,
                height: parameters.attributes.height,
                poster: parameters.attributes.poster,
                class: parameters.attributes.class
            }
        }
        this.$container = document.querySelector(parameters.container) ? document.querySelector(parameters.container) : document.body
        this.controls = {}
        this.seekbar = {}
        this.isFullScreen = false
        this.keyboardControls = parameters.keyboard !== undefined ? parameters.keyboard : false 
        this.init()   
    }

    init(){
        this.buildPlayer()
        this.buildToolbar()
        this.initControls()
        if (this.keyboardControls) {
            this.initKeyboardControls()
        }
    }
    
    buildPlayer(){
        this.video.$video = document.createElement('video')
        for (const attribute of Object.keys(this.video.attributes)) {
            this.video.attributes[attribute] !== undefined ? this.video.$video.setAttribute(attribute, this.video.attributes[attribute]) : ''
        }
        this.$player = document.createElement('div')
        this.$player.classList.add('player')
        this.$player.appendChild(this.video.$video)
        this.$container.appendChild(this.$player)       
    }

    buildToolbar(){
        /**
         * Play pause icon in the center
         */
        this.$stateIcon = document.createElement('i')
        this.$stateIcon.classList.add('player__state-icon')
        this.$stateIcon.classList.add('fas')
        this.$stateIcon.classList.add('fa-pause')
        this.$player.appendChild(this.$stateIcon)

        /**
         * Title bar
         */
        this.$titlebar = document.createElement('h3')
        this.$titlebar.classList.add('player__titlebar')
        this.$titlebar.textContent = this.video.title
        this.$player.appendChild(this.$titlebar)

        /**
         * Seekbar
         */
        this.seekbar.$seekbar = document.createElement('div')
        this.seekbar.$seekbar.classList.add('player__seekbar')
        this.$player.appendChild(this.seekbar.$seekbar)
        
        this.seekbar.$seekbarFiller = document.createElement('div')
        this.seekbar.$seekbarFiller.classList.add('filler')
        this.seekbar.$seekbar.appendChild(this.seekbar.$seekbarFiller)

        this.seekbar.$seekbarDragger = document.createElement('div')
        this.seekbar.$seekbarDragger.classList.add('dragger')
        this.seekbar.$seekbar.appendChild(this.seekbar.$seekbarDragger)



        /**
         * Seekbar Thumbnail
         */

        this.seekbar.$seekbarThumbnail = document.createElement('video')
        this.seekbar.$seekbarThumbnail.classList.add('player__seekbar__thumbnail')
        this.seekbar.$seekbar.appendChild(this.seekbar.$seekbarThumbnail)
        this.seekbar.$seekbarThumbnail.src = this.video.attributes.src

        /**
         * Controls container
         */
        this.controls.$toolbar = document.createElement('div')
        this.controls.$toolbar.classList.add('player__toolbar')
        this.$player.appendChild(this.controls.$toolbar)

        
        /**
         * Play button
         */
        this.controls.$playpauseButton = document.createElement('button')
        this.controls.$playpauseButton.classList.add('player__toolbar__playpause-button')
        this.controls.$playpauseButton.classList.add('fas')
        this.controls.$playpauseButton.classList.add('fa-play')
        this.controls.$toolbar.appendChild(this.controls.$playpauseButton)
        
        /**
         * Time display
         */
        this.controls.$timeDisplay = document.createElement('p')
        this.controls.$timeDisplay.classList.add('player__toolbar__time-display')
        this.controls.$toolbar.appendChild(this.controls.$timeDisplay)
        /**
         * Volume
         */

        this.controls.volume = {}

        this.controls.volume.$container = document.createElement('div')
        this.controls.volume.$container.classList.add('player__toolbar__volume-container')
        this.controls.$toolbar.appendChild(this.controls.volume.$container)

        this.controls.volume.$muteButton = document.createElement('button')
        this.controls.volume.$muteButton.classList.add('player__toolbar__mute-button')
        this.controls.volume.$muteButton.classList.add('fas')
        this.controls.volume.$muteButton.classList.add('fa-volume-up')
        this.controls.volume.$container.appendChild(this.controls.volume.$muteButton)
    
        this.controls.volume.$slider = document.createElement('div')
        this.controls.volume.$slider.classList.add('player__toolbar__volume-container__volume-slider')
        this.controls.volume.$sliderFiller = document.createElement('div')
        this.controls.volume.$sliderFiller.classList.add('filler')
        this.controls.volume.$slider.appendChild(this.controls.volume.$sliderFiller)
        this.controls.volume.$sliderDragger = document.createElement('div')
        this.controls.volume.$sliderDragger.classList.add('dragger')
        this.controls.volume.$slider.appendChild(this.controls.volume.$sliderDragger)
        
        this.controls.volume.$container.appendChild(this.controls.volume.$slider)

        /**
         * Fullscreen
         */

        this.controls.$fullscreenButton = document.createElement('button')
        this.controls.$fullscreenButton.classList.add('player__toolbar__fullscreen-button')
        this.controls.$fullscreenButton.classList.add('fas')
        this.controls.$fullscreenButton.classList.add('fa-expand')
        this.controls.$toolbar.appendChild(this.controls.$fullscreenButton)
        

    }

    initControls(){

        /**
         * Tool and seekbar fading in and out on mouse hover
         */

        this.$player.addEventListener('mouseleave',()=>{
            if (!this.video.$video.paused) {
                this.controls.$toolbar.style.transitionDelay = '0.5s';
                this.seekbar.$seekbar.style.transitionDelay = '0.5s';
                this.$titlebar.style.transitionDelay = '0.5s';
                this.controls.$toolbar.style.opacity = '0';
                this.seekbar.$seekbar.style.opacity = '0';
                this.$titlebar.style.opacity = '0';
            }
        })
        this.$player.addEventListener('mouseenter',()=>{
            this.controls.$toolbar.style.transitionDelay = '0s';
            this.seekbar.$seekbar.style.transitionDelay = '0s';
            this.$titlebar.style.transitionDelay = '0s';
            this.controls.$toolbar.style.opacity = '1';
            this.seekbar.$seekbar.style.opacity = '1';
            this.$titlebar.style.opacity = '1';
        })
        this.$player.addEventListener('mousemove',()=>{
            this.controls.$toolbar.style.transitionDelay = '0s';
            this.seekbar.$seekbar.style.transitionDelay = '0s';
            this.$titlebar.style.transitionDelay = '0s';
            this.controls.$toolbar.style.opacity = '1';
            this.seekbar.$seekbar.style.opacity = '1';
            this.$titlebar.style.opacity = '1';
        })

        /**
         * Seekbar running
         */
        let seekbarRect = this.seekbar.$seekbar.getBoundingClientRect()
        window.addEventListener('resize',()=>{
            seekbarRect = this.seekbar.$seekbar.getBoundingClientRect()
        })
        
        const seekbarRun = ()=>{
            let playedRatio = this.video.$video.currentTime / this.video.$video.duration
            this.seekbar.$seekbarFiller.style.transform = `scaleX(${playedRatio})`
            this.seekbar.$seekbarDragger.style.transform = `translateX(${playedRatio * seekbarRect.width}px)`
            window.requestAnimationFrame(seekbarRun)
        }
        seekbarRun()

        /**
         * Seekbar interaction
         */

        //Time movement
        let isSeekbarClicked = false
        this.seekbar.$seekbar.addEventListener('mousedown',(e)=>{
            isSeekbarClicked = true
            let clickedTime = Math.floor(((e.clientX - seekbarRect.left)/seekbarRect.width)*this.video.$video.duration)
            this.video.$video.currentTime = clickedTime
        })
        window.addEventListener('mousemove',(e)=>{
            if (isSeekbarClicked) {
                let time = Math.floor(((e.clientX - seekbarRect.left) / seekbarRect.width) * this.video.$video.duration)
                time > this.video.$video.duration ? time = this.video.$video.duration : ''
                time < 0 ? time = 0 : ''
                this.video.$video.currentTime = time
            }
        })
        window.addEventListener('mouseup',()=>{
            isSeekbarClicked = false
        })

        //Thumbnail
        this.seekbar.$seekbar.addEventListener('mousemove',(e)=>{
            let xPosition = e.clientX - seekbarRect.left;
            let time = Math.floor(xPosition/seekbarRect.width * this.video.$video.duration)
            
            this.seekbar.$seekbarThumbnail.currentTime = time
            this.seekbar.$seekbarThumbnail.style.transform = `translateX(${xPosition}px)`
        })

        /**
         * Time Display
         */
        const displayCurrentTime = ()=>{
            let timeElapsed = new Date(null)
            timeElapsed.setSeconds(Math.floor(this.video.$video.currentTime))
            let totalTime = new Date(null)
            let duration = this.video.$video.duration ? this.video.$video.duration : 0
            
            totalTime.setSeconds(Math.floor(duration))
            

            this.controls.$timeDisplay.textContent = `${timeElapsed.toISOString().substr(14,5)} / ${totalTime.toISOString().substr(14,5)}`
            window.requestAnimationFrame(displayCurrentTime)
        }
        displayCurrentTime()

        /**
         * 
         * Play and pause on video click
         */
        
        this.video.$video.addEventListener('click', () => {
            this.doPlayPause()
        })

        /**
         * HAndle click on icon
         */
        this.$stateIcon.addEventListener('click',()=>{
            this.doPlayPause()
        })

        /**
         * 
         * Play and pause on button click
         */

        this.controls.$playpauseButton.addEventListener('click', () => {
            this.doPlayPause()
        })

        /**
         * Handle Volume
         */

        
        //Muting
        this.controls.volume.$muteButton.addEventListener('click', () => {
            this.mute()
        })
        
        //Volume slider
        let volumeSliderRect = this.controls.volume.$slider.getBoundingClientRect()
        window.addEventListener('resize',()=>{
            volumeSliderRect = this.controls.volume.$slider.getBoundingClientRect()
        })
        
        const volumeDraggerPosition = ()=>{
            if(this.video.$video.muted){
                this.controls.volume.$sliderDragger.style.transform = `translateX(0)`
            }
            else{
                this.controls.volume.$sliderDragger.style.transform = `translateX(${this.video.$video.volume * volumeSliderRect.width}px)`
            }
            window.requestAnimationFrame(volumeDraggerPosition)
        }
        volumeDraggerPosition()
        

        let isSliderClicked = false
        this.controls.volume.$slider.addEventListener('mousedown', (e) => {
            isSliderClicked = true
            let ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width
            ratio > 1 ? ratio = 1 : ''
            ratio < 0 ? ratio = 0 : ''

            if (ratio === 0) {
                this.controls.volume.$muteButton.classList.remove('fa-volume-down')
                this.controls.volume.$muteButton.classList.remove('fa-volume-up')
                this.controls.volume.$muteButton.classList.add('fa-volume-mute')
            }
            else if (ratio < 0.5) {
                this.controls.volume.$muteButton.classList.remove('fa-volume-up')
                this.controls.volume.$muteButton.classList.remove('fa-volume-mute')
                this.controls.volume.$muteButton.classList.add('fa-volume-down')
            }
            else {
                this.controls.volume.$muteButton.classList.remove('fa-volume-down')
                this.controls.volume.$muteButton.classList.remove('fa-volume-mute')
                this.controls.volume.$muteButton.classList.add('fa-volume-up')
                this.video.$video.muted = false
            }
            this.controls.volume.$sliderFiller.style.transform = `scaleX(${ratio})`
            this.video.$video.volume = ratio
        })
        window.addEventListener('mouseup', () => {
            this.controls.volume.$sliderFiller.style.transition = 'transform .3s'
            isSliderClicked = false
            
        })
        window.addEventListener('mousemove', (e) => {
            if (isSliderClicked) {
                this.controls.volume.$sliderFiller.style.transition = 'none'
                let ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width
                ratio > 1 ? ratio = 1 : ''
                ratio < 0 ? ratio = 0 : ''
                if (ratio === 0) {
                    this.controls.volume.$muteButton.classList.remove('fa-volume-down')
                    this.controls.volume.$muteButton.classList.add('fa-volume-mute')
                }
                else if (ratio < 0.5) {
                    this.controls.volume.$muteButton.classList.remove('fa-volume-up')
                    this.controls.volume.$muteButton.classList.remove('fa-volume-mute')
                    this.controls.volume.$muteButton.classList.add('fa-volume-down')
                }
                else {
                    this.controls.volume.$muteButton.classList.remove('fa-volume-down')
                    this.controls.volume.$muteButton.classList.add('fa-volume-up')
                    this.video.$video.muted = false
                }
                this.controls.volume.$sliderFiller.style.transform = `scaleX(${ratio})`
                this.video.$video.volume = ratio
            }
        })

        /**
         * Handle Fullscreen
         */

        this.controls.$fullscreenButton.addEventListener('click', () => {
            this.goFullscreen()
        })
        this.video.$video.addEventListener('dblclick', () => {
            this.goFullscreen()
        })
    }
    
    initKeyboardControls(){
        document.addEventListener('keydown',(e)=>{
            switch (e.keyCode) {
                case 75:
                    this.doPlayPause()
                    break
                case 76:
                    this.video.$video.currentTime + 10 < this.video.$video.duration ? this.video.$video.currentTime += 10 : this.video.$video.currentTime = this.video.$video.duration
                    break
                case 74:
                    this.video.$video.currentTime - 10 > 0 ? this.video.$video.currentTime -= 10 : this.video.$video.currentTime = 0
                    break
                case 77:
                    this.mute()
                    break
                case 70:
                    this.goFullscreen()
                    break
            }
        })
    }

    doPlayPause(){
        if (this.video.$video.paused) {
            this.video.$video.play()
            this.controls.$toolbar.style.transitionDelay = '0.5s'
            this.seekbar.$seekbar.style.transitionDelay = '0.5s'
            this.$titlebar.style.transitionDelay = '0.5s'
            this.controls.$toolbar.style.opacity = '0'
            this.seekbar.$seekbar.style.opacity = '0'
            this.$titlebar.style.opacity = '0'
        }
        else{
            this.video.$video.pause()
            this.controls.$toolbar.style.transitionDelay = '0s'
            this.seekbar.$seekbar.style.transitionDelay = '0s'
            this.$titlebar.style.transitionDelay = '0s'
            this.controls.$toolbar.style.opacity = '1'
            this.seekbar.$seekbar.style.opacity = '1'
            this.$titlebar.style.opacity = '1'
        }
        this.controls.$playpauseButton.classList.toggle('fa-play')
        this.controls.$playpauseButton.classList.toggle('fa-pause')
        this.$stateIcon.classList.toggle('fa-play')
        this.$stateIcon.classList.toggle('fa-pause')
        this.$stateIcon.classList.add('showing')
        window.setTimeout(()=>{
            this.$stateIcon.classList.remove('showing')
        },700)
    }

    mute(){
        if (this.video.$video.muted) {
            this.controls.volume.$muteButton.classList.remove('fa-volume-mute');
            this.video.$video.volume < 0.5 ? this.controls.volume.$muteButton.classList.add('fa-volume-down') : this.controls.volume.$muteButton.classList.add('fa-volume-up')
            this.video.$video.muted = false
            this.controls.volume.$sliderFiller.style.transform = `scaleX(${this.video.$video.volume})`
        }
        else {
            this.controls.volume.$muteButton.classList.add('fa-volume-mute');
            this.video.$video.volume < 0.5 ? this.controls.volume.$muteButton.classList.remove('fa-volume-down') : this.controls.volume.$muteButton.classList.remove('fa-volume-up')
            this.video.$video.muted = true
            this.controls.volume.$sliderFiller.style.transform = 'scaleX(0)'
        }
    }

    goFullscreen(){
        this.controls.$fullscreenButton.classList.toggle('fa-expand')
        this.controls.$fullscreenButton.classList.toggle('fa-compress')
        this.isFullScreen ? document.webkitExitFullscreen() : this.$player.webkitRequestFullScreen()
        this.controls.$toolbar.style.transitionDelay = '0.5s'
        this.seekbar.$seekbar.style.transitionDelay = '0.5s'
        this.$titlebar.style.transitionDelay = '0.5s'
        this.controls.$toolbar.style.opacity = '0'
        this.seekbar.$seekbar.style.opacity = '0'
        this.$titlebar.style.opacity = '0'
        this.isFullScreen = !this.isFullScreen
    }
}