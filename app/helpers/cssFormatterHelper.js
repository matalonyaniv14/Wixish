const formatCSS = ( css ) => {
    return css.replace( /[{};]/g, ( match ) =>  {
        if ( /{/.test( match ) ) {
            return match + "\n\n\t";
        }

        if ( /}/.test( match ) ) {
            return "\n" + match + "\n\n";
        }

        return match + "\n\t";
    })
}


module.exports.formatCSS = formatCSS;
