function requestPostCount() {
    socket.emit('get post count');
}

// noinspection JSUnusedLocalSymbols
function requestArchiveBackup() {
    socket.emit('get archive backup');
}

function getPostByIndex(index) {
    socket.emit('get post by index', {index: index});
}

// noinspection JSUnusedLocalSymbols
function requestPostsByLabel(label) {
    socket.emit('get posts by label', {label: label});
}

function requestPostsByDescriptor(descriptorType, descriptorName) {
    socket.emit('get posts by descriptor', {type: descriptorType, name: descriptorName});
}

// noinspection JSUnusedLocalSymbols
function search(searchField) {
    let query = searchField.value;
    socket.emit('get posts by search query', {query: query});
}