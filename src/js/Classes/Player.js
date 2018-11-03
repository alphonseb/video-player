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
        this.init()   
    }

    init(){
        this.buildPlayer()
        this.$video.addEventListener('click', ()=>{
            this.doPlayPause()
        })
        this.buildToolBar()
    }
    
    buildPlayer(){
        this.$video = document.createElement('video')
        for (const attribute of Object.keys(this.state)) {
            this.state[attribute] !== undefined ? this.$video.setAttribute(attribute, this.state[attribute]) : ''
        }
        let $container = document.createElement('div')
        $container.classList.add('player')
        $container.appendChild(this.$video)
        document.body.appendChild($container)       
    }
    
    doPlayPause(){
        this.$video.paused ? this.$video.play() : this.$video.pause()
    }

    buildToolBar(){
        this.$toolBar = document.createElement('div')
        this.$toolBar.classList.add('player__toolbar')
        this.$video.parentNode.appendChild(this.$toolBar)

        let $playpauseButton = document.createElement('button')
        $playpauseButton.textContent = 'Play'
        $playpauseButton.classList.add('player__toolbar__playpause-button')
        this.$toolBar.appendChild($playpauseButton)
        $playpauseButton.addEventListener('click',()=>{
            this.doPlayPause()
        })

        let $volumeContainer = document.createElement('div')
        $volumeContainer.classList.add('player__toolbar__volume-container')
        this.$toolBar.appendChild($volumeContainer)


        let $muteButton = document.createElement('button')
        $muteButton.textContent = 'Mute'
        $muteButton.classList.add('player__toolbar__mute-button')
        $volumeContainer.appendChild($muteButton)
        $muteButton.addEventListener('click',()=>{
            if (this.$video.muted) {
                this.$video.muted = false
                $volumeSliderFiller.style.transform = `scaleX(${this.$video.volume})`
            }
            else{
                this.$video.muted = true
                $volumeSliderFiller.style.transform = 'scaleX(0)'
            }
        })

        let $volumeSlider = document.createElement('div')
        $volumeSlider.classList.add('player__toolbar__volume-container__volume-slider')
        let $volumeSliderFiller = document.createElement('div')
        $volumeSliderFiller.classList.add('filler')
        $volumeSlider.appendChild($volumeSliderFiller)
        $volumeContainer.appendChild($volumeSlider)

        const volumeSliderRect = $volumeSlider.getBoundingClientRect()

        let isSliderClicked = false
        $volumeSlider.addEventListener('mousedown',(e)=>{
            isSliderClicked = true
            let ratio = (e.clientX - volumeSliderRect.left)/volumeSliderRect.width
            $volumeSliderFiller.style.transform = `scaleX(${ratio})`
            this.$video.volume = ratio
        })
        window.addEventListener('mouseup',()=>{
            $volumeSliderFiller.style.transition = 'transform .3s'
            isSliderClicked = false
            
        })
        window.addEventListener('mousemove',(e)=>{
            if (isSliderClicked) {
                $volumeSliderFiller.style.transition = 'none'
                let ratio = (e.clientX - volumeSliderRect.left)/volumeSliderRect.width
                ratio > 1 ? ratio = 1 : ''
                ratio < 0 ? ratio = 0 : ''
                $volumeSliderFiller.style.transform = `scaleX(${ratio})`
                this.$video.volume = ratio
            }
        })

        let $fullscreenButton = document.createElement('button')
        $fullscreenButton.classList.add('player__toolbar__fullscreen-button')
        $fullscreenButton.textContent = 'Full Screen'
        this.$toolBar.appendChild($fullscreenButton)
        let isFullScreen = false
        $fullscreenButton.addEventListener('click', ()=>{
            if (isFullScreen) {
                document.webkitExitFullscreen()
                isFullScreen = false
            } else {
                isFullScreen = true
                this.$video.parentNode.webkitRequestFullScreen()
            }
        })

    }
}