const archivePath = __dirname + "/public/archive/arc.json";
const util = require("util");
const fs = require("fs");
const {stat} = require("fs").promises;

/* NOTE:
    If a given post object exists in the archive, it gets updated. Otherwise, a new post is added to the archive.
 */
let addToArchive = (jsonPost) => {
    let archive = readArchiveSync();
    if (jsonPost.index < archive.posts.length) {
        archive.posts[jsonPost.index] = jsonPost
    } else {
        jsonPost.index = archive.posts.length;
        archive.posts.push(jsonPost);
    }
    saveArchive(archive);
};

/* NOTE:
    If a given post object exists in the archive, it gets updated. Otherwise, a new post is added to the archive.
 */
let getPostsByLabel = (label) => {
    let archive = readArchiveSync();
    let posts = [];
    for (let post of archive.posts) {
        if (JSON.stringify(post.labels).includes(label)) { // noinspection JSUnusedAssignment
            posts.push(post);
        }
    }
    return posts;
};

/* NOTE:
    Traverses the archive and returns an array of posts that include a descriptor called {name} of {type}
 */
let getPostsByDescriptor = (type, name) => {
    let archive = readArchiveSync();
    let posts = [];
    //Works with subject to get correct string!
    for (let post of archive.posts) {
        if (JSON.stringify(post[type]).includes(name)) { // noinspection JSUnusedAssignment
            posts.push(post);
        }
    }
    return posts;
};

/* NOTE:
    Traverses the archive and returns an array of posts that include the string {query}
 */
let getPostsBySearchQuery = (query) => {
    let archive = readArchiveSync();
    let posts = [];
    for (let post of archive.posts) {
        if (postContainsQuery(post, query)) posts.push(post);
    }
    return posts;
};


/* NOTE:
    For a given {post} object and a {query}, returns whether {post} contains the string {query} in any application-specific field.
 */
let postContainsQuery = (post, query) => {
    for (let prop in post) {
        if (post.hasOwnProperty(prop)) {
            console.log(typeof post[prop], post[prop], JSON.stringify(post[prop]), '///');
            if (typeof post[prop].includes === 'function') {
                if (JSON.stringify(post[prop]).includes(query) || post[prop].includes(query)) {
                    return true;
                }
            } else {
                return (post[prop]).indexOf(query) > -1;
            }
        }
    }
    return false;
};

let search = (arr, s) => {
    let matches = [], i, key;

    for (i = arr.length; i--;)
        for (key in arr[i])
            if (arr[i].hasOwnProperty(key) && arr[i][key].indexOf(s) > -1)
                matches.push(arr[i]);  // <-- This can be changed to anything
    return matches;
};

let readArchiveSync = () => {
    stat(archivePath).then((err) => {
        if (err) {
            if (err.code !== "ENOENT") return {status: 500, body: err};
            else return {status: 404, body: "Archive file not found!"};
        }
    });
    let file = fs.readFileSync(archivePath);
    return JSON.parse(file);
};

let saveArchive = (updatedArchive) => {
    fs.writeFileSync(archivePath, JSON.stringify(updatedArchive));
};

let getAllDescriptors = (type) => {
    let archive = readArchiveSync();
    let descList = [];
    let descCntList = [];
    let editedType = JSON.stringify(type).slice(3, -3);
    for (let post of archive.posts) {
        for (let item of post[editedType]) {
            if (descList.indexOf(item) < 0) {
                descList.push(item);
                descCntList.push(1);
            } else {
                descCntList[descList.indexOf(item)] += 1;
            }
        }
    }
    return {descriptors: descList, count: descCntList};
};

exports.addToArchive = addToArchive;
exports.saveArchive = saveArchive;
exports.readArchiveSync = readArchiveSync;
exports.search = search;
exports.postContainsQuery = postContainsQuery;
exports.getPostsBySearchQuery = getPostsBySearchQuery;
exports.getPostsByDescriptor = getPostsByDescriptor;
exports.getPostsByLabel = getPostsByLabel;
exports.getAllDescriptors = getAllDescriptors;