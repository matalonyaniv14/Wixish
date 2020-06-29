const COMMENT_BOUNDARY = String.raw`\s*(\s*\/\*[\s\w]*\*\/\s*)*\s*`;
const SPECIAL_CHARS_ANCHOR = /[\.\#\(\)\s+:]/gi;
const CSS_TEXT_ANCHOR =  /[{}:;]/gi;

const makeLiteral = ( match ) => {
  // return `\\${ match }`;
  return "\\s*" + `\\${ match }` + "\\s*"
}

const addCommentBoundary = ( match ) => {
  return match + COMMENT_BOUNDARY;
}

const takeCSSText = ( css ) => {
  let m = css.match( /{.*}/ );
  if ( m ) {
    return m[0];
  }
}


const buildSelector = ( css ) => {
  let selector, formattedSelector;

  selector = css.replace( takeCSSText( css ), '' );
  formattedSelector = selector.split('').join( String.raw`\s*` );
  
  return css.replace( selector, formattedSelector ); 
}


const buildCSSText = ( css ) => {
  let anchors, cssText, safeCSS;

  cssText = takeCSSText( css );

  if ( cssText ) {
    
    safeCSS = cssText.replace( CSS_TEXT_ANCHOR, addCommentBoundary );
    css = css.replace( cssText, safeCSS );

    return css;
  }
  
  return false;
}

const makeSpecialCharsLiteral = ( css ) => {
  css = css.replace( SPECIAL_CHARS_ANCHOR, function(match) {
    if ( /\s/.test( match ) ) {
        match = 's*';
    }

     return makeLiteral( match );
  })

  return css;
}

const build = ( css ) => {
  if ( css ) {
    return new RegExp(css, 'is');
  }
}


const buildRegex = ( css ) => {
  css = makeSpecialCharsLiteral( css );
  // css = buildSelector( css );
  css = buildCSSText( css );
  css = build( css );

  return css;
}



module.exports.buildRegex = buildRegex;

