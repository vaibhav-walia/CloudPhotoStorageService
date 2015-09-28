
function start(port,route,handle,args){
        var http = require("http"),
        mongodb = require('mongodb'),
        url = require("url");
        var uri ="mongodb://"+args[0]+":"+args[1]+"@ds051833.mongolab.com:51833/cloudphotostorage";
//        var dbServer = new mongodb.Server(uri);
        //var photos;
        mongodb.MongoClient.connect(uri,function(err,db){
        if(err){
          console.log(err.message);
          throw err;
        }
        else{
          console.log('connected to mongodb');
          var pictures = db.collection('photostore');
          http.createServer(function(request,response){
          var path = url.parse(request.url).pathname;
          route(handle,path,request,response,pictures);
          response.writeHead(200,{"Content-Type":"text/plain"});
          }).listen(port);
          console.log("server has started listening on port "+port);
         }
       });
}
exports.start = start;                                          
