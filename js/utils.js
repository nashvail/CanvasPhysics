Object.prototype.extend = function (extension) {
  let obj = Object.create(this);
  for (let property in extension) {
    if (extension.hasOwnProperty(property) || obj[property] === 'undefined') {
      obj[property] = extension[property];
    }
  }
  return obj;
};