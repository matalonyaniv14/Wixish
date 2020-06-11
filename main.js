// Modules to control application life and create native browser window
// console.log( 'IN MAIN...' );

const {app, BrowserWindow, webContents, ipcMain, dialog  } = require('electron');
const path = require('path');
const fs = require('fs');

const { Resource } =  require('./app/models/resource.js');
const { ResourceRepo } = require('./app/repos/resourceRepo.js');
const { ResourceController } = require('./app/controllers/resourceController.js');
const { BaseStrategy } = require('./app/strategies/baseStrategy.js');
const { CSSStrategy } = require('./app/strategies/cssStrategy.js');
const { Server } = require('./app/server/server.js');
const { SourceFilesBuilder } = require('./app/builders/sourceFilesBuilder.js');

let resourceRepo, resources, sourceBuilder;

sourceBuilder || ( sourceBuilder = new SourceFilesBuilder(''));

ipcMain.on('DirService', function(event, arg){
  // console.log(sourceBuilder);
  event.returnValue = sourceBuilder.dirService.includedFiles;
})


ipcMain.on('resources', function(e, arg) {
  resources = ResourceRepo.buildResources(arg.data);
  // console.log('RESOURSES....', resources);
  let repo      = new ResourceRepo(resources);
  let strategy  = new CSSStrategy();

  let resourceController = new ResourceController({ repo, strategy });
  // let server = new Server();
  Server.init(resourceController);
  e.returnValue = 0;
})


function initWindow(e) {
  dialog.showOpenDialog({ properties: ['openDirectory'] })
    .then((data) => {
      sourceBuilder.rootDir = data.filePaths[0];
      // sourceBuilder.rootDir = '/Users/yanivmatalon/Desktop/TOADS/comminity 2/';
      sourceBuilder.build();
      createWindow();
    })


}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  mainWindow.loadFile('index.html')
  // mainWindow.webContents.openDevTools()
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(initWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow() 
})


module.exports.initWindow = initWindow;
// export default initWindow;

// Extension: /Users/yanivmatalon/Desktop/projects/chrome_test.crx
// Key File: /Users/yanivmatalon/Desktop/projects/chrome_test.pem
