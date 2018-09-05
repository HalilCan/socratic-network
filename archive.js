const archivePath = __dirname + "/public/archive/arc.json";
const util = require("util");
const fs = require("fs");
const {stat} = require("fs").promises;

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

let getPostsByDescriptor = (type, name) => {
    let archive = readArchiveSync();
    let posts = [];
    //console.log(`get by descriptor request type: ${type}, name: ${name}`);
    //Works with subject to get correct string!
    for (let post of archive.posts) {
        if (JSON.stringify(post[type]).includes(name)) { // noinspection JSUnusedAssignment
            posts.push(post);
        }
    }
    return posts;
};

let getPostsBySearchQuery = (query) => {
    let archive = readArchiveSync();
    let posts = [];
    for (let post of archive.posts) {
        if (postContainsQuery(post, query)) posts.push(post);
    }
    return posts;
};

let postContainsQuery = (post, query) => {
    for (let prop in post) {
        if (post.hasOwnProperty(prop)) {
            if (typeof post[prop].includes === 'function') {
                if (JSON.stringify(post[prop]).includes(query) || post[prop].includes(query) || JSON.stringify(post[prop]).indexOf(query) > -1) {
                    return true;
                }
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