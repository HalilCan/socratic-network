//const logger = require('tracer').console();

const {createServer} = require("http");
const methods = Object.create(null);

createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;

    handler(request)
        .catch(error => {
            if (error.status != null) return error;
            return {body: String(error), status: 500};
        })
        .then(({body, status = 200, type = "text/plain"}) => {
            response.writeHead(status, {"Content-Type": type});
            if (body && body.pipe) body.pipe(response);
            else response.end(body);
        });
}).listen(8000);

async function notAllowed(request) {
    return {
        status: 405,
        body: `Method ${request.method} not allowed.`
    }
}

const archivePath = "/archive/arc.json";
const fs = require("fs");
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

methods.getPost = async function (request) {
    let postIndex = request.postIndex;

};