var server = require("./server");

var router = require("./route");

var requestHandlers = require("./requestHandlers");

var handle = {};

var args = process.argv.slice(2);

handle["/"] = requestHandlers.start;

handle["/start"] = requestHandlers.start;

handle["/remove"] = requestHandlers.remove;

handle["/upload"] = requestHandlers.upload;

handle["/show"] = requestHandlers.show;

handle["/showAll"] = requestHandlers.showAll;

server.start(process.env.PORT, router.route, handle, args);
