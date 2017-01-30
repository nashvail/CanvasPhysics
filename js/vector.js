let Vector = {
  // Create with polar coordinates
  create(magnitude = 0, direction = 0) {
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
  setX(newX) {
    let newV = Vector.cartCreate(newX, this.y);
    this.setMagnitude(newV.magnitude);
    this.setDirection(newV.direction);
  },
  setY(newY) {
    let newV = Vector.cartCreate(this.x, newY);
    this.setMagnitude(newV.magnitude);
    this.setDirection(newV.direction);
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
    return Vector.create(this.magnitude * Math.sin(this.direction), this.quadrant === 1 || this.quadrant === 2 ? Math.PI / 2 : -Math.PI / 2);
  },
  // Drawing the vector diagram
  draw(context, sx = 0, sy = 0, color = '#000') {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(sx + this.x, sy + this.y);
    context.stroke();

    if (this.magnitude > 0) {
      context.save();
      context.translate(sx + this.x, sy + this.y);
      context.rotate(this.direction);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-5, -5);
      context.moveTo(0, 0);
      context.lineTo(-5, 5);
      context.stroke();
      context.restore();
    }
    context.fillStyle = '#000';
  }
};
