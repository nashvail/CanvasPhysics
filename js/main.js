Object.prototype.extend = function (extension) {
  let obj = Object.create(this);
  for (let property in extension) {
    if (extension.hasOwnProperty(property) || obj[property] === 'undefined') {
      obj[property] = extension[property];
    }
  }
  return obj;
};

window.onload = function () {
  const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  // Constants
  const π = Math.PI;

  let Vector = {
    // Create with polar coordinates
    create(magnitude, direction) {
      return this.extend({
        magnitude: Math.abs(magnitude),
        direction
      });
    },
    // Create with Cartesian coordinates
    cartCreate(x, y) {
      let magnitude = Math.sqrt(x * x + y * y);
      let direction = Math.atan2(y, x);
      return this.create(magnitude, direction);
    },
    get x() {
      return Math.cos(this.direction) * this.magnitude;
    },
    get y() {
      return Math.sin(this.direction) * this.magnitude;
    },
    get quadrant() {
      let x = this.x, y = this.y;
      if (x >= 0 && y >= 0) {
        return 1;
      } else if (x <= 0 && y >= 0) {
        return 2;
      } else if (x <= 0 && y <= 0) {
        return 3;
      } else if (x >= 0 && y <= 0) {
        return 4;
      } else { // we'll handle that later
        return -1;
      }
    },
    setDirection(angle) {
      this.direction = angle;
    },
    setMagnitude(mag) {
      this.magnitude = Math.abs(mag);
    },
    // Arithmetic
    addTo(v) {
      let mag = Math.sqrt(Math.pow(this.x + v.x, 2) + Math.pow(this.y + v.y, 2));
      let dir = Math.atan2(this.y + v.y, this.x + v.x);
      return Vector.create(mag, dir);
    },
    subtractFrom(v) {
      // Probably just use the reverse function below
      let rv = Vector.create(v.magnitude, v.direction + Math.PI);
      let mag = Math.sqrt(Math.pow(this.x + rv.x, 2) + Math.pow(this.y + rv.y, 2));
      let dir = Math.atan2(this.y + rv.y, this.x + rv.x);
      return Vector.create(mag, dir);
    },
    divideBy(scalar) {
      return Vector.create(this.magnitude / scalar, this.direction);
    },
    angleBetween(v) {
      let num = this.x * v.x + this.y * v.y;
      let den = this.magnitude * v.magnitude;
      return Math.acos(num / den);
    },
    // Reverses the direction of vector
    reverse() {
      console.log(this.magnitude);
      this.setDirection(this.direction + Math.PI);
    },
    reverseX(damping = 1) {
      let compX = this.cx(),
        compY = this.cy();

      compX.reverse();
      this.setDirection(compX.addTo(compY).direction);

      let newMagnitude = Math.abs(this.magnitude * damping) < 0.5 ? 0 : Math.abs(this.magnitude * damping);
      this.setMagnitude(newMagnitude);
    },
    reverseY(damping = 1) {
      let compX = this.cx(),
        compY = this.cy();

      compY.reverse();
      this.setDirection(compX.addTo(compY).direction);

      let newMagnitude = Math.abs(this.magnitude * damping) < 0.5 ? 0 : Math.abs(this.magnitude * damping);
      this.setMagnitude(newMagnitude);
    },
    // X and Y component vectors of the main vector
    cx() {
      return Vector.create(this.magnitude * Math.cos(this.direction), this.quadrant === 1 || this.quadrant === 4 ? 0 : Math.PI);
    },
    cy() {
      return Vector.create(this.magnitude * Math.sin(this.direction), this.quadrant === 1 || this.quadrant === 2 ? Math.PI/2 : -Math.PI/2);
    },
    // Drawing the vector diagram
    draw(context, sx = 0, sy = 0) {
      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(sx + this.x, sy + this.y);
      context.stroke();

      if(this.magnitude > 0) {
        context.save();
        context.translate(sx + this.x, sy + this.y);
        context.rotate(this.direction);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-10, -10);
        context.moveTo(0, 0);
        context.lineTo(-10, 10);
        context.stroke();
        context.restore();
      }
    }
  };

  // A particle has a constant radius for all
  let Particle = {
    create(position, forces = []) {
      return this.extend({
        position, forces,
        mass: 10,
        velocity: Vector.create(0, 0)
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
      context.arc(this.position.x, this.position.y, 8, 0, 2 * π);
      context.fill();
    }
  };

  // Forces
  let angle = π/4;
  let f1 = Vector.create(10, π/2);
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