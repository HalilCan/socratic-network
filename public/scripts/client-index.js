let socket = io('http://localhost:8000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

function testArcSocket() {
    console.log('testArcSocket executed');
    socket.emit('get post by index', {index: 0});
}

socket.on('post by index', function (data) {
    console.log('post by index caught');
    document.querySelector("body").innerHTML += formatPost(data.post);
});

function formatPost (postObject) {
    return "<div class = 'post' id = `post" + postObject.index +"`> <div class = 'post-title'>" + postObject.title + "</div> <div class = 'post-subtitle'>" + postObject.subtitle + "</div> <div class = 'post-subject'>" + postObject.subjects.join(' ') + "</div> <div class = 'post-body'>" + getformattedBody(postObject.body) + "</div> <div class = 'post-labels'>" + postObject.labels.toString() + "</div> <div class = 'post-separator'></div> </div>";
}

function getformattedBody (body) {
    let bodyArray = body.split('\n');
    let formattedBody;
    for (let paragraph of bodyArray) {
        formattedBody += "<div class = 'post-paragraph'>" + paragraph + "</div>"
    }
    return formattedBody;
}
