export default class Synth extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template();
	let AudioContext = window.AudioContext || window.webkitAudioContext;

	this.ctx = new AudioContext();
	this.gain = this.ctx.createGain();
	this.globalbend = 0; 
	this.pool = []; 		 
	this.lastmode = null;
	this.synth;
    this.mididown = [];
	this.basefreq = 0;
	this.options = ['osc1type', 'osc1vol', 'osc1tune', 'osc2type', 'osc2vol', 'osc2tune', 'attack', 'decay', 'sustain', 'release', 'filter', 'cutoff'];
	this.startSoundHeadline = this.shadowRoot.querySelector("#startSound");
	this.divs = [];
	this.osc1gain;
	this.osc2gain;
	this.osc1;
	this.osc2;
	this.tune1;
	this.tune2;
	this.cutoff;
	this.attack;
	this.decay;
	this.sustain;
	this.release;
	this.filter;
	this.eps;
	this.silent;
	this.ndown;

	
	for(let i = 0 ; i < this.options.length ; i++) {
	  this.shadowRoot.querySelector("#" + this.options[i]).addEventListener('change', () => {
		this.reload()  
	  });	
	}
	
	setInterval(this.reload(), 200);
	
	for (var i = 0; i < 128; i++)
	  this.mididown.push(false);
  
  
	this.buttonContainer = document.createElement("div");
	this.buttonContainer.id = "button-container";
	this.shadowRoot.querySelector("#synthesizer").appendChild(this.buttonContainer);
  
    for (var i = 0; i < 60; i++) {
	  if(i == 12 || i == 24 || i == 36 || i == 48)
	    this.shadowRoot.querySelector("#synthesizer").appendChild(document.createElement('br'));
		
	  let field = document.createElement("div")
	  this.divs.push(field);
	  field.className = "button";
	  field.style.display = 'inline-block';
	  field.style.margin = '5px';
	  field.style.padding = '20px';
	  field.style.cursor = 'default';
	  field.style.backgroundColor = '#00ffc0';
	  this.buttonContainer.appendChild(field);

	  var midiHit = this.midiHit;
	  
	  
	  field.addEventListener('mousemove', (event) => {
	    this.cancel(event);
	  });
	  field.addEventListener('mousedown', (event) => {
	    this.mousedown(event);
	  });
	  field.addEventListener('mouseup', (event) => {
	    this.mouseup(event);
	  });
	  field.addEventListener('mouseout', (event) => {
	    this.mouseup(event);
	  });
	  field.addEventListener('touchmove', (event) => {
	    this.cancel(event);
	  });
	  field.addEventListener('touchstart', (event) => {
	    this.mousedown(event);
	  });
	  field.addEventListener('touchend', (event) => {
	    this.mouseup(event);
	  });
	  field.addEventListener('touchleave', (event) => {
	    this.mouseup(event);
	  });
	  field.addEventListener('selectstart', (event) => {
	    this.cancel(event);
	  });
	
	  field.unselectable = 'on';
	  field.style.mozUserSelect = 'none';
	  field.style.webkitUserSelect = 'none';
	  field.style.userSelect = 'none';
    }
	
	midiHit = this.midiHit;
  }
  
  cancel(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  
  mouseup(event) {
	  let container = this.shadowRoot.querySelector("#button-container").getElementsByClassName("button");
	  let value = 0;
	  
	  for(var i = 0 ; i < container.length ; i++) {
		if(container[i] === event.target) {
			value = i;
		}
	  }
	  
    this.midiHit(36 + value, 0, false);
    return this.cancel(event);
  }
  
  mousedown(event) {
	let container = this.shadowRoot.querySelector("#button-container").getElementsByClassName("button");
	let value = 0;
	  
	for(var i = 0 ; i < container.length ; i++) {
	  if(container[i] === event.target) {
	    value = i;
	  }
	}
    this.midiHit(36 + value, 100, true);
    return this.cancel(event);  
  }
 
  template() {
    const html = String.raw;
    return html`
	  <link href="./css/style.css" rel="stylesheet" type="text/css"/>
	  <table id="synthesizer">
	  <tbody>
	    <tr>
		  <th id="startSound">Oscillator</th>
		  <th>Type</th>
		  <th>Volume</th>
		  <th>Tune</th>
		  <td></td>
		</tr>
		<tr>
		  <td>1</td>
		  <td>
		    <select id="osc1type">
		      <option value="sine">Sine wave</option>
			  <option value="square">Square wave</option>
			  <option value="triangle">Triangle wave</option>
			  <option value="sawtooth">Saw wave</option>
			</select>
		  </td>
		  <td><input type="range" min="0" max="50" value="20" id="osc1vol" /></td>
		  <td><input type="range" min="-120" max="120" value="0" id="osc1tune" /></td>
		</tr>
		<tr>
		  <td>2</td>
		  <td>
		    <select id="osc2type">
			  <option value="sine" selected="selected">Sine wave</option>
			  <option value="square">Square wave</option>
			  <option value="triangle">Triangle wave</option>
			  <option value="sawtooth">Saw wave</option>
			</select>
		  </td>
		  <td><input type="range" min="0" max="50" value="10" id="osc2vol" /></td>
		  <td><input type="range" min="-120" max="120" value="120" id="osc2tune" /></td>
		</tr>

		<tr></tr>
		<tr>
		  <th>Attack</th>
		  <td colspan="1"><input type="range" min="0" max="200" value="0" id="attack" /></td>
		  <th>Sustain</th>
		  <td colspan="3"><input type="range" min="0" max="100" value="50" id="sustain" /></td>
		</tr>
		<tr>
		  <th>Decay</th>
		  <td colspan="1"><input type="range" min="0" max="500" value="30" id="decay" /></td>
		  <th>Release</th>
		  <td colspan="3"><input type="range" min="0" max="100" value="10" id="release" /></td>
		</tr>
		<tr>
		  <th id="cutoff_txt">Cutoff</th>
		  <td>
		    <select id="filter">
			  <option value="1">Enable</option>
			  <option value="0">Disable</option>
			</select>
		  </td>
		  <td colspan="2"><input type="range" min="-150" max="500" value="360" id="cutoff" /></td>
		</tr>
	  </tbody>
	  </table>	
	  <br />
    `;
  }
  
  startSounds(){
	var i = 0, p = 0, s = 'OM]QRlT\LpAm';
	
	var c = s.charCodeAt(i++) - 65, m = 70 + c % 11, z = Math.floor(c / 11);
	if (p > 70) this.midiHit(p,   0, false);
	if (m > 70) this.midiHit(m, 100, true );
	//if (z >  0) setTimeout(this , z * 187);
	p = m;
  }
	
  analogsynth(dest, mode) {
	var ctx  = dest.context;
	this.filter = ctx.createBiquadFilter();
	
	this.filter.type = 'lowpass';
	this.filter.frequency.setValueAtTime(22050, ctx.currentTime);
	this.filter.Q.setValueAtTime(0.5, ctx.currentTime);

	this.synth = this.filter;

	this.gain = ctx.createGain();
	this.gain.gain.setValueAtTime(0, ctx.currentTime);
	this.gain.connect(this.filter);

	this.osc1gain = this.oscGain(mode.osc1vol, 0.8);
	this.osc2gain = this.oscGain(mode.osc2vol, 0.6);
	this.osc1 = this.getOscByType(mode.osc1type, this.osc1gain.node);
	this.osc2 = this.getOscByType(mode.osc2type, this.osc2gain.node);
	this.tune1 = this.calcTune(mode.osc1tune);
	this.tune2 = this.calcTune(mode.osc2tune);
	this.cutoff = this.calcTune(mode.cutoff);
	this.attack   = typeof mode.attack   == 'number' ? mode.attack   : 0.1;
	this.decay    = typeof mode.decay    == 'number' ? mode.decay    : 0.2;
	this.sustain  = typeof mode.sustain  == 'number' ? mode.sustain  : 0.5;
	this.release = typeof mode.release == 'number' ? mode.release : 10;

	this.eps = 0.001;
	if (this.attack < this.eps)
		this.attack = this.eps;
	if (this.decay < this.eps)
		this.decay = this.eps;
	if (this.sustain < this.eps)
		this.sustain = this.eps;
	if (this.release < this.eps)
		this.release = this.eps;

	this.basefreq = 0;
	this.silent = 0;
	this.ndown = false;

	this.osc1.start();
	this.osc2.start();
	this.synth.connect(dest);
	
	this.synth.noteOn = function(freq, vol , ndown , basefreq , osc1 , osc2 , filter , osc1gain , osc2gain , cutoff , hitpeak , attack , decay , sustain , release , silent , tune1 , tune2 , gain){
		ndown = true;
		basefreq = freq;
		var now = ctx.currentTime;
		osc1.frequency.setValueAtTime(freq * tune1, now);
		osc2.frequency.setValueAtTime(freq * tune2, now);
		filter.frequency.setValueAtTime(Math.min(freq * cutoff, 22050), now);
		osc1gain.node.gain.setValueAtTime(vol * osc1gain.base, now);
		osc2gain.node.gain.setValueAtTime(vol * osc2gain.base, now);
		var v = gain.gain.value;
		gain.gain.cancelScheduledValues(now);
		gain.gain.setValueAtTime(v, now);
		var hitpeak = now + attack;
		var hitsus = hitpeak + decay * (1 - sustain);
		silent = hitsus + release;
		gain.gain.linearRampToValueAtTime(1, hitpeak);
		gain.gain.linearRampToValueAtTime(sustain, hitsus);
		gain.gain.linearRampToValueAtTime(0.000001, silent);
	};

	this.synth.bend = function(semitones , basefreq , ctx , osc1 , osc2 , tune1 , tune2) {
		var b = basefreq * Math.pow(2, semitones / 12);
		var now = ctx.currentTime;
		osc1.frequency.setTargetAtTime(b * tune1, now, 0.1);
		osc2.frequency.setTargetAtTime(b * tune2, now, 0.1);
	};

	this.synth.noteOff = function(ndown , ctx , gain , silent , decay){
		ndown = false;
		var now = ctx.currentTime;
		var v = gain.gain.value;
		gain.gain.cancelScheduledValues(now);
		gain.gain.setValueAtTime(v, now);
		silent = now + decay * v;
		gain.gain.linearRampToValueAtTime(0.000001, silent);
	};

	this.synth.isReady = function(ctx , silent , ndown){
		return ctx.currentTime >= silent && !ndown;
	};

	this.synth.stop = function(ndown , ctx , osc1gain , osc2gain , silent){
		ndown = false;
		var now = ctx.currentTime;
		osc1gain.node.gain.setValueAtTime(0.000001, now);
		osc2gain.node.gain.setValueAtTime(0.000001, now);
		silent = 0;
	};

	this.synth.destroy = function(ndown , silent , osc1 , osc2 , synth){
		ndown = false;
		silent = 0;
		osc1.stop();
		osc2.stop();
		synth.disconnect();
	};

	return this.synth;
}

  oscGain(v, def) {
	var g = this.ctx.createGain();
	v = typeof v === 'number' ? v : def;
	g.gain.setValueAtTime(0, this.ctx.currentTime);
	g.connect(this.gain);
	return { node: g, base: v };
  }
  
  getOscByType(type, g) {
	var osc = this.ctx.createOscillator();
	osc.type = typeof type === 'string' ? type : 'sine';
	osc.connect(g);
	return osc;
  }
  
  calcTune(t) {
	if (typeof t !== 'number')
	  return 1;
	return Math.pow(2, t / 12);
  }
  
  getOscUIByID(id) {
    var sel = this.shadowRoot.getElementById('osc' + id + 'type');
	return sel.options[sel.selectedIndex].value;
  }
  
  getNum(id, base) {
	return parseFloat(this.shadowRoot.getElementById(id).value) / base;
  }

  reload() {
	var docutoff = this.shadowRoot.getElementById('filter').selectedIndex == 0;
	var mode = {
	  osc1type: this.getOscUIByID(1),
	  osc1vol : this.getNum('osc1vol', 100),
	  osc1tune: this.getNum('osc1tune', 10),
	  osc2type: this.getOscUIByID(2),
	  osc2vol : this.getNum('osc2vol', 100),
	  osc2tune: this.getNum('osc2tune', 10),
	  attack  : this.getNum('attack', 100),
	  decay   : this.getNum('decay', 100),
	  sustain : this.getNum('sustain', 100),
	  release : this.getNum('release', 10),
	  cutoff  : docutoff ? this.getNum('cutoff', 10) : 1000
	};

	
	if (this.lastmode !== null &&
	  this.lastmode.osc1type === mode.osc1type &&
	  this.lastmode.osc1vol  === mode.osc1vol  &&
	  this.lastmode.osc1tune === mode.osc1tune &&
	  this.lastmode.osc2type === mode.osc2type &&
	  this.lastmode.osc2vol  === mode.osc2vol  &&
	  this.lastmode.osc2tune === mode.osc2tune &&
	  this.lastmode.attack   === mode.attack   &&
	  this.lastmode.decay    === mode.decay    &&
	  this.lastmode.sustain  === mode.sustain  &&
	  this.lastmode.release === mode.release &&
	  this.lastmode.cutoff   === mode.cutoff)
		return;

	this.shadowRoot.getElementById('cutoff_txt').style.color = docutoff ? '#FFF' : '#BBB';
	this.shadowRoot.getElementById('cutoff').disabled = !docutoff;

	while (this.pool.length > 0)
	  this.pool.pop().destroy(this.ndown , this.silent , this.osc1 , this.osc2 , this.synth);

	for (var i = 0; i < 20; i++)
	  this.pool.push(this.analogsynth(this.ctx.destination, mode));

	this.lastmode = mode;
  }

  noteHit(freq, vol) {
    for (var i = 0; i < this.pool.length; i++) {
	  if (this.pool[i].isReady(this.ctx , this.silent , this.ndown)) {
        this.pool[i].noteOn(freq, vol , this.ndown , this.basefreq , this.osc1 , this.osc2 , this.filter , 
						    this.osc1gain , this.osc2gain , this.cutoff , this.hitpeak , this.attack , 
							this.decay , this.sustain , this.release , this.silent , this.tune1 , this.tune2 , this.gain);
		return this.pool[i];
	  }
	}
	return {
	  noteOff: function(){},
	  bend: function(){}
	}
  }

  midiHit(note, vel, down) {
	if(this.mididown[note]) {
	  this.mididown[note].noteOff(this.ndown , this.ctx , this.gain , this.silent , this.decay);
	  this.mididown[note] = false;
	}
	if(down) {
	  var freq = 440 * Math.pow(2, (note - 69) / 12);
	  var vol  = vel / 127;
	  this.mididown[note] = this.noteHit(freq, vol);
	  if(this.globalbend != 0)
	    this.mididown[note].bend(this.globalbend);
	}
  }
}
customElements.define('x-synth', Synth);