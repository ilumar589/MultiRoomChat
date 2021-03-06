/**
 * Created by WolframAlpha on 9/20/2015.
 */

var http = require('http');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

/**
 *
 *  The cache object will contain property names equivalent to path names
 *  and the data stored in the respective paths will be the file contents for the path name
 */
var cache = {};

function send404(response){
    response.writeHead(404,{'Content-Type' : 'text/plain'});
    response.write('Error 404: resource not found');
    response.end();
}

function sendFile(response,filePath,fileContents){
    response.writeHead(200,{'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}


function serveStatic(response,absPath){
    if (cache[absPath]){
        sendFile(response,absPath,cache[absPath]);
    }else{
        fs.exists(absPath,function(exists){
            if(exists){
                fs.readFile(absPath,function(err,data){
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                })
            }else{
                send404(response);
            }
        })
    }
}


var server = http.createServer(function(request,response){
    var filePath = false;
    if (request.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;

    serveStatic(response,absPath);
});

server.listen(3000,function(){
   console.log("Server listening on port 3000");
});

// websocket zone

var chatServer = require('./libs/chat_server');
chatServer.listen(server);