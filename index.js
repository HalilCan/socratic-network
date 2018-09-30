/* NOTE:
    Here I import http, express, and (later) socket.io.
    Then, I initialize socket and create a server listening at either the random port Heroku gives me, or 8000.
    Third, the socket.io instance is created on the server.
    Finally, I add _dirname variable for the app in general, since Node doesn't handle file paths well otherwise.
 */
const http = require("http");
let express = require('express');
let app = express();
let serverHttp = http.createServer(app);
let port = process.env.PORT || 8000;
console.log(`Port ${port}`);
serverHttp.listen(port);

let io = require('socket.io')(serverHttp);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public' + '/routes' + '/index.html');
});

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/public' + '/routes' + '/index.html');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/public' + '/routes' + '/admin.html');
});

/* NOTE:
    Here I import my own packages
 */
let archive = require("./archive");

/* NOTE:
    This commented-out piece of code can toggle wildcard CORS requests.
 */
//io.origins('*:*');

/* NOTE:
    This code block is the main "intersection" that the socket-based client-interaction code will flow through. This is a significant part of the program.
    The connection labels and function names are self-explanatory.
    Sometimes I use JSON.stringify too much, which results in stranger things like /"/string"//
 */
io.on('connection', function (socket) {
    socket.on('get post by index', function (data) {
        let index = data.index;
        let post = archive.readArchiveSync().posts[index] || archive.readArchiveSync().posts[0];
        socket.emit('post by index', {post: post});
    });
    socket.on('write mode published', (data) => {
        console.log(JSON.stringify(data));
        archive.addToArchive(data);
        socket.emit('publish success', {data: JSON.stringify(data)});
    });
    socket.on('get post count', () => {
        socket.emit('post count response', {postCount: archive.readArchiveSync().posts.length});
    });
    socket.on('get archive backup', () => {
        socket.emit('archive backup', {backup: archive.readArchiveSync()});
    });
    socket.on('get posts by label', (data) => {
        socket.emit('posts by label response', {posts: archive.getPostsByLabel(JSON.stringify(data.label))});
    });
    socket.on('get posts by descriptor', (data) => {
        socket.emit('posts by descriptor response', {posts: archive.getPostsByDescriptor(JSON.stringify(data.type), JSON.stringify(data.name))});
    });
    socket.on('get posts by search query', (data) => {
        socket.emit('posts by search query response', {posts: archive.getPostsBySearchQuery(data.query)});
    });
    socket.on('get list of descriptors of type t', (data) => {
        let JSONobj = archive.getAllDescriptors(JSON.stringify(data.type));
        socket.emit('list of descriptors of type t', {list: JSONobj});
    });
    socket.on('syncDbUpward', (data) => {
        archive.syncDBUpward("posts");
    });
    socket.on('admin - submit password', (data) => {
        //TODO: Send admin page as DOM after the correct password is submit.
        if (admin.isAdminPw(data.adminPassword)) {
            socket.emit("correct admin pw", admin.generateAdminDashboardDOM());
        }
        else {
            socket.emit("wrong admin pw", {});
        }
    });
});


