const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumn = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// filter array to remove empty items
function filterArray(array){
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index},${column})`);

  columnEl.appendChild(listEl);

}

// Update Columns in DOM 
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  });
  backlogListArray = filterArray(backlogListArray)

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index)
  });
  progressListArray = filterArray(progressListArray)

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  });
  completeListArray = filterArray(completeListArray)

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  });
  onHoldListArray = filterArray(onHoldListArray)

  updatedOnLoad = true;
  updateSavedColumns();
}

//NOTA
// Array.from => trasforma l'elemento in un array
// Stiamo dicendo di prendere tutti gli elementi visibili in quel momento nella colonna HTML, estrarre automaticamente da ciascuno di essi solo il testo scritto all'interno grazie al comando di trasformazione .map(), e riversare immediatamente questa nuova lista di testi puliti dentro la tua variabile backlogListArray in un colpo solo.

function rebuildArrays(){
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
 
  updateDOM();
}

function drag(e){
  dragging = true;
  draggedItem = e.target;
}

function allowDrop(e){
  e.preventDefault();
}

// NOTA: quando prendiamo l'elemento e lo trasciniamo verso la colonna che vogliamo, l'HTML fa scattare l'evento ondragenter="dragEnter(1)" . La funzione dragEnter(column) riceve quel numero 1 e sta assegnando currentColumn = column;, così facendo stiamo dicendo a JavaScript di appuntarsi mentalmente: "Ok, in questo momento il mouse sta sorvolando la colonna 1".
function dragEnter(column){
  listColumn[column].classList.add('over');
  currentColumn = column;
}

//NOTA: quando finalmente molliamo il clic del mouse, parte la funzione drop(e). Siccome l'HTML non le passa nessun numero, lei va a sbirciare nella variabile globale currentColumn (che ora vale 1) e capisce esattamente dove agganciare l'elemento.
function drop(e){
  e.preventDefault();
  listColumn.forEach((column) => {
    column.classList.remove('over');
  })

  const parent = listColumn[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}


// ------------------------------------------------- show/hide box
function updateItem(id,column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumn[column].children;
  const textSelectedItem = selectedColumnEl[id].textContent;
  if(!dragging){
    if(!textSelectedItem){
      delete selectedArray[id];
    }else{
      selectedArray[id] =  textSelectedItem;
    }
    updateDOM();
  }
}

function addToColumn(column){
  const itemText = addItems[column].textContent
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// on load
updateDOM();
