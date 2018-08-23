//const logger = require('tracer').console();

const {createServer} = require("http");
const methods = Object.create(null);

let app = require('http').createServer(handler);
let io = require('socket.io')(app);
let fs = require('fs');

app.listen(8000);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

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