const { ShaService } = require('../services/ShaService.js');
const { buildRegex } = require('../helpers/regexHelper.js');
const { formatCSS } = require('../helpers/cssFormatterHelper.js');


const CSS_REG = /{.*}/;


class Resource {
  constructor( selector, cssText, href, id ) {
    this.selector = selector;
    this.cssText = cssText;
    this.href = href;
    this.setID( id );

    this.setID  = this.setID.bind(this);
    this.isNew  = this.isNew.bind(this);
    this.hasChanged  = this.hasChanged.bind(this);
    this.findSelf  = this.findSelf.bind(this);
    this.isSelf  = this.isSelf.bind(this);
    this._uniqID  = this._uniqID.bind(this);
    this.toRegex = this.toRegex.bind(this);
    this.toPrettyCSS = this.toPrettyCSS.bind(this);
    this._takeCSS = this._takeCSS.bind(this);
    this.update = this.update.bind(this);
  }

  static build( args ) {
    let resource = this._build( args );
    return resource;
  }

  static _build({ selector, cssText, href, id }) {
    if (selector) {
      return new Resource(selector,cssText,href,id);
    } else {
      console.log( "RESOURCE DOES NOT HAVE SELECTOR", "\n",selector,"\n",cssText,"\n",href,"\n",id );
    }
  }

  get id() { 
    return this._id; 
  }

  set id(ID) { 
    this._id = ID; 
  }

  update( resource = {} ) {
    let _this = this;
    try {
      Object.keys( resource ).forEach( function( key ) {
            if ( key == 'id' ) {
                _this.id = _this._uniqID();
            } else {
                _this[key] = resource[key];
            }
      })
    } catch( e ) {
      console.log( e, "THERE WAS AN ERROR UPDATING THE RESOURCE....");
      console.log( this, resource );
      return false;
    }
    return true
  }


  setID( id ) {
    if ( this.isNew() ) {
        id = this._uniqID( id );
        // id = ShaService.toSha( id );
        this.id = id;
      }
  }


  isNew() { 
    return this.id ?? true; 
  }

  hasChanged( other ) {
    return this.cssText != other.cssText;
  }

  findSelf( resources ) {
    let _this = this;
    let _self = resources.filter( function( r ) { 
      return _this.isSelf( r ) 
    });
    
    return _self[0] ?? false;
  }

  isSelf( other ) { 
    return this.id === other.id; 
  }


  _uniqID(id) { 
    return id ?? this.selector + this.cssText + this.href; 
  }

  toRegex() {
    return buildRegex( this.cssText );
  }

  toPrettyCSS() {
    let formatted, old;

    old       = this._takeCSS();
    formatted = formatCSS( old );

    if ( formatted ) {
      return this.cssText.replace( old, formatted );
    }
  }

  _takeCSS() {
    console.log('THIS IS INSIDE TAKECSS....', JSON.parse(JSON.stringify( this )));
    let m = this.cssText.match( CSS_REG );
    if ( m ) {
      return m[0];
    }
  }
}


module.exports.Resource = Resource;
// export default Resource;

