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
    For some reason I couldn't find, the variables get double quotes while passing through the socket. That's why I had to use slice(1,-1) to trim the ends.
 */
let getPostsByDescriptor = (type, name) => {
    let archive = readArchiveSync();
    let posts = [];
    name = name.slice(1,-1);
    type = type.slice(1,-1);
    for (let post of archive.posts) {
        console.log(post, post[type], name);
        if (JSON.stringify(post[type]).includes(name)) { // noinspection JSUnusedAssignment
            posts.push(post);
        }
    }
    return posts;
};

/* NOTE:
    Given a JSON object {obj} and a search query {query}, searches recursively through the object and returns true if the object contains the value {query}.
    Be careful not to overuse JSON. methods, since they can modify the target object too much. For example, quad quotes.
 */
let jsonIncludes = (obj, query) => {
    for (let key in obj) {
        if (typeof(obj) === 'object') {
            if (obj.hasOwnProperty(key)) {
                if (jsonIncludes(obj[key], query)) {
                    return true;
                }
            }
        }
    }
    if (typeof(obj) === 'string') {
        let r1 = obj.indexOf(query) > -1;
        let r2 = obj === query;
        return r1 || r2;
    } else if (typeof(obj) === 'number') {
        let r1 = obj.toString().indexOf(query) > -1;
        let r2 = obj === query;
        return r1 || r2;
    }
    return false;
};

/* NOTE:
    Traverses the archive and returns an array of posts that include the string {query}
 */
let getPostsBySearchQuery = (query) => {
    let archive = readArchiveSync();
    let posts = [];
    for (let post of archive.posts) {
        if (jsonIncludes(post, query)) posts.push(post);
    }
    return posts;
};


/* NOTE:
    For a given {post} object and a {query}, returns whether {post} contains the string {query} in any application-specific field.
 */
let postContainsQuery = (post, query) => {
    console.log(typeof query, query);
    console.log(`"09/02/2018".includes("20") = ${"09/02/2018".includes("20")}`);
    for (let prop in post) {
        if (post.hasOwnProperty(prop)) {
            console.log('\n', prop, typeof post[prop], post[prop], JSON.stringify(post[prop]), '\n///');
            if (JSON.stringify(post[prop]).includes(query) || JSON.stringify(post[prop]).includes(query.toString())) {
                return true;
            }
        }
    }
    return false;
};

/* NOTE:
    Returns an array {arr} of unique objects from a base array that contain the value {s}.
 */
let search = (arr, s) => {
    let matches = [], i, key;

    for (i = arr.length; i--;)
        for (key in arr[i])
            if (arr[i].hasOwnProperty(key) && arr[i][key].indexOf(s) > -1)
                matches.push(arr[i]);  // <-- This can be changed to anything
    return matches;
};

/* NOTE:
    Reads the entire archive synchronously and returns it as a JSON object. Once the archive gets big enough, I will have to switch to async streams.
 */
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

/* NOTE:
    Saves the archive in memory to the disk.
 */
let saveArchive = (updatedArchive) => {
    fs.writeFileSync(archivePath, JSON.stringify(updatedArchive));
};

/* NOTE:
    Iterating through the entire archive, finds the field {type} and returns all unique members of every post[type]. I used the .slice part because JSON.stringify was overused. I should fix that.
 */
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
exports.jsonIncludes = jsonIncludes;
exports.postContainsQuery = postContainsQuery;
exports.getPostsBySearchQuery = getPostsBySearchQuery;
exports.getPostsByDescriptor = getPostsByDescriptor;
exports.getPostsByLabel = getPostsByLabel;
exports.getAllDescriptors = getAllDescriptors;