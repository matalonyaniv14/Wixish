const { copy, readFileSync, writeFileSync } = require('fs-extra');

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
        if ( _this.updateResource( o, n ) ) {
            _this.resetResources( o, n );
        }
    })
  }


  updateResource(resource, newResource ){
      let href    = this._decodeURI( resource.href );
      let cssFile = this.readResource( href );

      if ( cssFile ) {
          console.log("Resource Found.... =>  " + ( resource.href ));
          console.log("Resource Regex.... =>  " + ( resource.toRegex() ));
          console.log('WAS REGEX FOUND IN FILE  ==> '  + resource.toRegex().test( cssFile ) );
          if (  resource.toRegex().test( cssFile ) ) {
            cssFile = cssFile.replace( resource.toRegex(), newResource.toPrettyCSS );
            // confirm cssFile not empty;
            this._writeFile( href, cssFile );

            return true;
          }
      } else {
        console.log('RESOURCE CSS FILE NOT FOUND FOR => ', JSON.stringify( resource ) );
      }

      return false;
  }



  resetResources( o, n ) {   
      let resource = n.findSelf( this.resources );
      resource.update( { cssText: n.cssText } );
      this.resetResourceID( resource );
  }

  resetResourceID( resource ) {
      resource.update( { id: undefined } );

  }


  readResource( href )  {     
    try {
        console.log( 'INSIDE READ RESOURCE..... ==> ' + href );
        return readFileSync( href, 'utf-8' );

     } catch( e ) {
          console.log( 'THERE WAS AN ERROR READING FILE URI....', e );
          return false;
     }

    
  }


  _writeFile( path, css ) {
      try {

          writeFileSync( path, css ); 

      } catch( e ) {
          console.log( "THERE WAS AN ERROR WRITING TO THE FILE ==> " + e );
      }
      
  }


  _decodeURI( href ) {
      try {

          href = href.replace( FILE_REG, '/' );
          return decodeURI( href );

       } catch( e ) {
            console.log( 'THERE WAS AN ERROR DECODING FILE URI....', e, href );
            return false;
       }

  }
}




module.exports.ResourceRepo = ResourceRepo;
