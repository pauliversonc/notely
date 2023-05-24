import * as model from "./model.js";
import mainView from "./view/mainView.js";
import sidenavView from "./view/sidenavView.js";
import * as config from "./config.js"
import toastView from "./view/toastView.js";
import optionsView from "./view/optionsView.js";
import modalView from "./view/modalView.js";

// render notes depending on the path / link
const controlNotes = function () {

  // 0. get path
  const statePath = model.getPath();

  // 1. get notes
  const notes = model.getPinnedUnpinnedNotes(statePath);

  // 2. render notes
  mainView.render(notes);

};

// render sidanav count
const controlSidebar = function(){

  // 0. get notes count
  const notes = model.getNotesCount();

  // 1. render counts in sidebar
  sidenavView.render(notes);

}

// load the notes depending on the clicked sidenav link (saved, important, trash)
const controlSidenavLink = function(link){
  mainView.scrollToTop();

  // 0. clear input form in search field
  sidenavView.clearFormSearch();

  // 1. remove selected notes, selected options and deselect notes
  hideSelectedOptions();

  // 2. remove active link
  sidenavView.removeActive();

  // 3. add active link to the clicked element
  sidenavView.addActive(link);

  // 4. get link type / linkname
  const {linkName} = link.dataset;

  // 5. set state path / type
  model.updatePath(linkName);

  // 6. get notes
  const notes = model.getPinnedUnpinnedNotes(linkName);
  
  // 7. render notes
  mainView.render(notes);

  // 8. Toggle button add
  if (linkName === 'saved') modalView.showBtnAdd();
  else modalView.hideBtnAdd();
  
}

// Handle clicked note
// index of the element base on the type of element || 0 = checkbox, 1 = wrapper, 2 buttons
// id represents state.notes.id
const controlNote = function(element, index, id){

    // 0. handle checkbox note
  if(index === 0){
    // 0a. handle clicked checkbox / update note to selected (true / false)
    handleCheckbox(element);
    // 0b. get selected notes count
    const selectedNotesCount = model.getSelectedNotesCount();
    // 0c. get path
    const statePath = model.getPath();
    // 0d. check if all selected notes are pinned?
    const isPinned = model.areAllSelNotesPinned();
    // 0e. check if all selected notes are important?
    const isImportant = model.areAllSelNotesStatus('important');
    // 0f. toggle selected options visibility base on selected notes count
    optionsView.toggleSelOption(selectedNotesCount, statePath, isPinned, isImportant);
  }

  // 1. get the note by id and open modal to get ready for update
  if(index === 1){
    // 1a. hide selected options and selected notes when you try to open modal
    hideSelectedOptions();
    // 1b. get path
    const statePath = model.getPath();
    // 1c. if path is trash, don't open modal
    if(statePath === 'trash') return;
    // 1d. get note data by id
    const note = model.getNoteById(id);
    
    // 1e. set the note value
    // 1e. check if modal is pinned
    // 1e. resize modal
    // 1e. toggle modal (open)
    modalView.setFormValue(note);
  }


  // 2. handle selected note btn (pinned, important, trash, etc.)
  if(index === 2) {
    // 2a. hide selected options and selected notes when you try to open modal
    hideSelectedOptions();

    // 2b. extract data from selected element
    // 2b. update selected note either (pinned, important, trash, etc.)
    // 2b. open toast message will depend on clicked button
    handleSelectedBtn(element); 
    // 2c. re-render notes
    controlNotes();
    // 2d. re-render sidebar
    controlSidebar();
    // 2e. save to local storage
    model.persistNotes();

  }

}

// update the notes selected true and open the selected options
const handleCheckbox = function(element){
  // 0. get the maincard of selected checkbox
  const mainCard = element.parentElement;
  // 1. get the id of the card base on dataset
  const {cardId} = mainCard.dataset;
  // 2. update note.pinned to (true / false) by id
  model.selectNote(+cardId);
  // 3. toggle checkbox / pass the maincard element
  mainView.toggleCheckbox(mainCard);
  // 4. hide btn add when checkbox is active
  modalView.hideBtnAdd();
}

// handle selected btn per note (per card)
const handleSelectedBtn = function(element){
  // 0. get the maincard of selected button
  const mainCard = element.closest('.main--card');
  // 1. get the id of the card base on dataset
  const {cardId} = mainCard.dataset;
  // 2. get the btn type base on the element (either pined, important, paint, restore or trash)
  const {btnType} = element.dataset;
  // 3. update selected note
  model.updateNoteStatus(+cardId, btnType);
  // 4. extract message in config depending on btntype
  const toastMessage = config.TOAST_MESSAGES[btnType];
  // 5. open toast message
  toastView.openToast(toastMessage, config.TOAST_DURATION);
}

// handle the click event on selected options (either pined, important, paint, restore, trash or close)
const controlSelOptionBtn = function(element){
    const {btnType} = element.dataset;

    // 0. run script when pinned is clicked in selected option
    if(btnType === 'pinned') {
      // 0a. update the note pinned value of all selected notes.
      model.updateSelNotesPinned();
      // 0b. re-render notes
      controlNotes();
      // 0c. re-render sidebar
      controlSidebar();
      // 0d. deselect all notes
      model.deselectNotes();
      // 0e. close the selected options view
      optionsView.toggleSelOption();
      // 0f. extract message in config depending on btntype
      const toastMessage = config.TOAST_MESSAGES[btnType];
      // 0g. open toast message
      toastView.openToast(toastMessage, config.TOAST_DURATION);
      // 0h. save to local storage
      model.persistNotes();
    }

    // 1. run script if either important, trash or restore is clicked in selected option
    if(btnType === 'important' || btnType === 'trash' || btnType === 'restore') {
      // 1a. update selected notes according to btn type
      model.checkSelNotesStatus(btnType);
      // 1b. re-render notes
      controlNotes();
      // 1c. re-render sidebar
      controlSidebar();
      // 1d. deselect all notes
      model.deselectNotes();
      // 1e. close the selected options view
      optionsView.toggleSelOption();
      // 1f. extract message in config depending on btntype
      const toastMessage = config.TOAST_MESSAGES[btnType];
      // 1g. open toast message
      toastView.openToast(toastMessage, config.TOAST_DURATION);
      // 1h. save to local storage
      model.persistNotes();
    }
  
    // 2. run the script if the btn close is clicked in selected option
    if(btnType === 'close') {
      // 2a. deselect all notes
      model.deselectNotes();
      // 2b. close the selected options view
      optionsView.toggleSelOption();
      // 2c. remove selected class to all main card 
      mainView.removeSelNotes();
    }

    // 3. remove d-none in btn add if user is in the path of saved
    const path = model.getPath();
    if(path === 'saved') modalView.showBtnAdd();
}

// on keyup search
const controlSearch = function(keyword, e) {

  // 0. run render if formsearch is clear or empty space
  if (keyword.length === 0 && (e.keyCode === 8 || e.key === 'Backspace' || e.keyCode === 46 || e.key === 'Delete')) {
    // re-render notes
    controlNotes();
    modalView.showBtnAdd();
  }
  
  // 1. render search with keyword
  else if (keyword.length > 0) {
    // get matched notes by keyword
    const matchedNotes = model.search(keyword)
    mainView.renderSearch(matchedNotes);
    modalView.hideBtnAdd();

  }
}

// handler searchform on focus - remove selected notes
const controlSearchFocus = function() {
  // 0. deselect notes and hide the selected options
  hideSelectedOptions();
}

const hideSelectedOptions = function() {
  // 0. deselect all notes
  model.deselectNotes();
  // 1. close the selected options view
  optionsView.toggleSelOption();
  // 2. remove selected class to all main card 
  mainView.removeSelNotes()
}

// save new note from modal either pinned or not
const controlModal = function(btnType, obj, isUpdate = false, id) {
 
  // 0. save new note
  if(btnType === 'save') {
    // 0a. save note in state that is not pinned
    const note = model.createNote(obj);
    // 0b. render unpinned note / append the ui card
    controlNotes()
    // 0c. scroll to newly added note
    mainView.scrollIntoView(btnType);
    // 0d. save to local storage
    model.persistNotes();
  }

  // 1. update note
  if(btnType === 'update') {    
    // 1a. find and update note
    model.updateNote(id, obj.title, obj.body);
    // 1b. render ui
    controlNotes();
    // 1c. save to local storage
    model.persistNotes();
  }

  // 2. when pin is clicked
  if(btnType === 'pin'){
    // 2a. check if click pin is for update 
    if (isUpdate) {
      // 2aa. true = the matched note will converted to pinned
      model.updateNote(id, obj.title, obj.body, true);
      // 2ab. render ui
      controlNotes();
      // 2ac. save to local storage
      model.persistNotes();
    } 
    
    // 2b. create new notes which is pinned
    else {
      // 2ba. save note in state that is pinned
      const note = model.createNote(obj, true);
      // 2bb. render pinned note / append the ui card
      // mainView.renderPinned(note);
      controlNotes()
      // 2bc. scroll to newly added note
      mainView.scrollIntoView(btnType);
      // 2bd. save to local storage
      model.persistNotes();
    }

  }

  // 3. extract message in config depending on btntype
  const toastMessage = config.TOAST_MESSAGES[btnType];
  // 4. open toast message
  toastView.openToast(toastMessage, config.TOAST_DURATION);
  // 5. render sidenav notes count
  controlSidebar();

}

// it will revert the array
const controlSortedNote = function (){
  
  // 1. toggle isDescending
  model.toggleIsDescending();

  // 2. get keyword from search field in the sidenav
  const keyword = sidenavView.getSearchFieldValue();

  // 3. if value / keyword is exist in the search field
  if (keyword) {
    // 3a. get matched notes by keyword
    const matchedNotes = model.search(keyword)
    // 3b. re-render search controller
    mainView.renderSearch(matchedNotes);  
  } 
  // 4. if keyword is empty
  else {
    // 4a. re-render main view
    controlNotes();
  }
  
}




const init = function () {
  model.loadNotes();
  controlNotes();
  controlSidebar();
  mainView.addHandlerNotesWrapper(controlNote);
  mainView.addHandlerBtnViewAndSort(controlSortedNote);
  sidenavView.addHandlerSidenavLink(controlSidenavLink);
  sidenavView.addHandlerFormSearch(controlSearch)
  sidenavView.addHandlerFormFocus(controlSearchFocus)
  optionsView.addHandlerSelOptionBtn(controlSelOptionBtn);
  modalView.addHandlerModalFooter(controlModal);
  modalView.addHandlerPinNote(controlModal);
};

// initialize
init();
