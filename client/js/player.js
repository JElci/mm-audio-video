// Instances
import audioManager from './audio-manager.js';
import renderer from './renderer.js';

let textArea;
let midiAccess;
let curVol;
let volumeSlider;
let gainage;

export default class Player extends HTMLElement {
    constructor() {
        super();
        initMidi();
        textArea = document.getElementById('result');        

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
        <style>
        div {
            background-color: lightgray;
        }
        #progress {
            background-color: gray;
            width: 0%;
            height: 22px;
        }
        cnv {
          width: 300;
          height: 500;
        }
    </style>
    <div>
        <div id="progress"></div>
        <button type="button" id="play">Play/Pause</button>
        <button type="button" id="volume">Stumm</button>
        
    <div id="slidecontainer">
    <input type="range" min="0" max="127" value="50" class="slider" id="myRange" step="1"  >
    </div>
        <canvas id="cnv" width="500" height="100"></canvas>
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


function initMidi() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(
            midiSuccess,
            midiFailure
        );
    } else {
        midiFailure();
    }
}

function midiSuccess(midi) {
    textArea.value = 'Midi is working!';

    midiAccess = midi;
    var inputs = midi.inputs;
    for (var input of inputs.values()) {
        input.onmidimessage = onMidiMessage;
    }
}

function midiFailure() {
    textArea.value = 'Failure: Midi is not working!';
}


function byId(e){
    return document.getElementById(e);
}

//window.addEventListener('load', onDocLoaded, false);

function onDocLoaded()
{
    byId('mFileInput').addEventListener('change', onChosenFileChange, false);
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



/*
function handleFiles(event) {
    document.getElementById("file").addEventListener("change", handleFiles, false);            
	var files = event.target.files;
	$("#audio").attr("src", URL.createObjectURL(files[0]));
	document.getElementById("player").load();
    document.getElementById("player").audio.play();
}
*/



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

    textArea.value += "\n" +
        "New Event (on Channel: " + channel + ")==> Type: " + cmd +
        ", Origin: " + btnID +
        ", Value: " + value +
        ", volumeval:" + volumeSlider.value;


    textArea.scrollTop = textArea.scrollHeight;

}
customElements.define('x-player', Player);
