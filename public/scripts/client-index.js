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
    document.querySelector("body").innerHTML += data.body;
});

