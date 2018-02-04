// Instances
import renderer from './renderer.js';
import Particle from './particle.js';

export default class ParticleSystem extends HTMLElement {

    constructor() {
        super();

        this.width = this.getAttribute('width');
        this.height = this.getAttribute('height');

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();

        const cnvEl = this.shadowRoot.querySelector("#cnv");
        this.ctx = cnvEl.getContext("2d");

        this.particles = [];
        for (let i=0; i<30; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }

        renderer.addRenderTask(this.update.bind(this));
    }

    template() {
        const html = String.raw;

        return html`
            <style>
              cnv {
                width: ${this.width};
                height:${this.height};
              }
            </style>
            <canvas id="cnv" width="${this.width}" height="${this.height}"></canvas>
        `;
    }

    update () {
      this.ctx.clearRect(0,0,this.width,this.height);
      this.ctx.fillStyle = 'red';

      this.particles.forEach((particle, index) => {
        particle.update();

        if (particle.lifeTime < Date.now()) {
          this.particles.splice(index, 1);

          if (this.particles.length < 15) {
            this.particles.push(new Particle(this.width, this.height));
          }
        }
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
      });
    }
}

customElements.define('x-particle-system', ParticleSystem);
