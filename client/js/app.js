import Player from './audio-player.js';
import Synth from './synth.js';
import audioManager from './audio-manager.js';
import VideoPlayer from './video-player.js';
import MIDI from './midi-controller.js';
import renderer from './renderer.js';

let MIDIObject = new MIDI();

export default class App extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template();

    this.rs1 = this.shadowRoot.querySelector("#rs1");

    this.rs = {
    rs1 : {
        id : 1,
        name : "RotarySwitch1"
        },

    rs2 : {
        id : 1,
        name : "RotarySwitch2"
        },

    rs3 : {
        id : 1,
        name : "RotarySwitch3"
        },

    rs4 : {
        id : 1,
        name : "RotarySwitch4"
        },

    rs5 : {
        id : 1,
        name : "RotarySwitch5"
        },

    rs6 : {
        id : 1,
        name : "RotarySwitch6"
        },

    rs7 : {
        id : 1,
        name : "RotarySwitch7"
        },

    rs8 : {
        id : 1,
        name : "RotarySwitch8"
        },

    rs9 : {
        id : 1,
        name : "RotarySwitch9"
        },

    rs10 : {
        id : 1,
        name : "RotarySwitch10"
        },

    rs11 : {
        id : 1,
        name : "RotarySwitch11"
        },

    rs12 : {
        id : 1,
        name : "RotarySwitch12"
        },

    rs13 : {
        id : 1,
        name : "RotarySwitch13"
        },

    rs14 : {
        id : 1,
        name : "RotarySwitch14"
        },

    rs15 : {
        id : 1,
        name : "RotarySwitch15"
        },

    rs16 : {
        id : 1,
        name : "RotarySwitch16"
        }
    };
    this.setMIDIUnits();
    renderer.addRenderTask(this.update.bind(this));
  }

  setMIDIUnits() {
    MIDIObject.createUnit(this.rs.rs1.id , this.rs.rs1.name);
    MIDIObject.setValueByUnitID(this.rs.rs1.id , 64);
  }

  update() {
    let rs1 = MIDIObject.getValueByUnitName(this.rs.rs1.name);
    this.rs1.value = rs1;
    this.changeRS1(rs1);
  }

  changeRS1(rs1) {

  }

  template() {
    const html = String.raw;
    return html`
		  <link href="./css/style.css" rel="stylesheet" type="text/css"/>
      <div>
		    <div class="audio_video_wrap">
			    <div class="audio_video_links">
			      <h1 class="headline">Audioplayer</h1>
				    <h2>MIDI Controls</h2>
				    <div>
				      <input id="rs1" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs2" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs3" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs4" class="demo" type="range" min="0" max="127" value="64">
			      </div>
			      <div>
				      <input id="rs5" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs6" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs7" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs8" class="demo" type="range" min="0" max="127" value="64">
			      </div>
			      <div>
				      <input id="rs9" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs10" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs11" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs12" class="demo" type="range" min="0" max="127" value="64">
			      </div>
			      <div>
				      <input id="rs13" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs14" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs15" class="demo" type="range" min="0" max="127" value="64">
				      <input id="rs16" class="demo" type="range" min="0" max="127" value="64">
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
			      <input class="vertical-slider" id="gain4" orient="vertical" type="range" min="0" max="127" value="127">
            <br>
			      <h2>Crossfader</h2>
			      <div id="crossfader">
			        <input class="horizontal-slider" id="crossfade" type="range" min="0" max="127" value="64">
			      </div>
			      <div class="audio_video_rechts">
              <h2 class="audio-track-headline">Track 1</h2>
              <!-- Crossfader ID ändern! -->
              <x-player id="sound" url="http://127.0.0.3:8080/data/audio/manifest_audio1.mpd" midi-id-volume="48" midi-id-playback="49" midi-id-crossfader="55" player-id="0"></x-player>
			      </div>
            <div class="audio_video_rechts">
              <h2 class="audio-track-headline">Track 2</h2>
              <x-player id="sound" url="http://127.0.0.3:8080/data/audio/manifest_audio1.mpd" midi-id-volume="50" midi-id-playback="51" midi-id-crossfader="55" player-id="1"></x-player>
			      </div>
		      </div>
	      </div>
        <div id="player-wrapper">
          <x-video-player video="http://127.0.0.3:8080/data/video/manifest.mpd" controls="left"></x-video-player>
        </div>
		<!-- Synthesizer BEGIN -->
		<div>
			<x-synth></x-synth>
		</div>
		<!-- Synthesizer END -->
      </div>
    `;
  }
}
customElements.define('x-app', App);


function onMIDISuccess(midi) {
  console.log("MIDI works!");

  let access = midi;
  let inputs = midi.inputs;

  for (var input of inputs.values()) {
    input.onmidimessage = MIDIMessage;
  }
}

function onMIDIFailure(midi) {
}
