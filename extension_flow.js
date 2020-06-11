
class Resource {
  constructor( selector, cssText, href, id ) {
    this.selector = selector;
    this.cssText = cssText;
    this.href = href;
    this.setID( id );
  }


  get id() { return this._id; }
  set id(ID) { this._id = ID; }



  setID = ( id ) => {
    if ( this.isNew() ) {
        id = this._uniqID( id );
        // id = ShaService.toSha( id );
        this.id = id;
      }
  }

  isNew() { 
    return this.id ?? true; 
  }

  hasChanged = ( other ) => {
    return this.cssText != other.cssText;
  }

  findSelf = ( resources ) => {
    let _self = resources.filter( r => this.isSelf( r ) );
    return _self[0] ?? false;
  }

  isSelf = ( other ) => { 
    return this.id === other.id; 
  }


  _uniqID = (id) => { 
    return id ?? this.selector + this.cssText; 
  }


  static build = ( args ) => {
    let resource = this._build( args );
    return resource;
  }

  static _build = ({ selector, cssText, href, id }) => {
    if (selector) {
      return new Resource(selector,cssText,href,id);
    }
  }
}



const takeAllStylesheets = () => {
  let res, resource, stylesheets;
  res = {data: []};

  // does not return resource object 
  // does not handle objects with out selector (media queries)
  _stylesheets = [...document.styleSheets];

  for (sheet of _stylesheets) {
    ({href} = sheet);

    try {

      for (css of  sheet.cssRules) {
        ({selectorText, cssText} = css );

        resource =  new Resource(selectorText,cssText,href);
        res.data.push(resource);

      }
    } catch {}
  }

  return res;
}




let updateAll = () => {
    res = JSON.stringify( res );
    res = res.split( '_id' ).join( 'id' );
    res = JSON.parse(res);
    res.data.forEach((r) => {
      try {
          [...document.styleSheets].forEach((s) => {
              newcss = [...s.cssRules].filter(rr => rr.selectorText === r.selector);
              r.cssText = newcss[0].cssText; // console.log('change');
          })
      } catch {}
    })

    return JSON.stringify( res );
}



res = takeAllStylesheets();
fetch('http://localhost:3002/analyze', { method: 'POST', mode: 'no-cors', body: updateAll() })
