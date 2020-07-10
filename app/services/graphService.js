const { readFileSync } = require('fs');
const { resolve, extname, dirname } = require('path');
const { Stack } = require('../models/stack');



class GraphService {
  constructor(nodeGraph) {
    this.nodeGraph   = nodeGraph;
    this._inPlayPaths = [];
    this.perform  = this.perform.bind(this);
  }

  get inPlayPaths() { return this._inPlayPaths; }
  set inPlayPaths( p ) { this._inPlayPaths = p; }

  perform() {
    let rootStack      = new Stack();
    let childrenStack  = new Stack();
    let _links = Object.assign( [], this.nodeGraph.links );
    if ( this.nodeGraph.checkCircularReference( _links ).res === true ) {
        throw "You have ( 2 ) or more CSS files linking to one another";
    }

    let rootNode       = this.nodeGraph.findRootNode( rootStack );
    this.nodeGraph.findChildren( rootNode, childrenStack );
    
    let _inPlay        = childrenStack.nodes;
    _inPlay.push( rootNode.data );
    this.inPlayPaths   = _inPlay;
  }
}


module.exports = {
  GraphService
}


// MAINEND #####################################################################




// function build(arry) {
//   arry.forEach(e => graph.addNode(new Node( e ) ));
// }

// let graph, nodes,links, link;
// nodes = ['a','b','c','d','e'];

// graph =  new NodeGraph();
// build(nodes);
// link  = new Link(graph.nodes[0], graph.nodes[1]);
// link1 = new Link(graph.nodes[1], graph.nodes[2]);
// link2 = new Link(graph.nodes[2], graph.nodes[4]);
// link3 = new Link(graph.nodes[3], graph.nodes[4]);

// links = [link,link1,link2,link3];
// links.forEach( l => graph.addLink(l) );


// // console.log(graph);
// // // console.log(graph.findLinkFromNode(graph.nodes[2]))
// let stack = [];
// let p = graph.findRootNode(graph.nodes[4], stack);
// // console.log(stack);
// graph.findChildren(graph.nodes[0], stack = [])
// // console.log(stack);
