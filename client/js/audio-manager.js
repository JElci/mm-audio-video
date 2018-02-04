class AudioManager {
  constructor(url) {
    this.ctx = null;
    var source = null;
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      this.ctx = new AudioContext();
    } catch(e) {
      console.error(e);
      alert('Web Audio API is not supported in this browser');
    }
  }
}

export default new AudioManager();
