class Renderer {
  constructor() {
    this.renderTasks = [];
    this.update();
  }

  addRenderTask(renderTask) {
    this.renderTasks.push(renderTask);
  }

  update() {
    this.renderTasks.forEach((task) => {
      task();
    });

    window.requestAnimationFrame(this.update.bind(this));
  }
}

export default new Renderer();
