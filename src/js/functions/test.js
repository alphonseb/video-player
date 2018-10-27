const textInput = document.querySelector('#playlistName')
const $playlistContainer = document.querySelector('.playlists')
const $savedListsContainer = document.querySelector('.saved-playlists ul')
let playlistIndex = 0
let playlists = localStorage.getItem('playlists') ? JSON.parse(localStorage.getItem('playlists')) : {}

for (const list of Object.keys(playlists)) {
    let $list = document.createElement('li')
    $list.innerHTML = playlists[list].name
    $savedListsContainer.appendChild($list)
}

textInput.addEventListener('change',()=>
{
    let listName = textInput.value
    if(listName !== ''){
        addNewList(listName)
        playlists[listName] = {}
        playlists[listName].name = listName
        localStorage.setItem('playlists',JSON.stringify(playlists))
        updateDisplayedPlaylists(listName)

    }
})

const addNewList = (name)=>
{
    playlistIndex++
    let newList = document.createElement('div');
    newList.classList.add('playlist')
    let check = document.createElement('input')
    check.setAttribute('type','checkbox')
    check.setAttribute('id', `playlist${playlistIndex}`)
    check.checked = true
    newList.appendChild(check)
    let label = document.createElement('label')
    label.setAttribute('for', `playlist${playlistIndex}`)
    label.innerHTML = name
    newList.appendChild(label)
    
    $playlistContainer.appendChild(newList)
}

const updateDisplayedPlaylists = (list)=>{
    let $list = document.createElement('li');
    $list.innerHTML = playlists[list].name;
    $savedListsContainer.appendChild($list);
}



