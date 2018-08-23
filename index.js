//const logger = require('tracer').console();

const http = require("http");
let app = require('express')();
let server = http.createServer(app);
server.listen(8000);

let io = require('socket.io')(server);

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/routes' + '/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('get post by index', function (data) {
        let index = data.index;
        let archive = readArchive().posts[index];
        console.log(archive);
        socket.emit('post by index', {post: archive.posts[index]});
    });
});


const archivePath = "/archive/arc.json";
const util = require("util");
const fs = require("fs");
const {stat} = require("fs").promises;

// Convert fs.readFile into Promise version of same
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function addToArchive(jsonPost) {
    let archive = await readArchive();
    archive.posts = archive.posts.push(jsonPost);
    return archive;
}

async function readArchive() {
    let stats;
    try {
        stats = await stat(archivePath);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        else return {status: 404, body: "Archive file not found!"};
    }
    //return readStreamPromise(createReadStream(archivePath));
    return await readFileAsync(archivePath);
}

async function saveArchive(updatedArchive) {
    await writeFileAsync(archivePath, updatedArchive);
}

/*
function readStreamPromise(from) {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        from.on("finish", resolve);
    })
}
*/