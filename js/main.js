window.onload = function () {
  const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  // Constants
  const π = Math.PI;

  // Forces
  let angle = π/4;
  let f1 = Vector.create(0, π/2);
  let f2 = Vector.create(0, π/5);
  let f3 = Vector.create(0, π/2);

  let p1 = Particle.create(Vector.create(800, π/4), [f1, f2, f3]);
  p1.velocity = Vector.create(0, π/4);

  update();

  function update() {
    context.clearRect(0, 0, width, height);
    p1.update();
    p1.velocity.draw(context, 200, 200);

    if(p1.position.x + 4 >= width) {
      p1.position.x = width;
      p1.velocity.reverseX();
    } else if (p1.position.x - 4 <= 0) {
      p1.position.x = 0;
      p1.velocity.reverseX();
    } else if(p1.position.y + 4 >= height) {
      p1.position.y = height;
      p1.velocity.reverseY();
    } else if(p1.position.y - 4 <= 0) {
      p1.position.y = 0;
      p1.velocity.reverseY();
    } else {
      // p1.velocity.reverse();
    }

    // for(var i = 0; i < p1.forces.length; i++) {
      // p1.forces[i].draw(context, 200, 200);
    // }
    // f1.direction += π/16;
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