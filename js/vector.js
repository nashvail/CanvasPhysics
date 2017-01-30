let Vector = {
  /*
  * Function: create
  * -----------------
  * Create a new Vector with given polar parameters.
  */
  create(magnitude = 0, direction = 0) {
    return this.extend({
      magnitude: Math.abs(magnitude),
      direction
    });
  },

  /*
  * Function: cartCreate
  * --------------------
  * Create a new Vector with given Cartesian parameters.
  */
  cartCreate(x, y) {
    let magnitude = Math.sqrt(x * x + y * y);
    let direction = Math.atan2(y, x);
    return this.create(magnitude, direction);
  },

  /*
  * Function: get x
  * --------------------
  * Returns the Cartesian X of the vector. 
  * Relative to origin at top left.
  */
  get x() {
    return Math.cos(this.direction) * this.magnitude;
  },

  /*
  * Function: get y
  * --------------------
  * Returns the Cartesian Y of the vector. 
  * Relative to origin at top left.
  */
  get y() {
    return Math.sin(this.direction) * this.magnitude;
  },

  /*
  * Function: quadrant
  * -------------------------
  * Returns the quadrant in which 
  * the vector lies in. 
  * Quadrant starts from 1 bottom right and clockwise onwards.
  */
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

  /*
  * Function: setX
  * -------------------------
  * Updates X end of the vector.
  */
  setX(newX) {
    let newV = Vector.cartCreate(newX, this.y);
    this.setMagnitude(newV.magnitude);
    this.setDirection(newV.direction);
  },

  /*
  * Function: setY
  * -------------------------
  * Updates Y end of the vector.
  */
  setY(newY) {
    let newV = Vector.cartCreate(this.x, newY);
    this.setMagnitude(newV.magnitude);
    this.setDirection(newV.direction);
  },

  /*
  * Function: setDirection
  * -------------------------
  * Updates the direction or the
  * angle Vector makes with the positive 
  * x axis.
  */
  setDirection(angle) {
    this.direction = angle;
  },

  /*
  * Function: setMagnitude
  * -------------------------
  * Updates the magnitude of the vector.
  */
  setMagnitude(mag) {
    this.magnitude = Math.abs(mag);
  },

  // Arithmetic

  /*
  * Function: addTo
  * -------------------------
  * Takes a second vector as parameter. Returns 
  * a new Vector that is vector sum of this vector
  * and the one passed as parameter.
  */
  addTo(v) {
    let mag = Math.sqrt(Math.pow(this.x + v.x, 2) + Math.pow(this.y + v.y, 2));
    let dir = Math.atan2(this.y + v.y, this.x + v.x);
    return Vector.create(mag, dir);
  },

  /*
  * Function: subtractFrom
  * -------------------------
  * Takes a second vector as parameter. Returns 
  * a new Vector that is vector difference of this vector
  * and the one passed as parameter.
  */
  subtractFrom(v) {
    let rv = Vector.create(v.magnitude, v.direction + Math.PI);
    let mag = Math.sqrt(Math.pow(this.x + rv.x, 2) + Math.pow(this.y + rv.y, 2));
    let dir = Math.atan2(this.y + rv.y, this.x + rv.x);
    return Vector.create(mag, dir);
  },

  /*
  * Function: divideBy
  * -------------------------
  * Divides the magnitude of this vector 
  * by the parameter. No new Vector is returned.
  */
  divideBy(scalar) {
    return Vector.create(this.magnitude / scalar, this.direction);
  },

  /*
  * Function: angleBetween
  * -------------------------
  * Returns the angle (in radians) 
  * between this vector and the vector
  * passed in as parameter.
  */
  angleBetween(v) {
    let num = this.x * v.x + this.y * v.y;
    let den = this.magnitude * v.magnitude;
    return Math.acos(num / den);
  },

  /*
  * Function: reverse
  * -------------------------
  * Reverses the direction of this vector.
  */
  reverse() {
    console.log(this.magnitude);
    this.setDirection(this.direction + Math.PI);
  },

  /*
  * Function: reverseX
  * -------------------------
  * Reverses direction only of the 
  * X(horizontal) component of the vector.
  */
  reverseX() {
    let compX = this.cx(),
      compY = this.cy();
    compX.reverse();
    this.setDirection(compX.addTo(compY).direction);
  },

  /*
  * Function: reverseY
  * -------------------------
  * Reverses direction only of the 
  * Y(vertical) component of the vector.
  */
  reverseY() {
    let compX = this.cx(),
      compY = this.cy();
    compY.reverse();
    this.setDirection(compX.addTo(compY).direction);
  },

  /*
  * Function: cx
  * -------------------------
  * Returns a new vector that represents
  * the horizontal component of this vector.
  */
  cx() {
    return Vector.create(this.magnitude * Math.cos(this.direction), this.quadrant === 1 || this.quadrant === 4 ? 0 : Math.PI);
  },

 /*
  * Function: cy
  * -------------------------
  * Returns a new vector that represents
  * the vertical component of this vector.
  */
  cy() {
    return Vector.create(this.magnitude * Math.sin(this.direction), this.quadrant === 1 || this.quadrant === 2 ? Math.PI / 2 : -Math.PI / 2);
  },

  /*
  * Function: draw
  * --------------------
  * Draws the vector on canvas.
  */
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
