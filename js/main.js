window.onload = function () {
  const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  // Constants
  const π = Math.PI;

  // Forces
  let angle = π/4;
  let centerPv = Vector.cartCreate(width / 2, height / 2);
  let f1 = Vector.create(5, π/2);
  let f2 = Vector.create(8, π);

  let p1 = Particle.create(Vector.cartCreate(width / 2, height / 2 - 200), [f1, f2]);
  // p1.velocity = Vector.create(10, 0);

  let v = Vector.create();

  update();

  function update() {
    context.clearRect(0, 0, width, height);
    p1.update();

    if (p1.position.x + p1.radius > width) {
      p1.position.setX(width - p1.radius);
      p1.velocity.reverseX();
    }
    if (p1.position.x - p1.radius < 0) {
      p1.position.setX(p1.radius);
      p1.velocity.reverseX();
    }
    if (p1.position.y + p1.radius > height) {
      p1.position.setY(height - p1.radius);
      p1.velocity.reverseY();
    }
    if (p1.position.y - p1.radius < 0) {
      p1.position.setY(p1.radius);
      p1.velocity.reverseY();
    }

    v = centerPv.subtractFrom(p1.position);
    f1.setDirection(v.direction);
    p1.draw(context);
    
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