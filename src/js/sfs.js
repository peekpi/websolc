let localStorage = window.localStorage;

function newSlot(){
    let last_slot = localStorage['last_slot'];
    let slot = last_slot == undefined ? -1 : Number(last_slot);
    localStorage['last_slot'] = slot+1;
    return slot+1;
}

function getSlotContent(slot){
    return localStorage['file_'+slot];
}

function putSlotContent(slot, content){
    localStorage['file_'+slot] = content;
}
function delSlotContent(slot) {
    delete localStorage['file_'+slot];
}

function hasFS(){
    return localStorage['ls-file'] != undefined;
}
function getFile(path) {
    let file = findFile(path);
    return getSlotContent(file[0][1]); // [[name,slot], index]
}
function saveFile(path, content) {
    let file = findFile(path); // [[name,slot], index]
    putSlotContent(file[0][1], content);
}
// [[name, slot],...]
let cachedDir = null;
function getDir() {
    if(cachedDir) return cachedDir;
    let dir = localStorage['ls-file'];
    if(dir) return JSON.parse(dir);
    return [];
}
function getDirs(){
    return getDir().map(e=>e[0]);
}
function saveDir(dirs){
    cachedDir = null;
    localStorage['ls-file'] = JSON.stringify(dirs);
}
function findFile(path) {
    let files = getDir();
    for(let i in files){
        let [name,slot] = files[i];
        if(name == path)
            return [[name, slot], i];
    }
    return false;
}
function hasFile(path) {
    return findFile(path) !== false;
}
function newFile(path) {
    let files = getDir();
    if(hasFile(path))
        throw "file exist!";
    saveDir([...files, [path, newSlot()]]);
}

function delFile(path){
    let dir = findFile(path);  // [[name,slot], index]
    delSlotContent(dir[0][1]);
    let files = getDir();
    saveDir(files.filter(e=>e[0]!=path));
}
window.delfile = delFile;

function moveFile(oldpath, newpath) {
    if(hasFile(newpath)) throw "file exist!";
    let files = getDir();
    for(let i in files){
        let file = files[i];
        if(file[0] == oldpath){
            file[0] = newpath;
            saveDir(files);
            return;
        }
    }
    throw "file not find!";
}

export default {
    hasFS,
    getDirs,
    getFile,
    saveFile,
    newFile,
    delFile,
    moveFile
}