export default class Particle {
  constructor(constraintX, constraintY) {
    this.constraintX = constraintX;
    this.constraintY = constraintY;

    this.x = Math.random() * this.constraintX;
    this.y = Math.random() * this.constraintX;

    this.xVel = Math.random();
    this.yVel = Math.random();

    this.lifeTime = Date.now() + 5000 + 10000 * Math.random();
  }

  update() {
    this.x += this.xVel;
    if (this.x > this.constraintX) {
      this.xVel *= -1;
    }

    this.y += this.yVel;
    if (this.y > this.constraintY) {
      this.yVel *= -1;
    }
  }
}
