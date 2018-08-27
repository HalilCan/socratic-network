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
    socket.on('get post by index', function (data) {
        let index = data.index;
        let post = readArchiveSync().posts[index] || readArchiveSync().posts[0];
        socket.emit('post by index', {post: post});
    });
    socket.on('write mode published', (data) => {
        console.log(JSON.stringify(data));
        addToArchive(data);
    });
    socket.on('get post count', () => {
        socket.emit('post count response', {postCount: readArchiveSync().posts.length});
    });
    socket.on('get archive backup', () => {
        socket.emit('archive backup', {backup: readArchiveSync()});
    });
    socket.on('get posts by label', (data) => {
        socket.emit('posts by label response', {posts: getPostsByLabel(JSON.stringify(data.label))});
    });
    socket.on('get posts by descriptor', (data) => {
        socket.emit('posts by descriptor response', {posts: getPostsByDescriptor(JSON.stringify(data.type), JSON.stringify(data.name))});
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
    jsonPost.index = readArchiveSync().posts.length;
    archive.posts.push(jsonPost);
    saveArchive(archive);
}

function getPostsByLabel(label) {
    let archive = readArchiveSync();
    let posts = [];
    for (let post of archive.posts) {
        if (JSON.stringify(post.labels).includes(label)) { // noinspection JSUnusedAssignment
            posts.push(post);
        }
    }
    return posts;
}

function getPostsByDescriptor(type, name) {
    let archive = readArchiveSync();
    let posts = [];
    type = JSON.stringify(type).slice(3, -3);
    console.log(`get by descriptor request type: ${type}, name: ${name}`);
    //Works with subject to get correct string!
    for (let post of archive.posts) {
        if (JSON.stringify(post[type]).includes(name)) { // noinspection JSUnusedAssignment
            posts.push(post);
        }
    }
    return posts;
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
    let textArchive = await readFileAsync(archivePath);
    return JSON.parse(textArchive);
}

function saveArchive(updatedArchive) {
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