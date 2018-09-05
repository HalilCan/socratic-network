let socket = io('http://localhost:8000');

function requestPostCount() {
    socket.emit('get post count');
}

window.onload = () => {
    setUpSearchBar();

    //TODO: this is just a test, remove this.
    socket.emit('get list of descriptors of type t', {type: "labels"});
};

function setUpSearchBar() {
    let rightContainer = document.getElementById("navbar-right");
    rightContainer.appendChild(getFormattedSearchBar());
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

// noinspection JSUnusedLocalSymbols
function requestArchiveBackup() {
    socket.emit('get archive backup');
}

socket.on('archive backup', (data) => {
    let date = getCurrentDate();
    downloadText(`SN backup-${date}`, JSON.stringify(data.backup));
});

function getOrderedDescList(data) {
    let dataCopy = JSON.parse(JSON.stringify(data));
    //let orderedList = [];
    return JSON.stringify((data.list.descriptors).sort((a, b) => {
        let valA = dataCopy.list.count[dataCopy.list.descriptors.indexOf(a)];
        let valB = dataCopy.list.count[dataCopy.list.descriptors.indexOf(b)];
        if (valA > valB) return -1;
        else if (valA === valB) return 0;
        else return 1;
    }));
    //return orderedList;
}

function publishLabels(labelArray) {
    let labelList = document.getElementById("label-list");
    labelList.innerHTML = '';

    let parsedArray = JSON.parse(labelArray);
    let labelDiv = getFormattedLabels(parsedArray);

    labelList.style.display = "block";
    labelDiv.style.display = "flex";
    labelDiv.style.flexDirection = "column";

    labelList.appendChild(labelDiv);
}

socket.on('list of descriptors of type t', (data) => {
    publishLabels(getOrderedDescList(data));
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

// noinspection JSUnusedLocalSymbols
function search(searchField) {
    let query = searchField.value;
    socket.emit('get posts by search query', {query: query});
}

socket.on('posts by search query response', (data) => {
    if (!data.posts) return;
    document.getElementById("real-estate").innerHTML = '';
    for (let post of data.posts) {
        addPostToDisplay(post)
    } //data.posts is an array anyway
});


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

// noinspection JSUnusedLocalSymbols
function requestPostsByLabel(label) {
    socket.emit('get posts by label', {label: label});
}

function requestPostsByDescriptor(descriptorType, descriptorName) {
    socket.emit('get posts by descriptor', {type: descriptorType, name: descriptorName});
}

socket.on('posts by label response', (data) => {
    if (!data.posts) return;
    document.getElementById("real-estate").innerHTML = '';
    for (let post of data.posts) {
        addPostToDisplay(post)
    } //data.posts is an array anyway
});

socket.on('posts by descriptor response', (data) => {
    if (!data.posts) return;
    document.getElementById("real-estate").innerHTML = '';
    for (let post of data.posts) {
        addPostToDisplay(post)
    }
});

socket.on('publish success', (data) => {
    window.alert('Publish success!');
});

// noinspection JSUnusedLocalSymbols
function readMode() {
    setReadInterface(document.getElementById("real-estate"));
}

// noinspection JSUnusedLocalSymbols
function writeMode() {
    setPublishInterface(document.getElementById("real-estate"));
}

// noinspection JSUnusedLocalSymbols
function editMode(element) {
    setPublishInterface(document.getElementById("real-estate"), {
        type: "edit",
        data: JSON.parse(element.lastChild.innerHTML)
    });
}

socket.on('edit mode confirmed', (data) => {
});

function addPostToDisplay(unformattedPost) {
    document.getElementById("real-estate").appendChild(formatPost(unformattedPost));
}

// noinspection JSUnusedLocalSymbols
function setReadInterface(element, ...options) {
    element.innerHTML = '';
    requestPostCount();
    if (!isPCUpdated) {
        pcUpdatedFunction = () => {
            for (let i = postCount - 1; i > -1; i--) {
                getPostByIndex(i);
            }
            isPCUpdated = false;
        }
    }
}

function setPublishInterface(element, optionsObject) {
    element.innerHTML = '';

    let pubContainer = document.createElement("div");
    pubContainer.id = "pub-container";

    let titleField = document.createElement("input");
    titleField.type = "text";
    titleField.name = "title";
    titleField.placeholder = "Title";
    titleField.className = "pub-field";
    titleField.id = "pub-title";
    pubContainer.appendChild(titleField);

    let subTitleField = document.createElement("input");
    subTitleField.type = "text";
    subTitleField.name = "subTitle";
    subTitleField.placeholder = "Sub-title";
    subTitleField.className = "pub-field";
    subTitleField.id = "pub-subTitle";
    pubContainer.appendChild(subTitleField);

    let subjectField = document.createElement("input");
    subjectField.type = "text";
    subjectField.name = "subject";
    subjectField.placeholder = "Subject";
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
    labelsField.placeholder = "Labels";
    labelsField.className = "pub-field";
    labelsField.id = "pub-labels";
    pubContainer.appendChild(labelsField);

    let passCodeField = document.createElement("input");
    passCodeField.type = "text";
    passCodeField.name = "passCode";
    passCodeField.placeholder = "Passcode";
    passCodeField.className = "pub-field";
    passCodeField.id = "pub-passCode";
    pubContainer.appendChild(passCodeField);

    let publishButton = document.createElement("button");
    publishButton.innerText = "Publish";
    publishButton.className = "pub-button";
    publishButton.id = "publish-button";
    publishButton.onclick = publish;
    pubContainer.appendChild(publishButton);

    if (optionsObject) {
        if (optionsObject.type = "edit") {
            let data = optionsObject.data;
            let index = data.index;
            let subjects = data.subjects.toString();
            let title = data.title;
            let subtitle = data.subtitle;
            let author = data.author;
            let body = data.body;
            let labels = data.labels.toString();

            titleField.value = title;
            subjectField.value = subjects;
            subTitleField.value = subtitle;
            essayField.innerHTML = body;
            labelsField.value = labels;

            publishButton.onclick = () => {
                publish({type: "edit", index: index, author: author});
            }
        }
    }
    element.appendChild(pubContainer);
}


function publish(optionsObject) {
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

    let labelSplitter = '';
    if (labelsField.value.includes(", ")) {
        labelSplitter = ", ";
    } else if (labelsField.value.includes(",")) {
        labelSplitter = ",";
    } else {
        labelSplitter = " ";
    }

    let subjectSplitter = '';
    if (subjectField.value.includes(", ")) {
        subjectSplitter = ", ";
    } else if (subjectField.value.includes(",")) {
        subjectSplitter = ",";
    } else {
        subjectSplitter = " ";
    }


    let objIndex;
    if (optionsObject) {
        objIndex = optionsObject.index;
    } else {
        objIndex = 9999;
    }
    console.log(objIndex);

    let obj = {
        index: objIndex,
        "date": date,
        "subjects": subjectField.value.split(subjectSplitter),
        "title": titleField.value,
        "subtitle": subTitleField.value,
        "author": "hcm",
        "body": bodyField.value,
        "labels": labelsField.value.split(labelSplitter)
    };
    socket.emit('write mode published', obj);
}



