// Instances
import renderer from './renderer.js';

export default class Canvas extends HTMLElement {

    constructor() {
        super();

        this.width = this.getAttribute('width');
        this.height = this.getAttribute('height');

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();

        const cnvEl = this.shadowRoot.querySelector("#cnv");
        this.ctx = cnvEl.getContext("2d");

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
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(10, 10, 100, 100);
    }
}

customElements.define('x-canvas', Canvas);
