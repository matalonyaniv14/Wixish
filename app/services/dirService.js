const { resolve, extname, dirname } = require('path');
const { readdirSync, writeFile } = require('fs');
const { copy } = require('fs-extra');

class DirService {
    constructor(root, exts) {
      this.rootDir = root;
      this.exts = exts;
      this.pathArray = [];
      this.count = 0;
      this.includedFiles = [];


      this.validatePath  = this.validatePath.bind(this);
      // this.perform = this.perform.bind(this);
      this.moveAndStoreFiles = this.moveAndStoreFiles.bind(this);
      this.takeAllFiles = this.takeAllFiles.bind(this);
      this.handleFile = this.handleFile.bind(this);
      this.storeFilePath = this.storeFilePath.bind(this);
     
      this.formatPath  = this.formatPath.bind(this);
      this.addFileToDir  = this.addFileToDir.bind(this);
      this.addFileToPathArray  = this.addFileToPathArray.bind(this);
      this.isNodeModule  = this.isNodeModule.bind(this);
      this.isIncluded  = this.isIncluded.bind(this);
      this.isExists  = this.isExists.bind(this);
    }

    
    // perform() {
    //   this.moveAndStoreFiles(this.rootDir);
    // }

    moveAndStoreFiles(dir) {
      this.takeAllFiles(dir, this.handleFile);
    }


    takeAllFiles(dir, callback) {
      const dirents = readdirSync(dir, { withFileTypes: true });
      for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        callback(res, dirent);
      }
    }

    handleFile(res, dirent) {
      if (dirent.isDirectory()) {
        this.moveAndStoreFiles(res);
      } else {
        this.storeFilePath(res);
      }
    }


    storeFilePath(path) {
      let _path, _this;
      _this = this
      this.exts.forEach(function(ext){
        if (_this.validatePath(path, ext)) {
          _path = _this.formatPath(path, ext) 
          // check if file exists?
          if ( _this.isIncluded( path ) ) {
            _this.addFileToDir( path,  _path );
          }
          // _this.addFileToPathArray(_path);
          _this.addFileToPathArray(path);
        }
      }) 
    }


    validatePath(file, ext) {
      // if ( this.isUnixHiddenPath(file) ) return false;
      if ( this.isNodeModule( file ) ) return false;

      let _ext = extname( file );
      return _ext === ext;
    }

    formatPath(path, ext) {
      let _ext  =  ext.replace('.', '');
      let uwd   =  process.cwd() + "/UserCopy/" + _ext.toUpperCase();
      let _path =  path.replace(this.rootDir, uwd);

      return _path;
    }

    addFileToLocal() {
      let _this = this;
      this.includedFiles.forEach( function( file ) {
          _this.storeFilePath( file );
      })
    }
    

    addFileToDir(file, copyPath) {
      copy(file, copyPath, function(err) {
        if (err) console.log(err);
      });
    }

    addFileToPathArray(path) {
      if ( !this.isExists( path ) ) {
        this.count += 1;
        this.pathArray.push(path);
      }
    }


    isNodeModule(f) { 
      return f.split('/').some(function( f ) { return f === 'node_modules' });
    };

    isIncluded(path) {
      return this.includedFiles.some( function( p ) { return p === path } );
    };
    
    isExists(path) { 
      return this.pathArray.some( function( p ){ return  p === path });
    };
    // isUnixHiddenPath = (path) => {
    //     return (/(^|\/)\.[^\/\.]/g).test(path);
    // };
}



// export default DirService
 module.exports.DirService = DirService;
