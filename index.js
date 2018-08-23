//const logger = require('tracer').console();

const http = require("http");
let express = require('express');
let app = express();
let server = http.createServer(app);
server.listen(8000);

let io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/public' + '/routes' + '/index.html');
});

//io.origins('*:*');

io.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('get post by index', function (data) {
        let index = data.index;
        let post = readArchiveSync().posts[index] || readArchiveSync().posts[0];
        console.log(post);
        socket.emit('post by index', {post: post});
    });
    socket.on('write mode published', (data) => {
        console.log(JSON.stringify(data));
        addToArchive(data);
    });
});


const archivePath = __dirname + "/public/archive/arc.json";
const util = require("util");
const fs = require("fs");
const {stat} = require("fs").promises;

// Convert fs.readFile into Promise version of same
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

function addToArchive(jsonPost) {
    let archive = readArchiveSync();
    archive.posts.push(jsonPost);
    saveArchive(archive);
}

function readArchiveSync() {
    stat(archivePath).then((err) => {
        if (err) {
            if (err.code !== "ENOENT") return {status: 500, body: err};
            else return {status: 404, body: "Archive file not found!"};
        }
    });
    let file = fs.readFileSync(archivePath);
    return JSON.parse(file);
}

async function readArchive() {
    // lots of problems with this, doesn't mesh well with sync IO
    let stats;
    try {
        stats = await stat(archivePath);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        else return {status: 404, body: "Archive file not found!"};
    }
    //return readStreamPromise(createReadStream(archivePath));
    let textArchive = await readFileAsync(archivePath);
    console.log(`TextArchive: ${textArchive}`);
    return JSON.parse(textArchive);
}

function saveArchive(updatedArchive) {
    console.log('got to saveArchive');
    fs.writeFileSync(archivePath, JSON.stringify(updatedArchive));
}

/*
function readStreamPromise(from) {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        from.on("finish", resolve);
    })
}
*/