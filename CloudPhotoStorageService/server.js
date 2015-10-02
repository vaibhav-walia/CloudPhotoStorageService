function start(port, route, handle, args) {
  var http = require("http"),
    mongodb = require('mongodb'),
    url = require("url");
  var uri = "mongodb://" + args[0] + ":" + args[1] + "@ds051833.mongolab.com:51833/cloudphotostorage";
  //        var dbServer = new mongodb.Server(uri);
  //var photos;
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    else {
      console.log('connected to mongodb');
      var pictures = db.collection('mongodbphotostore');
      http.createServer(function(request, response) {
        var responseHeaders = {
          "Access-Control-Allow-Origin": "*",
          "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
          "access-control-allow-headers": "content-type, accept",
          "access-control-max-age": 10,
          "Content-Type": "application/json"
        };
        console.log(request.method);
        if (request.method == 'OPTIONS') {
          console.log('here');
          response.writeHead(200, responseHeaders);
          response.end();
        }
        var path = url.parse(request.url).pathname;
        route(handle, path, request, response, pictures);
        response.writeHead(200, {
          "Content-Type": "text/plain"
        });
      }).listen(port);
      console.log("server has started listening on port " + port);
    }
  });
}
exports.start = start;
