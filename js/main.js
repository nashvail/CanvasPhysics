window.onload = function () {
  const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  // Constants
  const π = Math.PI;

  // Forces
  let g = Vector.create(0, π/2);

  let p1 = Particle.create(Vector.cartCreate(width / 2, height / 2 + 200), [g]);
  let p2 = Particle.create(Vector.cartCreate(width / 2, height / 2), [g]);
  p1.velocity = Vector.create(15, 0);
  p2.mass = 2000;

  let f1 = Vector.create(5, 0);
  let f2 = Vector.create(5, 0);

  p1.forces.push(f1);
  p2.forces.push(f2);

  let particles = [p1, p2];

  update();

  function update() {
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.update();
      if (p.position.x + p.radius > width) {
        p.position.setX(width - p.radius);
        p.velocity.reverseX();
      }
      if (p.position.x - p.radius < 0) {
        p.position.setX(p.radius);
        p.velocity.reverseX();
      }
      if (p.position.y + p.radius > height) {
        p.position.setY(height - p.radius);
        p.velocity.reverseY();
      }
      if (p.position.y - p.radius < 0) {
        p.position.setY(p.radius);
        p.velocity.reverseY();
      }

      p.draw(context);
    }

    f1.setDirection(p2.position.subtractFrom(p1.position).direction);
    f2.setDirection(p1.position.subtractFrom(p2.position).direction);
    requestAnimationFrame(update);
  }

  ///////////////
  function cartToPolar(x, y) {
    return {
      mag: Math.sqrt(x * x + y * y),
      dir: Math.atan2(y, x)
    };
  }

};