class Player{

    constructor(parameters){
        this.state = {
            src: parameters.src,
            muted: parameters.muted,
            autoloop: parameters.autoloop,
            width: parameters.width,
            height: parameters.height,
            poster: parameters.poster,
            class: parameters.class
        }
        this.controls = {}
        this.init()   
    }

    init(){
        this.buildPlayer()
        this.buildToolbar()
        this.initControls()
    }
    
    buildPlayer(){
        this.$video = document.createElement('video')
        for (const attribute of Object.keys(this.state)) {
            this.state[attribute] !== undefined ? this.$video.setAttribute(attribute, this.state[attribute]) : ''
        }
        this.$player = document.createElement('div')
        this.$player.classList.add('player')
        this.$player.appendChild(this.$video)
        document.body.appendChild(this.$player)       
    }

    buildToolbar(){
        /**
         * Seekbar
         */
        this.$seekbar = document.createElement('div')
        this.$seekbar.classList.add('player__seekbar')
        this.$player.appendChild(this.$seekbar)
        
        this.$seekbarFiller = document.createElement('div')
        this.$seekbarFiller.classList.add('filler')
        this.$seekbar.appendChild(this.$seekbarFiller)

        /**
         * Seekbar Thumbnail
         */

        this.$seekbarThumbnail = document.createElement('video')
        this.$seekbarThumbnail.classList.add('player__seekbar__thumbnail')
        this.$seekbar.appendChild(this.$seekbarThumbnail)
        this.$seekbarThumbnail.src = this.state.src

        /**
         * Controls container
         */
        this.controls.$toolbar = document.createElement('div')
        this.controls.$toolbar.classList.add('player__toolbar')
        this.$player.appendChild(this.controls.$toolbar)

        /**
         * Time display
         */
        this.controls.$timeDisplay = document.createElement('p')
        this.controls.$timeDisplay.classList.add('player__toolbar__time-display')
        this.controls.$toolbar.appendChild(this.controls.$timeDisplay)
        
        /**
         * Play button
         */
        this.controls.$playpauseButton = document.createElement('button')
        this.controls.$playpauseButton.textContent = 'Play'
        this.controls.$playpauseButton.classList.add('player__toolbar__playpause-button')
        this.controls.$toolbar.appendChild(this.controls.$playpauseButton)
        
        /**
         * Volume
         */

        this.controls.volume = {}

        this.controls.volume.$container = document.createElement('div')
        this.controls.volume.$container.classList.add('player__toolbar__volume-container')
        this.controls.$toolbar.appendChild(this.controls.volume.$container)

        this.controls.volume.$muteButton = document.createElement('button')
        this.controls.volume.$muteButton.textContent = 'Mute'
        this.controls.volume.$muteButton.classList.add('player__toolbar__mute-button')
        this.controls.volume.$container.appendChild(this.controls.volume.$muteButton)
    
        this.controls.volume.$slider = document.createElement('div')
        this.controls.volume.$slider.classList.add('player__toolbar__volume-container__volume-slider')
        this.controls.volume.$sliderFiller = document.createElement('div')
        this.controls.volume.$sliderFiller.classList.add('filler')
        this.controls.volume.$slider.appendChild(this.controls.volume.$sliderFiller)
        this.controls.volume.$container.appendChild(this.controls.volume.$slider)

        /**
         * Fullscreen
         */

        this.controls.$fullscreenButton = document.createElement('button')
        this.controls.$fullscreenButton.classList.add('player__toolbar__fullscreen-button')
        this.controls.$fullscreenButton.textContent = 'Full Screen'
        this.controls.$toolbar.appendChild(this.controls.$fullscreenButton)
        

    }

    initControls(){

        /**
         * Seekbar running
         */

        const seekbarRun = ()=>{
            let playedRatio = this.$video.currentTime / this.$video.duration
            this.$seekbarFiller.style.transform = `scaleX(${playedRatio})`
            window.requestAnimationFrame(seekbarRun)
        }
        seekbarRun()

        /**
         * Seekbar interaction
         */
        const seekbarRect = this.$seekbar.getBoundingClientRect()

        //Time movement
        let isSeekbarClicked = false
        this.$seekbar.addEventListener('mousedown',(e)=>{
            isSeekbarClicked = true
            let clickedTime = Math.floor(((e.clientX - seekbarRect.left)/seekbarRect.width)*this.$video.duration)
            this.$video.currentTime = clickedTime
        })
        window.addEventListener('mousemove',(e)=>{
            if (isSeekbarClicked) {
                let time = Math.floor(((e.clientX - seekbarRect.left) / seekbarRect.width) * this.$video.duration)
                time > this.$video.duration ? time = this.$video.duration : ''
                time < 0 ? time = 0 : ''
                this.$video.currentTime = time
            }
        })
        window.addEventListener('mouseup',()=>{
            isSeekbarClicked = false
        })

        //Thumbnail
        this.$seekbar.addEventListener('mousemove',(e)=>{
            let xPosition = e.clientX - seekbarRect.left;
            let time = Math.floor(xPosition/seekbarRect.width * this.$video.duration)
            
            this.$seekbarThumbnail.currentTime = time
            this.$seekbarThumbnail.style.transform = `translateX(${xPosition}px)`
        })

        /**
         * Time Display
         */
        const displayCurrentTime = ()=>{
            let timeElapsed = new Date(null)
            timeElapsed.setSeconds(Math.floor(this.$video.currentTime))
            let totalTime = new Date(null)
            let duration = this.$video.duration ? this.$video.duration : 0
            
            totalTime.setSeconds(Math.floor(duration))
            

            this.controls.$timeDisplay.textContent = `${timeElapsed.toISOString().substr(14,5)} / ${totalTime.toISOString().substr(14,5)}`
            window.requestAnimationFrame(displayCurrentTime)
        }
        displayCurrentTime()

        /**
         * 
         * Play and pause on video click
         */
        
        this.$video.addEventListener('click', () => {
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
        const volumeSliderRect = this.controls.volume.$slider.getBoundingClientRect()

        let isSliderClicked = false
        this.controls.volume.$slider.addEventListener('mousedown', (e) => {
            isSliderClicked = true
            let ratio = (e.clientX - volumeSliderRect.left) / volumeSliderRect.width
            this.controls.volume.$sliderFiller.style.transform = `scaleX(${ratio})`
            this.$video.volume = ratio
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
                this.controls.volume.$sliderFiller.style.transform = `scaleX(${ratio})`
                this.$video.volume = ratio
            }
        })

        /**
         * Handle Fullscreen
         */

        let isFullScreen = false
        this.controls.$fullscreenButton.addEventListener('click', () => {
            isFullScreen = this.goFullscreen(isFullScreen)
        })
    }

    doPlayPause(){
        this.$video.paused ? this.$video.play() : this.$video.pause()
    }

    mute(){
        if (this.$video.muted) {
            this.$video.muted = false
            this.controls.volume.$sliderFiller.style.transform = `scaleX(${this.$video.volume})`
        }
        else {
            this.$video.muted = true
            this.controls.volume.$sliderFiller.style.transform = 'scaleX(0)'
        }
    }

    goFullscreen(isFullScreen){
        isFullScreen ? document.webkitExitFullscreen() : this.$player.webkitRequestFullScreen()
        return !isFullScreen
    }
}