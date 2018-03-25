import audioManager from './audio-manager.js';
import MIDI from './midi-controller.js';
import renderer from './renderer.js';

let gainage;
let audioCanvas;
let MIDIObject = new MIDI();

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess , onMIDIFailure);
}

export default class Player extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template();

    const url = this.getAttribute('url');
    this.audio = new Audio(url);

    this.midiIDVolume = parseInt(this.getAttribute("midi-id-volume"));
    this.midiIDPlayBack = parseInt(this.getAttribute("midi-id-playback"));
    this.playerID = this.getAttribute("player-id");
    this.drawCirclesById = "1";

    const cnvEl = this.shadowRoot.querySelector("#cnv");
    this.cnvCtx = cnvEl.getContext("2d");

    this.saveAudioCirclesCanvas(this.drawCirclesById);

    this.volumeRange = this.shadowRoot.querySelector("#volume-range");
    this.playbackRange = this.shadowRoot.querySelector("#playback-range");

    this.setMIDIUnits();

    renderer.addRenderTask(this.updateAudioTime.bind(this));
    renderer.addRenderTask(this.update.bind(this));


    this.source = audioManager.ctx.createMediaElementSource(this.audio);
    this.analyser = audioManager.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.gainNode = audioManager.ctx.createGain();
    this.source.connect(this.gainNode);
    this.gainNode.connect(audioManager.ctx.destination);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(audioManager.ctx.destination);

    gainage = this.gainNode;

  }

  template() {
    const html = String.raw;
    return html`
	    <link href="./css/style.css" rel="stylesheet" type="text/css"/>
      <div id="audio-player-wrapper">
        <div class="audio-progress-wrapper">
          <div id="audio-progress"></div>
        </div>
        <div class="audio-buttons">
          <p>
            <button type="button" id="play">Play/Pause</button>
            <button type="button" id="volume">Stumm</button>
          </p>
        </div>
        <div class="slidecontainer">
          <p>
            <span>Volume</span>
            <input type="range" min="0" max="127" value="50" class="slider" id="volume-range" step="1">
          </p>
          <p>
            <span>PlaybackRate</span>
            <input type="range" min="0" max="127" value="50" class="slider" id="playback-range" step="1">
          </p>
        </div>
        <canvas id="cnv" height="100" width="300"></canvas>
        <canvas id="cnv2" style="display: none;" height="300" width="300"></canvas>
      </div>
    `;
  }

  update() {
    let volume = MIDIObject.getValueByUnitName("Volume-" + this.playerID);
    let playback = MIDIObject.getValueByUnitName("PlayBackRate-" + this.playerID);
    this.volumeRange.value = volume;
    this.playbackRange.value = playback;
    this.changeAudioVolume(volume);
    this.changePlaybackRate(playback);

    this.analyser.getByteTimeDomainData(this.dataArray);
    this.cnvCtx.clearRect(0, 0, 300, 100);

    let barWidth = (500 / this.bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i] / 2;
      this.cnvCtx.fillStyle = '#F62459';
      this.cnvCtx.fillRect(x, 100 - barHeight / 2, barWidth, barHeight);
      x += barWidth + 1;
    }
    this.drawAudioCirlces(this.drawCirclesById);

  }

  saveAudioCirclesCanvas(playerId) {
    if(playerId === this.playerID) {
      this.audioCircles = this.shadowRoot.querySelector("#cnv2");
      audioCanvas = this.audioCircles;
      this.audioCirclesCtx = this.audioCircles.getContext("2d");
    }
  }

  drawAudioCirlces(playerId) {
    if(playerId === this.playerID) {
      this.audioCirclesCtx.clearRect(0, 0, 300, 300);
      var centerX = this.audioCircles.width / 2;
      var centerY = this.audioCircles.height / 2;
      this.audioCirclesCtx.shadowBlur = 20;
      this.audioCirclesCtx.shadowColor = "black";
      this.audioCirclesCtx.fillStyle = "rgba(0 , 0 , 0 , 0.0)";
      this.audioCirclesCtx.fill();

      for(let i = 0 ; i < this.bufferLength / 4 ; i++) {
        this.audioCirclesCtx.beginPath();
        this.audioCirclesCtx.arc(centerX, centerY, i * 10 + 1 , 0, 2 * Math.PI, false);
        this.audioCirclesCtx.lineWidth = (this.dataArray[i] / 10);
        this.audioCirclesCtx.strokeStyle = "rgb(" + (i * 10 + 10)  +" , 0 , 0)";
        this.audioCirclesCtx.stroke();
      }
    }
  }

  setMIDIUnits() {
    MIDIObject.createUnit(this.midiIDVolume , "Volume-" + this.playerID);
    MIDIObject.createUnit(this.midiIDPlayBack , "PlayBackRate-" + this.playerID);
    MIDIObject.setValueByUnitID(this.midiIDPlayBack , 64);
    MIDIObject.setValueByUnitID(this.midiIDVolume , 127);
  }

  connectedCallback() {
    const playPause = this.shadowRoot.querySelector('#play');
    const mute = this.shadowRoot.querySelector('#volume');

    this.elProgress = this.shadowRoot.querySelector('#audio-progress');

    playPause.addEventListener('click', this.playPauseAudio.bind(this));
    mute.addEventListener('click', this.muteAudioVolume.bind(this));
  }

  playPauseAudio() {
    if(this.audio.paused) {
      this.audio.play();
    }
    else {
      this.audio.pause();
    }
  }

  updateAudioTime() {
    const progress = this.audio.currentTime / this.audio.duration;
    this.elProgress.style.width = (progress * 100) + '%';
  }

  muteAudioVolume() {
    this.audio.mute = true;
  }

  changeAudioVolume(value) {
    this.audio.volume = (value / 127);
  }

  changePlaybackRate(speed) {
    if(speed < 5) {
      this.audio.playbackRate = 0.1;
    }
    else {
      this.audio.playbackRate = speed / 64;
    }
  }
}
customElements.define('x-player', Player);

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

function MIDIMessage(event) {
  let cmd = event.data[0] >> 4;
  let channel = event.data[0] & 0xf;
  let btnID = event.data[1];
  let value = event.data[2];

  MIDIObject.setValueByUnitID(btnID , value);

  console.log("New Event:\nChannel: " + channel + "\nType: " + cmd + "\nButtonID: " + btnID + "\nValue: " + value + "\n");
  console.log("Unit:\nID: " + MIDIObject.getUnitID("Volume-0") + "\nValue: " + MIDIObject.getValueByUnitID(48) + "\n");
}

function getAudioCanvas() {
  return audioCanvas;
}
export {getAudioCanvas};
