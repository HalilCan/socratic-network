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

const archivePath = "/archive";

async function addToArchive(jsonPost) {
    let archive = readArchive();
    archive.posts = archive.posts.push(jsonPost);
}

async function readArchive() {

}

async function updateArchive(updatedArchive) {

}