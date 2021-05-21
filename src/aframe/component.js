import * as AFRAME from 'aframe';

AFRAME.registerComponent('media-controller',{
    schema: {
        src: {
            type: "string"
        }
    },
    init: function(){
     const el = this.el;
     const data = this.data;
     const sceneEl = el.sceneEl;

     const media = document.querySelector(data.src);
     media.pause();

     const playPauseImg = sceneEl.querySelector('a-image');
     playPauseImg.addEventListener('click',function(){
         if(media.paused)
         {
             media.play();
             playPauseImg.setAttribute('src', '#pause_media');         
         }
         else
         {
             media.pause();
             playPauseImg.setAttribute('src', '#play_media');      
         }
     });
    }
});
