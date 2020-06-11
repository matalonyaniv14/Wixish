

const { DirService } = require('../services/dirService.js');
const { GraphService } = require('../services/graphService.js');
// const { Stack } = require('../models/stack');
// const { Link } = require('../models/Link');
// const { Node } = require('../models/node');
const { NodeGraph } = require('../models/nodeGraph');

class SourceFilesBuilder {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.dirService = null;
    this.graphService = null;
    
    this.build = this.build.bind(this);
    this.copyCSSSourceFiles  =  this.copyCSSSourceFiles.bind(this); 
    this.findDependentCSS  =  this.findDependentCSS.bind(this); 
    this.addDependentToLocalDirectory  =  this.addDependentToLocalDirectory.bind(this); 
  }


  build() {
    this.dirService = new DirService(this.rootDir, ['.css']);
    this.copyCSSSourceFiles();
    this.findDependentCSS();
    this.addDependentToLocalDirectory();
  }


  copyCSSSourceFiles() {
    this.dirService.rootDir = this.rootDir;
    this.dirService.moveAndStoreFiles(this.rootDir);
  }


  findDependentCSS() {
    let nodeGraph    =  new NodeGraph( this.dirService.pathArray );
    this.graphService =  new GraphService( nodeGraph );
    this.graphService.perform()
  }

  addDependentToLocalDirectory() {
    this.dirService.includedFiles = this.graphService.inPlayPaths;
    this.dirService.addFileToLocal();
  }
}


module.exports.SourceFilesBuilder = SourceFilesBuilder;
