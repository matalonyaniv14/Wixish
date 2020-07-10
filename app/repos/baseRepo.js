const { Resource } = require('../models/resource.js');

class BaseRepo {
    constructor( resources ) {
        this._resources = resources;
        this._nonUniqCount = 0;
    }


    get resources()    {   return this._resources; }
    set resources( r ) {   this._resources = r;    } 


    static get nonUniqCount()     { return this._nonUniqCount; }
    static set nonUniqCount( c )  { this._nonUniqCount = c; }
    static incrementCount() { this._nonUniqCount += 1; }
    static resetCount() { this._nonUniqCount = 0; }

    
    static buildResources( resources ) {
      let _this      = this;
      let _resources = [];
      console.log(resources);
      resources.forEach( function( resource ){ 
          _this._buildResource( resource, _resources );
      }) 

      return _resources;
    }

    static _buildResource = ( resource,  _resources ) => {
        let _this = this;
        let r = Resource.build( resource );
        if ( r ) {
            if ( r.findSelf( _resources ) ) {
                _this.incrementCount();
                r.setID( r.id + '_' + this.nonUniqCount );
                _resources.push( r );
            } else {
                _resources.push( r );
                _this.resetCount();
            }
        } else {
            console.log( "could not build resource", resource );
        }
    }
}


module.exports.BaseRepo = BaseRepo;
// export default BaseRepo;
