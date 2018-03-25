var fs = require("fs");
var url = require("url");
var path = require("path");
var http = require("http");
var fileDirectoy = path.resolve(".");

var server = http.createServer(function(request , response) {
  var pathname = url.parse(request.url).pathname;
  var fileType = pathname.substr(1).split(".")[1];

  console.log(pathname.substr(1).split(".")[0]);

  fs.readFile(pathname.substr(1) , function(error , data) {
    if(error) {
      console.log("Error: " + error);
      response.writeHead(404 , {
        "Content-Type" : "text/html"
      });
    }
    else {
      if(fileType === "mpd") {
        response.writeHead(200 , {
          "Content-Type" : "application/dash+xml",
          "Connection" : "keep-alive",
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Headers" : "Range"
        });
        response.write(data);
      }
      else if(fileType === "mp4") {
        fs.stat(pathname.substr(1) , function(error , data) {
          if(error) {
            console.log("Error: " + error);
          }
          else {
            if(data.isFile()) {
              var contentLen = data.size;
              console.log("ContentLen: " + contentLen);
              console.log(data);
              response.writeHead(200 , {
                "Content-Type" : "video/mp4",
                "Connection" : "keep-alive",
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Headers" : "Range",
                "Content-Length" : contentLen
              });
            }
          }
        });
        response.write(data);
      }
      else {
        console.log(request.url);
      }
    }
    response.end();
  });
});
server.listen(8080 , "127.0.0.3");
console.log("Server running at http://127.0.0.3:8080")
