// Classes
import Player from './player.js';
//import Canvas from './canvas.js';
import ParticleSystem from './particle-system.js';

// Instances
import audioManager from './audio-manager.js';

import VideoPlayer from './video-player.js';


export default class App extends HTMLElement {

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();
    }

    template() {
      const html = String.raw;
      return html`
      <!--<style>
        .headline {
          text-align: center;
          margin: 40px 0px 40px 0px;
        }
        .center {
          text-align: center;
        }
      </style>-->
			<link href="./css/style.css" rel="stylesheet" type="text/css"/>
        <div>
			<div class="audio_video_wrap">
				<div class="audio_video_links">
				  <h1 class="headline">Audioplayer</h1>
					  <h2>MIDI Controls</h2>
					  <div>
					  <input id="rotaryswitch1" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch2" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch3" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch4" class="demo" type="range" min="0" max="127" value="64">
				  </div>
				  <div>
					  <input id="rotaryswitch5" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch6" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch7" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch8" class="demo" type="range" min="0" max="127" value="64">
				  </div>
				  <div>
					  <input id="rotaryswitch9" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch10" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch11" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch12" class="demo" type="range" min="0" max="127" value="64">
				  </div>
				  <div>
					  <input id="rotaryswitch13" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch14" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch15" class="demo" type="range" min="0" max="127" value="64">
					  <input id="rotaryswitch16" class="demo" type="range" min="0" max="127" value="64">
				  </div>
				  <h2>Cue (Play)</h2>
					  <button id="button48">Cue(Play)</button>
					  <button id="button49">Cue(Play)</button>
					  <button id="button50">Cue(Play)</button>
					  <button id="button51">Cue(Play)</button>
				  <br>
				  <h2>Gain</h2>
				  <input class="vertical-slider" id="gain1" orient="vertical" type="range" min="0" max="127" value="127">
				  <input class="vertical-slider" id="gain2" orient="vertical" type="range" min="0" max="127" value="127">
				  <input class="vertical-slider" id="gain3" orient="vertical" type="range" min="0" max="127" value="127">
				  <input class="vertical-slider" id="gain4" orient="vertical" type="range" min="0" max="127" value="127"><br>
				  <h2>Crossfader</h2>
				  <div id="crossfader">
				  <input class="horizontal-slider" id="crossfade" type="range" min="0" max="127" value="64">
				</div>
				<div class="audio_video_rechts">
				
          <h2>Player 1</h2>
          <x-player id="sound" controls></x-player>
          <input type="file" id="mFileInput"/>                 

          <x-canvas width="400" height="400"></x-canvas>          



				</div>
				
			</div>
		  
		  
		  </div>
		  
		  


					
            <div id="player-wrapper">
              <x-video-player video1="./media/B01.ogv" video2="./media/FX03.ogv" controls="left"></x-video-player>
            </div>
					
		  
        </div>
      `;
    }

}

customElements.define('x-app', App);
