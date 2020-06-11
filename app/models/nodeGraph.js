const { readFileSync } = require('fs');
const { resolve, extname, dirname } = require('path');

const { Stack } = require('./stack');
const { Link } = require('./link');
const { Node } = require('./node');

const REQ_REG = /(?<require>[require @import].*?["'])(?<path>[^"']+)["'].*?;/mi;


class NodeGraph {
  constructor(paths) {
    this._nodes = [];
    this._links = [];
    this.paths  = paths; 
    this.buildNodes();


    this.buildNodes  = this.buildNodes.bind(this);
    this.buildLinks  = this.buildLinks.bind(this);
    this.findNodeFile  = this.findNodeFile.bind(this);
    this.resolveFile  = this.resolveFile.bind(this);
    this.findChildren  = this.findChildren.bind(this);
    this.findRootNode  = this.findRootNode.bind(this);
    this._findRootNode  = this._findRootNode.bind(this);
    this._root  = this._root.bind(this);
    this.findNode  = this.findNode.bind(this);
    this.findLinkFromNode  = this.findLinkFromNode.bind(this);
    this.findLinkToNode  = this.findLinkToNode.bind(this);
    this.addNode  = this.addNode.bind(this);
    this.addLink  = this.addLink.bind(this);
  }

  get nodes() { return this._nodes; }

  get links() { return this._links; }


  buildNodes() {
    let _this = this;
      this.paths.forEach( function( path ){ 
          _this.addNode( new Node( path ) );
      })
      this.buildLinks();
  }


  buildLinks() {
      let res, _required, _this;
      _this = this;
      this.nodes.forEach( function( node ){

          res = _this.findNodeFile( node.data );
          res.forEach(function( r ){ 
            // CHECK IF FILE ENDS WITH CSS MUST BE ADDED
             // console.log( 'THIS IS R => ', r );
              _required = r + '_id';
              let _node = _this.findNode( _required );
  

              if ( _node.length > 0 ) {

                  let link  = new Link( node, _node[0] );
                  _this.addLink(link);

              }           
          })
      })
  }


  findNodeFile( data ) {
      let contents, res, _this;
      _this = this;
      res = [];

      try {
        // // console.log( 'READING FILE => ' + data  );
          contents = readFileSync( data, 'utf-8' ).split( "\n" );
          contents.map( function( c ) { 
              let m =  c.match( REQ_REG ); 
              if ( m ) { 
                  res.push( _this.resolveFile( m, data ) ); 
                  // // console.log('IN RES', res);
              } 
          });
          
          return res;

      } catch( e ) {
          return [];
      }
  }


  resolveFile( match, data ) {
    // // console.log('IN RESOLVE FILE...', match, data);
      let splitPath = data.split('/');
      splitPath.pop();
      let pathDir   = splitPath.join('/');
      pathDir       = resolve( pathDir, match.groups.path );
      // // console.log('IN RESOLVE FILE...', pathDir);
      return pathDir;
  }


  findChildren(node, stack) {
      let _this = this;
      let _links = this.findLinkFromNode(node);
      if ( _links.length === 0 ) return stack;
      
      _links.forEach( function( link ) {
          stack.add(link.to);
          _this.findChildren(link.to, stack);
      })
  }

  findRootNode(stack) {
    let _this = this;
      this.nodes.forEach( function( node ) {
          _this._findRootNode(node, stack);
      })

      return this._root(stack);
  }

  _findRootNode(node, stack) {
    let _this = this;
      let _links = this.findLinkToNode( node );
      if ( _links.length === 0 ) {
          stack.add(node);
          return;
      }
      _links.forEach( function(e)  { 
        return _this._findRootNode(e.from, stack) 
      });
  }

  _root(stack) {
      let r = { node: '' , count: 0 };
      let vals = Object.entries(stack.stats);
      vals.forEach( function( v ) {
          if ( v[1] > r.count ) {
              r.node  = v[0];
              r.count = v[1];
          }
      })

      return this.findNode(r.node)[0];
  }


  findNode(id) {
    return this.nodes
        .filter( function( n )  { return  n.id === id });
  }

  findLinkFromNode(node) {
    return this.links
        .filter( function( l ) { return l.from.id === node.id });
  }

  findLinkToNode(node) {
    return this.links
        .filter( function( l ) { return l.to.id === node.id });
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addLink(link) {
    this.links.push(link);
  }
}



module.exports.NodeGraph = NodeGraph;

