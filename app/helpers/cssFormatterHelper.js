const formatCSS = ( css ) => {
    return css.replace( /[{};]/g, ( match ) =>  {
        return match + "\n\t";
    })
}


module.exports.formatCSS = formatCSS;
