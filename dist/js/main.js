'use strict';

var textInput = document.querySelector('#playlistName');
var $playlistContainer = document.querySelector('.playlists');
var $savedListsContainer = document.querySelector('.saved-playlists ul');
var playlistIndex = 0;
var playlists = localStorage.getItem('playlists') ? JSON.parse(localStorage.getItem('playlists')) : {};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = Object.keys(playlists)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var list = _step.value;

        var $list = document.createElement('li');
        $list.innerHTML = playlists[list].name;
        $savedListsContainer.appendChild($list);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

textInput.addEventListener('change', function () {
    var listName = textInput.value;
    if (listName !== '') {
        addNewList(listName);
        playlists[listName] = {};
        playlists[listName].name = listName;
        localStorage.setItem('playlists', JSON.stringify(playlists));
        updateDisplayedPlaylists(listName);
    }
});

var addNewList = function addNewList(name) {
    playlistIndex++;
    var newList = document.createElement('div');
    newList.classList.add('playlist');
    var check = document.createElement('input');
    check.setAttribute('type', 'checkbox');
    check.setAttribute('id', 'playlist' + playlistIndex);
    check.checked = true;
    newList.appendChild(check);
    var label = document.createElement('label');
    label.setAttribute('for', 'playlist' + playlistIndex);
    label.innerHTML = name;
    newList.appendChild(label);

    $playlistContainer.appendChild(newList);
};

var updateDisplayedPlaylists = function updateDisplayedPlaylists(list) {
    var $list = document.createElement('li');
    $list.innerHTML = playlists[list].name;
    $savedListsContainer.appendChild($list);
};