var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');
const fs = require('fs');

http.createServer(function(req, res) {

	// Default to index.html (login screen) if there is no resource url specified
	if(req.method === 'GET' && req.url === "/"){
		var filePath = path.join(__dirname, "/index.html");
		var stat = fileSystem.statSync(filePath);

		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': stat.size
		});

		var readStream = fileSystem.createReadStream(filePath);
		readStream.pipe(res);
	}

	// Sends HTML files
	if(req.method === 'GET' && req.url.substring(req.url.length - 5, req.url.length) === ".html"){
		var filePath = path.join(__dirname, req.url);
		if (fs.existsSync(filePath)){
			var stat = fileSystem.statSync(filePath);

			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': stat.size
			});

			var readStream = fileSystem.createReadStream(filePath);
			readStream.pipe(res);
		}
		else{
			res.writeHead(404, {"content-type": "text/plain"});
			res.end("Error 404: HTML file '" + req.url + "' not found");
		}
	}

	// Sends .css files
	if(req.method === 'GET' && req.url.substring(req.url.length - 4, req.url.length) === ".css"){
		var filePath = path.join(__dirname, req.url);
		if (fs.existsSync(filePath)){
			var stat = fileSystem.statSync(filePath);

			res.writeHead(200, {
				'Content-Type': 'text/css',
				'Content-Length': stat.size
			});

			var readStream = fileSystem.createReadStream(filePath);
			readStream.pipe(res);
		}
		else{
			res.writeHead(404, {"content-type": "text/plain"});
			res.end("Error 404: Image file '" + req.url + "' not found");
		}	
	}

	// Sends .js files
	if(req.method === 'GET' && req.url.substring(req.url.length - 3, req.url.length) === ".js"){
		var filePath = path.join(__dirname, req.url);
		if (fs.existsSync(filePath)){
			var stat = fileSystem.statSync(filePath);

			res.writeHead(200, {
				'Content-Type': 'text/javascript',
				'Content-Length': stat.size
			});

			var readStream = fileSystem.createReadStream(filePath);
			readStream.pipe(res);
		}
		else{
			res.writeHead(404, {"content-type": "text/plain"});
			res.end("Error 404: Image file '" + req.url + "' not found");
		}
	}

	// Sends image files
	if(req.method === 'GET' && req.url.substring(0, 8) === "/images/"){
		var filePath = path.join(__dirname, req.url);
		if (fs.existsSync(filePath)){
			var stat = fileSystem.statSync(filePath);

			res.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': stat.size
			});

			var readStream = fileSystem.createReadStream(filePath);
			readStream.pipe(res);
		}
		else{
			res.writeHead(404, {"content-type": "text/plain"});
			res.end("Error 404: Image file '" + req.url + "' not found");
		}
	}


}).listen(80);