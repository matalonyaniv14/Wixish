const { BaseStrategy } = require('./baseStrategy.js');
const { Resource } = require('../models/resource.js');
// import BaseStrategy from './baseStrategy.js';

class CSSStrategy extends BaseStrategy {
  constructor(){
    super();
    this.analyze = this.analyze.bind(this);
  }


  analyze( old, _new ) {
    let o, n;
    let changedResources = [];
    for ( o of old ) {
        if ( n = o.findSelf( _new ) ) {
            if ( n.hasChanged( o ) ) {
                changedResources.push( { o: o, n: n } );
            }
        } else {

          console.log( "couldnt find self in resources....", o );
          
        }
    }
      
    return changedResources;
  }
};


module.exports.CSSStrategy = CSSStrategy;
// export default CSSStrategy;
