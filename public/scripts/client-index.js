let socket = io('http://localhost:8000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', {my: 'data'});
});

function requestPostCount() {
    socket.emit('get post count');
}

let postCount = 0;
let isPCUpdated = false;
let pcUpdatedFunction;
socket.on('post count response', (data) => {
    console.log(`postCount response: ${data.postCount}`);
    postCount = data.postCount;
    isPCUpdated = true;
    pcUpdatedFunction();
});

function getPostByIndex(index) {
    socket.emit('get post by index', {index: index});
}

function readMode() {
    setReadInterface(document.getElementById("real-estate"));
}

function writeMode() {
    setPublishInterface(document.getElementById("real-estate"));
}

socket.on('post by index', function (data) {
    document.getElementById("real-estate").innerHTML += formatPost(data.post);
});

function formatPost(postObject) {
    return "<div class = 'post' id = `post" + postObject.index + "`> <div class = 'post-title'>" + postObject.title + "</div> <div class = 'post-subtitle'>" + postObject.subtitle + "</div> <div class = 'post-subject'>" + postObject.subjects.join(' ') + "</div> <div class = 'post-body'>" + getformattedBody(postObject.body) + "</div> <div class = 'post-labels'>" + postObject.labels.toString() + "</div> <div class = 'post-separator'></div> </div>";
}

function setReadInterface(element, ...options) {
    element.innerHTML = '';
    requestPostCount();
    if (!isPCUpdated) {
        pcUpdatedFunction = () => {
            for (let i = 0; i < postCount; i++) {
                console.log(i);
                getPostByIndex(i);
            }
        }
    }
}

function setPublishInterface(element) {
    element.innerHTML = '';

    let pubContainer = document.createElement("div");
    pubContainer.id = "pub-container";

    let titleField = document.createElement("input");
    titleField.type = "text";
    titleField.name = "title";
    titleField.value = "Title";
    titleField.className = "pub-field";
    titleField.id = "pub-title";
    pubContainer.appendChild(titleField);

    let subTitleField = document.createElement("input");
    subTitleField.type = "text";
    subTitleField.name = "subTitle";
    subTitleField.value = "Sub-title";
    subTitleField.className = "pub-field";
    subTitleField.id = "pub-subTitle";
    pubContainer.appendChild(subTitleField);

    let subjectField = document.createElement("input");
    subjectField.type = "text";
    subjectField.name = "subject";
    subjectField.value = "Subject";
    subjectField.className = "pub-field";
    subjectField.id = "pub-subject";
    pubContainer.appendChild(subjectField);

    let essayField = document.createElement("textarea");
    essayField.name = "essay";
    essayField.className = "pub-field";
    essayField.id = "pub-essay";
    pubContainer.appendChild(essayField);

    let labelsField = document.createElement("input");
    labelsField.type = "text";
    labelsField.name = "labels";
    labelsField.value = "Labels";
    labelsField.className = "pub-field";
    labelsField.id = "pub-labels";
    pubContainer.appendChild(labelsField);

    let passCodeField = document.createElement("input");
    passCodeField.type = "text";
    passCodeField.name = "passCode";
    passCodeField.value = "Passcode";
    passCodeField.className = "pub-field";
    passCodeField.id = "pub-passCode";
    pubContainer.appendChild(passCodeField);

    let publishButton = document.createElement("button");
    publishButton.innerText = "Publish";
    publishButton.className = "pub-button";
    publishButton.id = "publish-button";
    publishButton.onclick = publish;
    pubContainer.appendChild(publishButton);

    element.appendChild(pubContainer)
}

function publish() {
    let titleField = document.getElementById("pub-title");
    let subTitleField = document.getElementById("pub-subTitle");
    let subjectField = document.getElementById("pub-subject");
    let bodyField = document.getElementById("pub-essay");
    let labelsField = document.getElementById("pub-labels");
    let passCodeField = document.getElementById("pub-passCode");

    console.log('passCheck');

    //Sham passcode
    //TODO: change this or you just made a forum lol
    if (passCodeField.value !== "hcm") {
        console.log(passCodeField.value);
        return -1;
    }
    console.log('passCheck passed');

    let obj = {
        index: 999,
        "subjects": subjectField.value.split(" "),
        "title": titleField.value,
        "subtitle": subTitleField.value,
        "author": "hcm",
        "body": bodyField.value,
        "labels": labelsField.value.split(" ")
    };
    socket.emit('write mode published', obj);
}

function getformattedBody(body) {
    let bodyArray = body.split('\n');
    let formattedBody = "";
    for (let paragraph of bodyArray) {
        formattedBody += "<div class = 'post-paragraph'>" + paragraph + "</div>"
    }
    return formattedBody;
}


