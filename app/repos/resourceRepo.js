const { copy, readFileSync, writeFile } = require('fs-extra');

const { BaseRepo } = require('../repos/BaseRepo.js');
const { Resource } = require('../models/resource.js');


const FILE_REG =  /file:\/{1,4}/;


class ResourceRepo extends BaseRepo {
  constructor( resources ) {
      super( resources );

      this.updateResource  = this.updateResource.bind(this);
      this.updateResources  = this.updateResources.bind(this);
      this.resetResources = this.resetResources.bind(this);
  }


  updateResources( newResources ) {
    let _this = this;
    newResources.forEach( function( { o, n } ) {
        _this.updateResource( o, n );
    })

    // this.resetResources( newResources );
  }


  updateResource(resource, newResource ){
      let href    = this._decodeURI( resource.href );
      let cssFile = this.readResource( href );

      if ( cssFile ) {
         console.log("Resource Found.... =>  " + ( resource.href ))

          cssFile = cssFile.replace( resource.toRegex(), newResource.toPrettyCSS );
          // confirm cssFile not empty;
          
          this._writeFile( href, cssFile );

          return true;
      }

      return false;
  }


  resetResources( newResources ) {
    let _this     = this;
    let _resources = newResources.map( function( resource ) {
          let old       = resource.findSelf( _this.resources );
          resource.href = old.href;
          return resource;
    })

   this.resources = _resources;
  }


  readResource( href )  {     
    try {

        return readFileSync( href, 'utf-8' );

     } catch( e ) {
          // console.log( 'THERE WAS AN ERROR DECODING FILE URI....', e );
     }

    return false;
  }


  _writeFile( path, css ) {
      writeFile( path, css, ( e ) =>
          console.log( "File written.. => errors if any", e ) 
      ); 
  }


  _decodeURI( href ) {
      try {

          href = href.replace( FILE_REG, '/' );
          return decodeURI( href );

       } catch( e ) {
            // console.log( 'THERE WAS AN ERROR DECODING FILE URI....', e );
          return false;
       }

  }
}




module.exports.ResourceRepo = ResourceRepo;
