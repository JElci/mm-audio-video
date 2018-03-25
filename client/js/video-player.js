import VideoThree from "./videoThree.js"
import {getAudioCanvas} from "./audio-player.js";
import './dash.all.min.js';

export default class VideoPlayer extends HTMLElement {
  constructor() {
    super();

    let createdVideos = false;
    const video1 = this.getAttribute('video');
    const controls = this.getAttribute("controls");
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template(video1);

    (function(){
      var url = video1;
      var player = dashjs.MediaPlayer().create();
      player.initialize(shadowRoot.querySelector("#video-file"), url, true);
    })();

    let videofilter = {
      grayscale : this.shadowRoot.querySelector("#filter-grayscale"),
      invert : this.shadowRoot.querySelector("#filter-invert"),
      redscale : this.shadowRoot.querySelector("#filter-redscale"),
      greenscale : this.shadowRoot.querySelector("#filter-greenscale"),
      bluescale : this.shadowRoot.querySelector("#filter-bluescale")
    }

    let cameraPos = {
      x : 0,
      y : 80,
      z : 100
    }

    let cameraPosVideo = {
      x : 0,
      y : 100,
      z : 0
    }

    let videoPlane = {
      x : 150,
      y : 110
    }

    let videoThreeSize = {
      width : 500,
      height: 500
    }

    let textPos = {
      y : 10,
      z : 0
    }

    this.video1 = this.shadowRoot.querySelector("#video-file");
    this.video1.setAttribute('crossOrigin', '');
    this.video2 = getAudioCanvas();

    this.videoThreeContainer = this.shadowRoot.querySelector("#video-three");
    VideoThree.init(this.videoThreeContainer , cameraPos , videoThreeSize);

    this.video1.addEventListener('canplaythrough', () => {
      if(!createdVideos) {
        VideoThree.addVideoWithChromaKey(this.video1 , videofilter , 0x0000 , cameraPosVideo , videoPlane);
        VideoThree.addAudioAsVideo(this.video2 , cameraPosVideo , videoPlane);
        createdVideos = true;
      }

    });

    VideoThree.addText("VideoPlayer" , 0x000000 , 10 , textPos);
    this.shadowRoot.querySelector(".video-filter-wrapper").style.cssFloat = controls;
  }

  template(video) {
    const html = String.raw;
    return html`
	    <link href="./css/style.css" rel="stylesheet" type="text/css"/>
      <div id="video-three"></div>
      <div class="canvas-video-wrapper">
        <video class="video" id="video-file" src="${video}" controls autoplay loop muted></video>
      </div>
      <div id="video-three"></div>
      <div class="video-filter-wrapper">
        <div class="video-filter grayscale vid_div_first">
          <label for="filter-grayscale">Grauwert-Filter</label>
          <input id="filter-grayscale" type="checkbox">
        </div>
        <div class="video-filter invert  vid_div_second">
          <label for="filter-invert">Invert-Filter</label>
          <input id="filter-invert" type="checkbox">
        </div>
        <div class="video-filter redscale vid_div_second">
          <label for="filter-redscale">Rotwert-Filter</label>
          <input id="filter-redscale" type="checkbox">
        </div>
        <div class="video-filter greenscale vid_div_second">
          <label for="filter-greenscale">Grünwert-Filter</label>
          <input id="filter-greenscale" type="checkbox">
        </div>
        <div class="video-filter bluescale vid_div_second">
          <label for="filter-bluescale">Blauwert-Filter</label>
          <input id="filter-bluescale" type="checkbox">
        </div>
      </div>
    `;
  }
}
customElements.define('x-video-player', VideoPlayer);
