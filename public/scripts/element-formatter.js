/* NOTE:
    This lovely piece of code is used to create a formatted post object to be placed in the DOM
 */
let formatPost = (postObject) => {
    let post = document.createElement("div");
    post.className = "post";
    post.id = "post-" + postObject.index;

    let postDate = document.createElement("div");
    postDate.className = "post-date";
    postDate.innerHTML = postObject.date.split("_").join("/");
    ;
    post.appendChild(postDate);

    let editButton = document.createElement("button");
    editButton.className = "post-edit-button";
    editButton.innerHTML = "Edit";
    editButton.onclick = () => {
        editMode(post);
    };
    post.appendChild(editButton);

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
    postSubject.appendChild(getFormattedSubjects(postObject.subjects));
    post.appendChild(postSubject);

    let postBody = document.createElement("div");
    postBody.className = "post-body";
    postBody.innerHTML = getFormattedBody(postObject.body);
    post.appendChild(postBody);

    let postAuthor = document.createElement("div");
    postAuthor.className = "post-author";
    postAuthor.innerHTML = postObject.author;
    post.appendChild(postAuthor);

    let postLabels = document.createElement("div");
    postLabels.className = "post-labels";
    postLabels.appendChild(getFormattedLabels(postObject.labels));
    post.appendChild(postLabels);

    let postSeparator = document.createElement("div");
    postSeparator.className = "post-separator";
    post.appendChild(postSeparator);

    let backupPostObject = document.createElement("div");
    backupPostObject.innerHTML = JSON.stringify(postObject);
    backupPostObject.style.display = "none";
    post.appendChild(backupPostObject);

    return post;
};

let getFormattedLabels = (labelArray) => {
    let formattedDiv = document.createElement("div");
    for (let label of labelArray) {
        let labelSpan = document.createElement("a");
        labelSpan.className = "label-single";
        labelSpan.href = "javascript:;";
        labelSpan.onclick = function () {
            requestPostsByLabel(label)
        };
        labelSpan.innerText = label;
        formattedDiv.appendChild(labelSpan);
    }
    return formattedDiv;
};


function getFormattedSubjects(subjectArray) {
    let formattedDiv = document.createElement("div");
    for (let subject of subjectArray) {
        let subjectSpan = document.createElement("a");
        subjectSpan.className = "subject-single";
        subjectSpan.href = "javascript:;";
        subjectSpan.onclick = function () {
            requestPostsByDescriptor('subjects', subject);
        };
        subjectSpan.innerText = subject;
        formattedDiv.appendChild(subjectSpan);
    }
    return formattedDiv;
}

function getFormattedBody(body) {
    let bodyArray = body.split('\n');
    let formattedBody = "";
    for (let paragraph of bodyArray) {
        formattedBody += "<div class = 'post-paragraph'>" + paragraph + "</div>"
    }
    return formattedBody;
}

let getFormattedSearchBar = () => {
    let searchBarSpan = document.createElement("span");

    let searchField = document.createElement("input");
    searchField.type = "text";
    searchField.name = "search";
    searchField.placeholder = "Search";
    searchField.className = "read-field";
    searchField.id = "read-search";
    searchField.style.width = "100px";
    searchField.onkeypress = (e) => {
        if (e.keyCode === 13) {
            search(searchField);
        }
    };
    searchBarSpan.appendChild(searchField);

    let searchButton = document.createElement("button");
    searchButton.name = "search-button";
    searchButton.innerText = '🔍 ';
    searchButton.className = "read-button";
    searchButton.id = "read-search";
    searchButton.style.width = "30px";
    searchButton.style.padding = "0";
    searchBarSpan.appendChild(searchButton);

    searchButton.onclick = () => {
        search(searchField)
    };

    return searchBarSpan;
};
