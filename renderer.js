// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require('electron');
const { Resource } = require('./app/models/resource.js')

function takeAllStylesheets(){
  // console.log( 'TAKE ALL SHEETS.........' )
  let res, resource, stylesheets;
  res = {data: []};

  // does not return resource object 
  // does not handle objects with out selector (media queries)
  _stylesheets = [...document.styleSheets];
  for (sheet of _stylesheets) {
    ({href} = sheet);
    for (css of  sheet.cssRules) {
      ({selectorText, cssText} = css );
      resource =  new Resource(selectorText,cssText,href);
      res.data.push(resource);
    }
  }
  return res;
}


function setupPageLinks(){
   // console.log( 'TAKE ALL SHEETS.........' )
  let stylesheets = ipcRenderer.sendSync('DirService', '');
  let base = document.querySelector('head');

  return [stylesheets, base];
}


function createLink(rel, href) {
  let userStyle = document.createElement('link');
  userStyle.setAttribute('rel', rel);
  userStyle.setAttribute('href', href);

  return userStyle;
}


function initLinks() {
  [stylesheets, base] = setupPageLinks();
  stylesheets.forEach( function(sheet) {
    link = createLink('stylesheet', sheet);
    base.appendChild(link);
  })
  setTimeout( function(){
    let res = takeAllStylesheets();
    ipcRenderer.sendSync('resources', res);
  },100)
}



initLinks();
