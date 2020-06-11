class Stack {
  constructor() {
    this._stack = [];
    this._stats = {};

    this.add = this.add.bind(this);
  }

  get stack() { 
    return this._stack; 
  }
  get stats() { 
    return this._stats; 
  }
  get nodes() { 
      return this.stack.map( function( n ) { 
        return n.data 
      });
  }

  add(node) {
    this._stack.push(node);
    let nodeCount = this._stats[node.id] ?? 0;
    this._stats[node.id] = ++nodeCount;
  }
}


module.exports.Stack = Stack;
