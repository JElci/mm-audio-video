// Instances
import audioManager from './audio-manager.js';
import MIDI from './midi-controller.js';
import renderer from './renderer.js';

let curVol;
let volumeSlider;
let gainage;

let MIDIObject = new MIDI();

export default class Player extends HTMLElement {
    constructor() {
        super();

        this.setMIDIUnits();

        if (navigator.requestMIDIAccess) {
          navigator.requestMIDIAccess().then(onMIDISuccess , onMIDIFailure);
        }

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();

        const url = this.getAttribute('url');
        this.audio = new Audio();

        renderer.addRenderTask(this.updateAudioTime.bind(this));
        renderer.addRenderTask(this.update.bind(this));

        // Get Audio element in Audio API
        this.source = audioManager.ctx.createMediaElementSource(this.audio);


        // Create AnalyserNode
        this.analyser = audioManager.ctx.createAnalyser();
        this.analyser.fftSize = 256;

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);


        const cnvEl = this.shadowRoot.querySelector("#cnv");
        this.cnvCtx = cnvEl.getContext("2d");

        this.gainNode = audioManager.ctx.createGain();
        this.source.connect(this.gainNode);
        this.gainNode.connect(audioManager.ctx.destination);

        this.gainNode.connect(this.analyser);
        this.analyser.connect(audioManager.ctx.destination);

        volumeSlider = this.shadowRoot.querySelector('#myRange');

        gainage = this.gainNode;

    }

    template() {
      const html = String.raw;
      return html`
	      <link href="./css/style.css" rel="stylesheet" type="text/css"/>
        <div id="player_div">
          <div id="progress"></div>
          <button type="button" id="play">Play/Pause</button>
          <button type="button" id="volume">Stumm</button>
          <div id="slidecontainer">
            <input type="range" min="0" max="127" value="50" class="slider" id="myRange" step="1"  >
          </div>
          <canvas id="cnv" height="100" width="500"></canvas>
        </div>
      `;
    }

    update() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.cnvCtx.clearRect(0, 0, 500, 100);

        let barWidth = (500 / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i] / 2;

            this.cnvCtx.fillStyle = '#F62459';
            this.cnvCtx.fillRect(x, 100 - barHeight / 2, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    setMIDIUnits() {
      MIDIObject.createUnit(48 , "Volume1");
    }

    connectedCallback() {
        const button = this.shadowRoot.querySelector('#play');
        const leiser = this.shadowRoot.querySelector('#volume');



        this.elProgress = this.shadowRoot.querySelector('#progress');

        button.addEventListener('click', this.handleButtonClick.bind(this));
        leiser.addEventListener('click', this.changeAudioVolume.bind(this));
        window.addEventListener('load', onDocLoaded, false);
    }


    handleButtonClick() {
        if (this.audio.paused) {
            console.log(this.gainNode.gain.value);
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

    changeAudioVolume(value) {

        if (this.gainNode.gain.value != 0) {
            this.gainNode.gain.value = 0;
            volumeSlider.value = 0;
        }
        else {
            this.gainNode.gain.value = curVol;
            volumeSlider.value = curVol * 127;
        }
    }
}

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
  console.log("Unit:\nID: " + MIDIObject.getUnitID("Volume1") + "\nValue: " + MIDIObject.getValueByUnitID(48) + "\n");
}

function onDocLoaded()
{
    //byId('mFileInput').addEventListener('onchange', onChosenFileChange, false);
}

function onChosenFileChange(evt)
{
    var fileType = this.files[0].type;

    if (fileType.indexOf('x-player') != -1)
        loadFileObject(this.files[0], onSoundLoaded);

}

function loadFileObject(fileObj, loadedCallback)
{
    var reader = new FileReader();
    reader.onload = loadedCallback;
    reader.readAsDataURL( fileObj );
}

function onSoundLoaded(evt)
{
    byId('sound').src = evt.target.result;
    byId('sound').audio.play();
}

function onMidiMessage(event) {
    let cmd = event.data[0] >> 4;
    let channel = event.data[0] & 0xf;
    let btnID = event.data[1];
    let value = event.data[2];
    if (btnID == 1) {
        gainage.gain.value = value / 127;
        volumeSlider.value = value;
        curVol = value / 127;

    }
}

customElements.define('x-player', Player);
