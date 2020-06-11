const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

const app = () => {
  this.app = new Application({
    // Your electron path can be any binary
    // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
    // But for the sake of the example we fetch it from our node_modules.
    path: electronPath,

    // Assuming you have the following directory structure

    //  |__ my project
    //     |__ ...
    //     |__ main.js
    //     |__ package.json
    //     |__ index.html
    //     |__ ...
    //     |__ test
    //        |__ spec.js  <- You are here! ~ Well you should be.

    // The following line tells spectron to look and use the main.js file
    // and the package.json located 1 level above.
    args: [path.join(__dirname, '../')],
    chromeDriverArgs: ["--disable-extensions"],
    env: {
    SPECTRON: true,
    ELECTRON_ENABLE_LOGGING: true,
    ELECTRON_ENABLE_STACK_DUMPING: true
    },
  })

  return this.app
}

describe('Application launch', function () {
   _this = this;

  jest.setTimeout(10000);
  // beforeEach(function () {
  //   _this.app = new Application({
  //     // Your electron path can be any binary
  //     // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  //     // But for the sake of the example we fetch it from our node_modules.
  //     path: electronPath,

  //     // Assuming you have the following directory structure

  //     //  |__ my project
  //     //     |__ ...
  //     //     |__ main.js
  //     //     |__ package.json
  //     //     |__ index.html
  //     //     |__ ...
  //     //     |__ test
  //     //        |__ spec.js  <- You are here! ~ Well you should be.

  //     // The following line tells spectron to look and use the main.js file
  //     // and the package.json located 1 level above.
  //     args: [path.join(__dirname, '../')],
  //     chromeDriverArgs: ["--disable-extensions"],
  //     env: {
  //     SPECTRON: true,
  //     ELECTRON_ENABLE_LOGGING: true,
  //     ELECTRON_ENABLE_STACK_DUMPING: true
  //     },
  //   })
  //   // return this.app.start().then( () => { 
  //   //   this.app.client.waitUntilWindowLoaded();
  //   //   this.app.browserWindow.show();
  //   //   // console.log(this);

  //   //   return this.app
  //   // } )

  //   return _this.app;

  // })

  // afterEach(function () {
  //   if (_this.app && _this.app.isRunning()) {
  //     return _this.app.stop()
  //   }
  // })

  it('shows an initial window', function () {
    this.app = app();
    // // console.log( this.app.client );
    return this.app.start().then(() => {
      jest.setTimeout(10000); 
      // console.log(this.app);
      return this.app.client.getWindowCount().then(function (count) {
        return assert.equal(count, 11)
      })
    });
  })
})
