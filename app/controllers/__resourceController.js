const { Resource } = require('../models/resource.js');
const { ResourceRepo } = require('../repos/resourceRepo.js');

const ResourceControllerHelper = {
  buildResources: (resources) => {
    ({ build } = Resource);
    return resources.map(build)
  },

  beforeAction: (actions=[], callback) => {
    let _action, origin;
    actions.forEach((action) => {
        origin = Object.assign(ResourceController[action]);
        _action = (args) => {  
            args = callback(args);
            origin(args);
         };
        ResourceController[action] = _action;
    })
  }
}





const ResourceController = {
  init: (repo, strategy) => {
    ({ beforeAction } = ResourceControllerHelper);
    this.resourceRepo = repo;
    this.strategy = strategy;
    beforeAction(['analyze'], this.ResourceController.setParams);
    return this.ResourceController;
  },

  analyze: (_newResources) => {
    let resources = this.resourceRepo.getResources();
    _newResources = ResourceRepo.buildResources(_newResources);
    let res = this.strategy.doAnalyze(resources, _newResources);
    // console.log('THIS IS RES: ', res);
    // console.log(res.length)
  },

  setParams: (params) => {
    params = params.data;
    return params;
  }
}


module.exports.ResourceController = ResourceController;




