let socket = io('http://localhost:8000');
socket.on('news', function (data) {
    socket.emit('my other event', {my: 'data'});
});

function requestPostCount() {
    socket.emit('get post count');
}

let postCount = 0;
let isPCUpdated = false;
let pcUpdatedFunction;
socket.on('post count response', (data) => {
    postCount = data.postCount;
    isPCUpdated = true;
    pcUpdatedFunction();
    pcUpdatedFunction = null;
});

function requestArchiveBackup() {
    socket.emit('get archive backup');
}

socket.on('archive backup', (data) => {
    let date = getCurrentDate();
    downloadText(`SN backup-${date}`, JSON.stringify(data.backup));
});

function getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    return (today);
}

function downloadText(filename, string) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(string));

    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

function getPostByIndex(index) {
    socket.emit('get post by index', {index: index});
}

socket.on('post by index', function (data) {
    addPostToDisplay(data.post);
});

function requestPostsByLabel(label) {
    console.log(`rpbl label: ${label}`);
    socket.emit('get posts by label', {label: label});
}

socket.on('posts by label response', (data) => {
    if (!data.posts) console.log(JSON.stringify(data));
    document.getElementById("real-estate").innerHTML = '';
    for (let post of data.posts) {
        addPostToDisplay(post)
    } //data.posts is an array anyway
});

function readMode() {
    setReadInterface(document.getElementById("real-estate"));
}

function writeMode() {
    setPublishInterface(document.getElementById("real-estate"));
}

function addPostToDisplay(unformattedPost) {
    document.getElementById("real-estate").appendChild(formatPost(unformattedPost));
}

function formatPost(postObject) {
    let post = document.createElement("div");
    post.className = "post";
    post.id = "post-" + postObject.index;

    let postDate = document.createElement("div");
    postDate.className = "post-date";
    let formattedDate = postObject.date.split("_").join("/");
    postDate.innerHTML = formattedDate;
    post.appendChild(postDate);

    let postTitle = document.createElement("div");
    postTitle.className = "post-title";
    postTitle.innerHTML = postObject.title;
    post.appendChild(postTitle);

    let postSubTitle = document.createElement("div");
    postSubTitle.className = "post-subtitle";
    postSubTitle.innerHTML = postObject.subtitle;
    post.appendChild(postSubTitle);

    let postSubject = document.createElement("div");
    postSubject.className = "post-subject";
    postSubject.innerHTML = postObject.subjects.join(", ");
    post.appendChild(postSubject);

    let postBody = document.createElement("div");
    postBody.className = "post-body";
    postBody.innerHTML = getFormattedBody(postObject.body);
    post.appendChild(postBody);

    let postLabels = document.createElement("div");
    postLabels.className = "post-labels";
    postLabels.appendChild(getFormattedLabels(postObject.labels));
    post.appendChild(postLabels);

    let postSeparator = document.createElement("div");
    postSeparator.className = "post-separator";
    post.appendChild(postSeparator);

    return post;

    //TODO: labels need to be separate <span>s
    //return "<div class = 'post' id = `post" + postObject.index + "`> <div class = 'post-date'>" + formattedDate + "</div> <div class = 'post-title'>" + postObject.title + "</div> <div class = 'post-subtitle'>" + postObject.subtitle + "</div> <div class = 'post-subject'>" + postObject.subjects.join(' ') + "</div> <div class = 'post-body'>" + getformattedBody(postObject.body) + "</div> <div class = 'post-labels'>" + getFormattedLabels(postObject.labels) + "</div> <div class = 'post-separator'></div> </div>";
}

function getFormattedLabels(labelArray) {
    let formattedDiv = document.createElement("div");
    for (let label of labelArray) {
        let labelSpan = document.createElement("a");
        labelSpan.className = "label-single";
        labelSpan.href = "javascript:;";
        labelSpan.onclick = function (event) {
            requestPostsByLabel(label)
        };
        labelSpan.innerText = label;
        formattedDiv.appendChild(labelSpan);
    }
    return formattedDiv;
}

function setReadInterface(element, ...options) {
    element.innerHTML = '';
    requestPostCount();
    if (!isPCUpdated) {
        pcUpdatedFunction = () => {
            for (let i = 0; i < postCount; i++) {
                getPostByIndex(i);
            }
            isPCUpdated = false;
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
    let date = getCurrentDate();

    //Sham passcode
    //TODO: change this or you just made a forum lol
    if (passCodeField.value !== "hcm") {
        console.log(passCodeField.value);
        return -1;
    }

    let obj = {
        index: 999,
        "date": date,
        "subjects": subjectField.value.split(" "),
        "title": titleField.value,
        "subtitle": subTitleField.value,
        "author": "hcm",
        "body": bodyField.value,
        "labels": labelsField.value.split(", ")
    };
    socket.emit('write mode published', obj);
}

function getFormattedBody(body) {
    let bodyArray = body.split('\n');
    let formattedBody = "";
    for (let paragraph of bodyArray) {
        formattedBody += "<div class = 'post-paragraph'>" + paragraph + "</div>"
    }
    return formattedBody;
}


