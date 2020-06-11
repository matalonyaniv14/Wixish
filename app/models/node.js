class Node {
  constructor(data) {
    this._data = data;
    this._id = data + '_id';

  }

  get data() {
    return this._data;
  }

  get id() {
    return this._id;
  }

  set data(newData) {
    this._data = newData;
  }

  set id(_id) {
    this._id = _id;
  }
}


module.exports.Node = Node;
