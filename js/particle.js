// A particle has a constant radius for all
let Particle = {
  create(position, forces = []) {
    return this.extend({
      position, forces,
      mass: 10,
      velocity: Vector.create(0, 0),
      radius: 10
    });
  },
  update() {
    let r = Vector.create(0, 0);
    for (let i = 0; i < this.forces.length; i++) {
      r = r.addTo(this.forces[i]);
    }

    let acc = r.divideBy(this.mass);
    this.velocity = this.velocity.addTo(acc);
    this.position = this.position.addTo(this.velocity);
  },
  updateAndDraw(context) {
    this.update();
    this.draw(context);
  },
  draw(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
};