"use strict";
function dragStart(event) {
    const div = event.target;
    event.dataTransfer.setData('text/plain', div.scrollTop);
}
function dragOver(event) {
    event.preventDefault();
}
function drop(event) {
    const div = event.target;
    const scrollTop = event.dataTransfer.getData('text/plain');
    div.scrollTop = scrollTop;
}
window.addEventListener('load', (event) => {
    const map = document.getElementById('map');
    if (map) {
        map.scrollTop = (map.scrollHeight - map.clientHeight) / 2;
    }
});
