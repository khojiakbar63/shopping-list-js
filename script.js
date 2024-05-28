// CALL HTML TO JS
const itemForm = document.querySelector('#item-form')
const itemInput = document.querySelector('#item-input')
const itemList = document.querySelector('#item-list')
const clearBtn = document.querySelector('#clear')
const filter = document.querySelector('#filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false;
// FUNCTIONS:
// Display Items
function displayItems () {
    ALL_ITEMS = getItemsFromStorage()
    ALL_ITEMS.forEach(item => addItemToDOM(item))

    checkUI()
}
// Add an item
function onAddItemSubmit (e) {
    e.preventDefault()
    let newItem = itemInput.value[0].toUpperCase() + itemInput.value.slice(1).toLowerCase();
    // let newItem = itemInput.value.toLowerCase()
    if(newItem === ''){
        alert('Add an item!')
        return;
    }  

    // Check for edit-mode
    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        isEditMode = false
    }else{
        if(checkIfItemExists (newItem)){
            alert('That has already been added!')
        }
    }
    // Add item to dom
    addItemToDOM(newItem)
    // Add item to storage
    addItemToStorage(newItem)
    checkUI()
    itemForm.reset()
    return
}
// Add item to dom
function addItemToDOM (item) {
     // Append text to li
     let li = document.createElement('li')
     li.appendChild(document.createTextNode(item))

     // Append button to li
     let button = createButton('remove-item btn-link text-red')
     li.appendChild(button)

     // Append li to itemList
     itemList.appendChild(li)
}

// Mini fns
{
// Create button fn
function createButton (classes) {
    const button = document.createElement('button')
    button.className = classes

    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}
// Create icon fn
function createIcon (classes) {
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}

}
// Add item to storage
function addItemToStorage (item) {
    let ALL_ITEMS = getItemsFromStorage()

    ALL_ITEMS.push(item)

    localStorage.setItem('Items', JSON.stringify(ALL_ITEMS))
}
// Get items from storage
function getItemsFromStorage () {
    let ALL_ITEMS;

    if(localStorage.getItem('Items') === null) {
        ALL_ITEMS = []
    } else {
        ALL_ITEMS = JSON.parse(localStorage.getItem('Items'))
    }
    return ALL_ITEMS
}
// On click item
function onClickItem (e) {
    if (e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    }
}
// Check dublicates
function checkIfItemExists (item) {
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
    
}
// Editmode
function setItemToEdit(item) {
    isEditMode = true
    
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode')
    
    formBtn.innerHTML = 'edit'
    formBtn.innerHTML = `<i class='fa-solid fa-pen'></i> Update Item`
    formBtn.style.backgroundColor = '#228b22'
    itemInput.value = item.textContent
}
// Remove an item
function removeItem (item) {
    if(confirm(`Do you really wanna delete ${item.innerText} ?`)) {
        // Remove item from dom
        item.remove();
        // Remove item from storage
        removeItemFromStorage(item.textContent)

        checkUI()
    }

    checkUI()
}
// Remove item from storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()
    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter(i => i != item);

    // Re-set to localstorage
    localStorage.setItem('Items', JSON.stringify(itemsFromStorage))

}
// Clear items
function clearItems () {
    // itemList.remove()
    // itemList.innerHTML = ''
    if(confirm('Clear all items?')) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild)
        }
    }

    // Clear localstorage
    localStorage.removeItem('Items')
    checkUI()
}
// CheckUI
function checkUI () {
    itemInput.value = ''
    if (itemList.children.length === 0){
        clearBtn.style.display = 'none'
        filter.style.display = 'none'

    } else {
        clearBtn.style.display = 'block'
        filter.style.display = 'block'
    }
    itemInput.focus()

    formBtn.innerHTML = `<i class='fa-solid fa-plus'></i> Add item`
    formBtn.style.backgroundColor = '#333'
}
// Filter 
function filterItems (e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase()
    
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase()
       
        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex'
        }else {
            item.style.display = 'none'
        }
    })
    console.log(text);
}


function init () {
    // EVENTS
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearBtn.addEventListener('click', clearItems)
    filter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)

    checkUI()

}
init ()