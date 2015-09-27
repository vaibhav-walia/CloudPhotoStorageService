var fs = require("fs"),
formidable = require("formidable");

function start(request,response,pictures){
// console.log("start called");
 pictures.find().toArray(function(err,results){

  if(results){
  // results.forEach(function(result){
   response.writeHead(200, {"Content-Type": "text/html"}); 

   var body = '<html>'+
  '<head>'+
  '<meta http-equiv="Content-Type" '+
  'content="text/html; charset=UTF-8" />'+
  '</head>'+
  '<body>'+
  '<form action="/upload?album="album2"" enctype="multipart/form-data" '+
  'method="post">'+
  '<input type="file" name="upload" multiple="multiple">'+
  '<input type="submit" value="Upload file" />'+
  '</form>'+
  '</body>'+
  '</html>'; 

  response.end(body);  
 // }); 
  }
});
}

function upload(request,response,pictures){
 var url = require("url");
 var querystring = require('querystring');
 var query = url.parse(request.url,true).query;
 var album = query["album"];
 if(!album) album = 'album1';
 var form = new formidable.IncomingForm();
 form.parse(request,function(error,fields,files){
   console.log(request);
   if(error) throw error;
    if(files.upload){
    var path = files.upload.path;
    var filename = files.upload.name;
    fs.readFile(path,function(err,data){
     if(err){ response.writeHead(500,{"Content-Type":"application/json"}); throw(err); };
     var base64data = new Buffer(data).toString('base64');
     pictures.find({album : album}).toArray(function(err,data){
     console.log("Error : "+err);
     console.log("Album :"+data);
     if(!data || data.length<1){
      var toInsert = {
                     album : album,
                     pictures : [{base64Img : base64data,filename : filename}],
                    };
       console.log(toInsert);
       pictures.insert(toInsert,function(err,data){
       response.writeHead(201,{"Content-Type":"application/json"});
       var toret = "{ \"album\" :\""+album+"\", \"filename\" : \""+filename+"\", \"url\" : \"/show?album='"+album+"'&filename='"+filename+"'\"}";
       response.end(toret);
      });
     }
     else{
         console.log(data[0]);
         console.log("here");
         var pics = data[0].pictures;
         pics.push({base64Img : base64data,filename : filename});
         pictures.update({ album : album },{album:album,pictures:pics},function(err,data){
         if(err){response.writeHead(500,{"Content-Type":"application/json"}); throw(err);  };
         console.log(data);
         response.writeHead(201,{"Content-Type":"application/json"});
         var toret = "{ \"album\" :\""+album+"\", \"filename\" : \""+filename+"\", \"url\" : \"/show?album='"+album+"'&filename='"+filename+"'\"}";
         response.end(toret);
         });
    }  
    });
    });
   }
   else{
    console.log(files);
    response.writeHead(400,{"Content-Type":"application/json"});
    response.end();
   }
 });    
}

function remove(request,response,pictures){
//	console.log("delete called");
 response.end();

}

function show(request,response,pictures){

 var url = require("url");
 var querystring = require('querystring');
 var query = url.parse(request.url,true).query;
 //console.log(query);
 //console.log(querystring.parse(request.url));
 var album = query["album"];
 var filename = query["filename"];
 console.log(album);
 if(!album || !filename) {
   console.log("album :"+album+"\n"+"filename:"+filename);
   response.writeHead(400,{"Content-Type":"application/json"}); 
   response.end();
 }
 else{
        pictures.find({album : album}).toArray(function(err,albums){
 		console.log(err)
                console.log(albums);
        	console.log("picture:"+albums[0].pictures);
       	        response.writeHead({"Content-Type":"text/html"});
       	        var body = "<html><body>";
      	        var images = "";
 		var pictures = albums[0].pictures;
 		var flag = ''; 
 		pictures.forEach(function(pic){
  			//var imageStr = JSON.stringify(pic.filename);
  			if(pic.filename == filename){
  				flag = 'x';
  				var i = "<img src=data:image/*;base64,"+pic.base64Img+" /><br>";
  				images = i + images ;
  			}
		});
 		if(flag == ''){
 			response.writeHead(404,{"Content-Type":"text/html"});
 			response.end();
	 	}
 		else{
 			response.writeHead(200,{"Content-Type":"text/html"});
 			body = body+images+"<body></html>";
 			response.end();
 		} 
        });
 }
}

exports.start = start;
exports.upload = upload;
exports.remove = remove;
exports.show = show;
