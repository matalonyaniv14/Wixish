const { Resource } = require('../models/resource.js');
const { ResourceRepo } = require('../repos/resourceRepo.js');

class ResourceController {
  constructor({ ...args }) {
      this.resourceRepo = args.repo;
      this.strategy = args.strategy;

      this.analyze = this.analyze.bind(this);
  }

  analyze( _newResources ){
      let resources, res, _this;
      
      _this = this;
      resources     = this.resourceRepo.resources;
      _newResources = ResourceRepo.buildResources( _newResources.data );
      res           = this.strategy.doAnalyze( resources, _newResources );
      
      this.resourceRepo.updateResources( res );
      this.resourceRepo.resetResources( _newResources );    
      console.log( res );
      console.log( res.length );
  }

}



module.exports.ResourceController = ResourceController;
// export default ResourceController;



// extension on load instructions
// 1. create all resources 
// 2. setInterval

// on interval instructions
// 1. updateAll resources
// 2.
