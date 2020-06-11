class Link {
  constructor(_from, to) {
    this._from = _from;
    this._to = to;

  }

  get from() {
    return this._from;
  }
  get to() {
    return this._to;
  }

  set from(node) {
    this._from = node;
  }
  set to(node) {
    this._to = node;
  }
}


module.exports.Link = Link;
