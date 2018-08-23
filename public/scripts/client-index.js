let socket = io('http://localhost:8000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', {my: 'data'});
});

function testArcSocket() {
    console.log('testArcSocket executed');
    socket.emit('get post by index', {index: 0});
}

function writeMode() {
    setPublishInterface(document.getElementById("real-estate"));
}

socket.on('post by index', function (data) {
    console.log('post by index caught');
    document.getElementById("real-estate").innerHTML += formatPost(data.post);
});

function formatPost(postObject) {
    return "<div class = 'post' id = `post" + postObject.index + "`> <div class = 'post-title'>" + postObject.title + "</div> <div class = 'post-subtitle'>" + postObject.subtitle + "</div> <div class = 'post-subject'>" + postObject.subjects.join(' ') + "</div> <div class = 'post-body'>" + getformattedBody(postObject.body) + "</div> <div class = 'post-labels'>" + postObject.labels.toString() + "</div> <div class = 'post-separator'></div> </div>";
}

function setPublishInterface(element) {
    let pubContainer = document.createElement("div");
    pubContainer.id = "pub-container";

    let titleField = document.createElement("input");
    titleField.type = "text";
    titleField.name = "title";
    titleField.className = "pub-field";
    titleField.id = "pub-title";
    pubContainer.appendChild(titleField);

    let subTitleField = document.createElement("input");
    subTitleField.type = "text";
    subTitleField.name = "subTitle";
    subTitleField.className = "pub-field";
    subTitleField.id = "pub-subTitle";
    pubContainer.appendChild(subTitleField);

    let subjectField = document.createElement("input");
    subjectField.type = "text";
    subjectField.name = "subject";
    subjectField.className = "pub-field";
    subjectField.id = "pub-subject";
    pubContainer.appendChild(subjectField);

    let essayField = document.createElement("input");
    essayField.type = "text";
    essayField.name = "essay";
    essayField.className = "pub-field";
    essayField.id = "pub-essay";
    pubContainer.appendChild(essayField);

    let labelsField = document.createElement("input");
    labelsField.type = "text";
    labelsField.name = "labels";
    labelsField.className = "pub-field";
    labelsField.id = "pub-labels";
    pubContainer.appendChild(labelsField);

    element.appendChild(pubContainer)
}

function getformattedBody(body) {
    let bodyArray = body.split('\n');
    let formattedBody = "";
    for (let paragraph of bodyArray) {
        formattedBody += "<div class = 'post-paragraph'>" + paragraph + "</div>"
    }
    return formattedBody;
}


