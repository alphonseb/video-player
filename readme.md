Video Player
============

Description :
-----------
- HTML5 Video player with custom built-in controls.
- Easy to use.
- No dependencies

Initialization :
----------------
In your HTML:
- Add the fontawesome stylesheet
```html
 <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
```
- Add a container for your video player
```html
<div class="container"></div>
```
- Add the Player.js file
```html
<script src="Player.js"></script>
```
- Initialize the player
```html
<script>
    const player = new Player({
        title: //Title of your video,
        attributes:{
            src: //source of the video,
            muted: false,
            autoloop: false,
            width: //if you want a specific width,
            height: //if you want a specific height,
            poster: //source of the poster,
            class: //if you want a specific class
        },
        container: ".container"
    })
</script>
```
In your SCSS :
- Add the player style sheet
```scss
@import "player";
```

Options :
---------
```javascript
{
    title: //Title of your video,
    attributes:{
        src: //(string)source of the video,
        muted: //(boolean),
        autoloop: //(boolean),
        width: //(int),
        height: //(int)
        poster: //(string)source of the poster,
        class: //(string) if you want a specific class
    },
    keyboard: //(bool) enable or disable the keyboard controls (if you have several players for instance).Defaults to false
    container: //(string) CSS selector of your container. Defaults to body
}
```

Technologies :
--------------
- JavaScript
- CSS3 (SCSS)
- Preprocessor: Gulp

Features :
----------
- Play and pause by clicking anywhere on the video
- Draggable volume control
- Draggable seekbar
- Video preview on seekbar
- Fullscreen mode
- Double click to fullscreen
- Control bar fades out when the pointer leaves the player, except when the video is paused
- Keyboard controls (have to be enabled when initializing) :
    * K to play and pause
    * J to back 10 seconds
    * L to fast-forward 10 seconds
    * F to fullscreen