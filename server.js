var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');
const fs = require('fs');

// MySQL connection setup
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "smart_course"
});

db.connect(err => {
    if (err) console.log("DB error:", err);
    else console.log("MySQL connected");
});

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
	else if(req.method === 'GET' && req.url.substring(req.url.length - 5, req.url.length) === ".html"){
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
	else if(req.method === 'GET' && req.url.substring(req.url.length - 4, req.url.length) === ".css"){
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
	else if(req.method === 'GET' && req.url.substring(req.url.length - 3, req.url.length) === ".js"){
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
	else if(req.method === 'GET' && req.url.substring(0, 8) === "/images/"){
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

    

    // Handles course creation with post request
else if (req.method === 'POST' && req.url === "/create-assessment") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const data = JSON.parse(body);

        const { course_id, name, weight } = data;

        const sql = ' INSERT INTO assessments (course_id, name, weight) VALUES (?, ?, ?)';

        db.query(sql, [course_id, name, weight], (err) => {
            if (err) {
                res.writeHead(500);
                return res.end("Database error");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Assessment created" }));
        });
    });
}

else if (req.method === 'GET' && req.url.startsWith("/assessments")) {

    const parts = req.url.split("/");
    const courseId = parts[2];

    const sql = "SELECT * FROM assessments WHERE course_id = ?";

    db.query(sql, [courseId], (err, results) => {
        if (err) {
            res.writeHead(500);
            return res.end("Database error");
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
}

else if (req.method === 'POST' && req.url === '/create-course') {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        const sql = "INSERT INTO courses (name, userID, term) VALUES (?, ?, ?)";

db.query(sql, [data.code, 1, data.term], (err, result) => {

    if (err) {
        console.log(err); 
        res.writeHead(500);
        return res.end("Database error");
    }

    res.writeHead(200);
    res.end("Course added");
});
    });
}

else if (req.method === 'GET' && req.url === '/courses') {

    const sql = "SELECT * FROM courses";

    db.query(sql, (err, results) => {
        if (err) {
            res.writeHead(500);
            return res.end("Database error");
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
    });
}

//add grade to database with post
else if (req.method === 'POST' && req.url === "/add-grade") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const data = JSON.parse(body);

        const { student_id, assessment_id, earned, total } = data;

        const sql = 'INSERT INTO grades (student_id, assessment_id, earned, total) VALUES (?, ?, ?, ?)';
        

        db.query(sql, [student_id, assessment_id, earned, total], (err) => {
            if (err) {
                res.writeHead(500);
                return res.end("Database error");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Grade added" }));
        });
    });
}

//get greade average 
else if (req.method === 'GET' && req.url.startsWith("/average")) {

    const parts = req.url.split("/");
    const studentId = parts[2];
    const courseId = parts[3];

    const sql = `
        SELECT g.earned, g.total, a.weight
        FROM grades g
        JOIN assessments a ON g.assessment_id = a.id
        WHERE g.student_id = ? AND a.course_id = ?
    `;

    db.query(sql, [studentId, courseId], (err, results) => {
        if (err) {
            res.writeHead(500);
            return res.end("Database error");
        }

        let totalWeighted = 0;
        let totalWeight = 0;

        results.forEach(r => {
            const percent = r.earned / r.total;
            totalWeighted += percent * r.weight;
            totalWeight += r.weight;
        });

        const avg = totalWeight ? (totalWeighted / totalWeight) * 100 : 0;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ average: avg.toFixed(2) }));
    });
}

// UPDATE assessment weight
else if (req.method === 'POST' && req.url === "/update-weight") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        const { weight, assessment_id, course_id } = data;

        const sql = `
            UPDATE assessments 
            SET weight = ?
            WHERE assessmentID = ? AND course_id = ?
        `;

        db.query(sql, [weight, assessment_id, course_id], (err) => {
            if (err) {
                res.writeHead(500);
                return res.end("Database error");
            }

            res.writeHead(200);
            res.end("Weight updated");
        });

    });
}

else if (req.method === 'POST' && req.url === "/delete-assessment") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const data = JSON.parse(body);

        const sql = "DELETE FROM assessments WHERE id = ?";

        db.query(sql, [data.id], (err) => {
            if (err) {
                res.writeHead(500);
                return res.end("Database error");
            }

            res.writeHead(200);
            res.end("Deleted");
        });
    });
}


	else{
		res.writeHead(404, {"content-type": "text/plain"});
		res.end("Error 404: File '" + req.url + "' not found");
	}
    



}).listen(80);
