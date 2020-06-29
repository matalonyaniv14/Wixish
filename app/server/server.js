const http = require('http');
const hostname = '127.0.0.1';
const port = 3002;
let body = '';


class Server{
  constructor(){
    this.resourceController = null;

    this._createServer  = this._createServer.bind(this); 
    this.serve  = this.serve.bind(this); 
    this.setController  = this.setController.bind(this); 
    this.getController  = this.getController.bind(this); 
    // this.analyze  = this.analyze.bind(this); 
    this.init  = this.init.bind(this);  
  }

 static _createServer()  {
    http.createServer(this.serve).listen(port, hostname, function()  {
      // console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
  static serve(req, res)  { 
    // console.log(req.url);
    PATHS[req.url](req, res);
  }
  static setController(controller)  { 
    this.resourceController = controller; 
  }

  static getController()  { 
      return Server.resourceController;
  }
  

  static analyze(body, res)  {
      Server.resourceController.analyze(body);
      res.writeHead(200, {'Content-Type': 'json'});
      res.write(JSON.stringify({ok: true}));
      res.end();
  }

  static update_src_resources( body, res ) {
      Server.resourceController.update_src_resources( body );
      res.writeHead(200, {'Content-Type': 'json'});
      res.write(JSON.stringify({ok: true}));
      res.end();
  }

  static routes(){
    return {
      analyze: function(){ Server.analyze }
    }
  }

  static init(controller)  {
    // console.log("IN SERVER... \n\n" + controller + "\n\n" + JSON.stringify(this) + JSON.stringify(Server) );
    this.setController(controller);
    this._createServer();
  
  }
}



const PATHS = {
  '/analyze': function(req, res)  { 
    RequestHelper.getData(req, function(data) {
      Server.analyze(JSON.parse(data), res);
      body = '';
    });
  }
  // '/update_src_resources': function( req, res ) {
  //     RequestHelper.getData(req, function(data) {
  //         Server.update_src_resources( JSON.parse( data ), res );
  //         body = '';
  //     }
  // }
}


class  RequestHelper {
  static getData(req, callback)  {
    req.on('data' , function(data)  {
      body += data;
    })
    req.on('end', function() { callback( body ) })
  }
}





// const Server = {
//   // init: function(controller)  {
//   //   // console.log("IN SERVER... \n\n" + controller + "\n\n" + JSON.stringify(this) + JSON.stringify(Server) );
//   //   ({ setController, _createServer } = this.Server);
//   //   setController(controller);
//   //   _createServer();
 
//   // },
//   _createServer: function()  {
//     ({ serve } = this.Server);
//     http.createServer(serve).listen(port, hostname, function()  {
//       // console.log(`Server running at http://${hostname}:${port}/`);
//     });
//   },
//   serve: function(req, res)  { 
//     // console.log(req.url);
//     PATHS[req.url](req, res);
//   },
//   setController: function(controller)  { 
//     this.Server.resourceController = controller; 
//   }, 
//   con: {
//     getController: function()  { 
//       return this.Server.resourceController
//     },
//   },
//   routes: {
//     analyze: function(body, res)  {
//       ({ analyze } = this.Server.getController());
//       analyze(body);
//       res.writeHead(200, {'Content-Type': 'json'});
//       res.write(JSON.stringify({ok: true}));
//       res.end();
//     }
//   },
//   init: function(controller)  {
//     // console.log("IN SERVER... \n\n" + controller + "\n\n" + JSON.stringify(this) + JSON.stringify(Server) );
//     ({ setController, _createServer } = this.Server);
//     setController(controller);
//     _createServer();
  
//   }
// }






module.exports.Server = Server;
// export default Server;
