/* NOTE:
    This lovely piece of code is used to create a formatted post object to be placed in the DOM.
    onclicks are regularly anonymous functions since that allows for me to use actual arguments.
    This main function makes use of all the other, more specific formatters.
 */
let formatPost = (postObject) => {
    let post = document.createElement("div");
    post.className = "post";
    post.id = "post-" + postObject.index;

    let postDate = document.createElement("div");
    postDate.className = "post-date";
    postDate.innerHTML = postObject.date.split("_").join("/");
    post.appendChild(postDate);

    let editButton = document.createElement("button");
    editButton.className = "post-edit-button";
    editButton.innerHTML = "Edit";
    post.appendChild(editButton);
    editButton.onclick = () => {
        editMode(postObject);
    };

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
    post.appendChild(getFormattedSubjects(postObject.subjects));
    post.appendChild(postSubject);

    post.appendChild(getFormattedBody(postObject.body));

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

    return post;
};

/* NOTE:
    Taking an array of labels, creates separate DOM nodes that each have their own requestPostsByLabel function.
    I used href:"javascript:;" here and elsewhere when I wanted elements to appear clickable.
 */
let getFormattedLabels = (labelArray) => {
    let formattedDiv = document.createElement("div");
    for (let label of labelArray) {
        let labelSpan = document.createElement("a");
        labelSpan.className = "label-single";
        labelSpan.href = "javascript:;";
        labelSpan.onclick = function () {
            requestPostsByDescriptor('labels', label);
        };
        labelSpan.innerText = label;
        formattedDiv.appendChild(labelSpan);
    }
    return formattedDiv;
};

/* NOTE:
    Taking an array of subjects, creates separate DOM nodes that each have their own requestPostsByDesrriptor function.
 */
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

/* NOTE:
    This formats the body of each post according to site rules. I expect this function to have many more features soon.
 */
function getFormattedBody(body) {
    let bodyArray = body.split('\n');
    let formattedBody = document.createElement("div");
    formattedBody.className = "post-body";
    for (let paragraph of bodyArray) {
        let paragraphDOM = getFormattedParagraph(paragraph);
        formattedBody.appendChild(paragraphDOM);
    }
    return formattedBody;
}

/*
    This is where incline "markdown" support will occur.
 */

function getFormattedParagraph(rawPar) {
    let parElem = document.createElement("p");
    parElem.className = "post-paragraph";
    parElem.innerHTML = rawPar;
    return parElem;
}

/* NOTE:
    This formats the searchbar on the navbar.
 */
let getFormattedSearchBar = () => {
    let searchBarSpan = document.createElement("span");

    let searchField = document.createElement("input");
    searchField.type = "text";
    searchField.name = "search";
    searchField.placeholder = "Search";
    searchField.className = "read-field";
    searchField.id = "read-search";
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
    searchButton.id = "read-search-button";
    searchBarSpan.appendChild(searchButton);

    searchButton.onclick = () => {
        search(searchField)
    };

    return searchBarSpan;
};

function elt(type, props, ...children) {
    //create the dom elt
    let dom = document.createElement(type);
    //assign properties
    if (props) Object.assign(dom, props);
    //append all the children
    for (let child of children) {
        if (typeof child != `string`) dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    //return the element
    return dom;
}

function generateFlexCenter(prefix, hmargin, vmargin) {
    return elt("section", {
        className: "flex-center-container",
        id: prefix + "-flex-center-container",
        display: "flex",
        flexDirection: "row"
    }, [
        elt("section", {
            className: "flex-center-container-hgap"
        }), elt("section", {
                className: "screen-container-hcenter",
                id: "pw-screen-container-hcenter"
            },
            [
                elt("section", {
                    className: "screen-container-vgap"
                }),
                elt("section", {
                        className: "screen-container-hcenter",
                        id: "pw-screen-container-hcenter"
                    },
                    elt()
                ),
                elt("section", {
                    className: "screen-container-vgap"
                }),
            ]
        ),
        elt("section", {
            className: "screen-container-hgap"
        })
    ]);
}