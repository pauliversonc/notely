import 'core-js/stable';

export const state = {
  notes: [],
  path: 'saved',
  noteIdToUpdate: 0,
  isDescending: false,
};

const now = () => new Date();
const pk = () => new Date().getTime();

// put notes into web local storage
export const persistNotes = function() {
  localStorage.setItem('notes', JSON.stringify(state.notes));
};



// get notes in local storage and set to state
export const loadNotes = function () {
  // get json notes from local storage then extract then set it in state
  const storage = localStorage.getItem('notes');
  if(storage) state.notes = (JSON.parse(storage));
};

export const updatePath = function(path){
  state.path = path;
}

export const getPath = function(){
  return state.path;
}

// Get all notes
export const getNotes = function () {
  return state.notes;
};

// Get pinned and unpinned notes depending on status
export const getPinnedUnpinnedNotes = function (status = 'saved') {
  // reverse the array 

  const reversedNotes = [...state.notes].reverse();
  const notes = (state.isDescending) ? reversedNotes : state.notes;


  return notes.filter((note) => note.status === status)
    .reduce(
      (acc, cur) => {
        cur.pinned ? acc.pinned.push(cur) : acc.unpinned.push(cur);
        return acc;
      },
      { pinned: [], unpinned: [], status}
    );
};

// Get count of each note status
export const getNotesCount = function(){
  return state.notes.reduce((counts, note) => {
    counts[note.status]++;
    return counts;
  }, {saved:0, important:0, trash:0})
}

// find the notes by id
const findNote = function(id){
  return state.notes.find(note => note.id === id);
}

// update note by id
export const updateNote = function(id, newTitle, newBody, toPin = false) {
  const noteToUpdate = findNote(id);
  noteToUpdate.title = newTitle;
  noteToUpdate.body = newBody;

  // update note pinned to true
  if(toPin) noteToUpdate.pinned = true;

}

// find the selected id then update it depending on status
export const updateNoteStatus = function(id, btnType){
  // find the note by id (it will return a reference to the object)
  const noteToUpdate = findNote(id);

  if(btnType === 'pinned') {
    // toggle the note's pinned value
    noteToUpdate.pinned = !noteToUpdate.pinned;
  }

  // if clicked btn is important
  if(btnType === 'important') {
    if (noteToUpdate.status === 'important') {
      noteToUpdate.status = 'saved'; // update note.status
    } else {
      noteToUpdate.status = 'important'; // update note.status
    }
  }

  // if clicked btn is trash
  if(btnType === 'trash') {
    if (noteToUpdate.status === 'trash') {
      deleteNote(id); // splice note
    } else {
      noteToUpdate.status = 'trash'; // update note.status
    }
  }

  // if clicked btn is restore
  if(btnType === 'restore') {
    noteToUpdate.status = 'saved'; // update note.status
  }

}

export const deleteNote = function(id){
  const index = state.notes.findIndex(note => note.id === id);
  state.notes.splice(index, 1);

}

// togglePinn
export const selectNote = function(id){
  const noteToUpdate = findNote(id);
  noteToUpdate.selected = !noteToUpdate.selected;
}

export const areSomeNotesTrue = () => state.notes.some(note => note.selected);

// get the total count of selected notes
export const getSelectedNotesCount = function() {
  return state.notes.reduce((acc, note) => {
    return note.selected ? acc + 1 : acc;
  }, 0);
}

// add note
export const createNote = (note, pinned = false) => {

  const obj = {
    id: pk(),
    title: note.title,
    body: note.body,
    status : 'saved',
    pinned: pinned,
    selected: false,
    timeStamp: now()
  }

  state.notes.push(obj)



  return obj;
}

// Deselect all notes
export const deselectNotes = () => state.notes.forEach(note => note.selected = false); 

// get all selected notes
export const getSelectedNotes = function(){
  return state.notes.filter(note => note.selected);
}

// check if all selected notes are pinned
export const areAllSelNotesPinned = function() {
  const selectedNotes = getSelectedNotes();
  const areNotesPinned = selectedNotes.length > 0 && selectedNotes.every(note => note.pinned);
  return areNotesPinned;
}

// check if all selected notes are important
export const areAllSelNotesStatus = function(status) {
  const selectedNotes = getSelectedNotes();
  const areNotesImportant = selectedNotes.length > 0 && selectedNotes.every(note => note.status === status);
  return areNotesImportant;
}

// update selected notes pinned to (true / false)
export const updateSelNotesPinned = function() {
  const isPinned = areAllSelNotesPinned();
  const selectedNotes = getSelectedNotes();
  selectedNotes.forEach(note => {
    note.pinned = !isPinned;
  });


}

// update all selected note status 
export const updateSelNotesStatus = function(status){
  const selectedNotes = getSelectedNotes();
  selectedNotes.forEach(note => {
    note.status = status;
  });


}

export const checkSelNotesStatus = function(btnType) {
  const isTrue = areAllSelNotesStatus(btnType);

  if(btnType === 'important') {
    if (isTrue) {
      updateSelNotesStatus('saved');
    } else {
      updateSelNotesStatus('important');
    }
  }

  if(btnType === 'trash') {
    if (isTrue) {
      // literal delete notes that is trash
      state.notes = state.notes.filter(note => note.status !== 'trash' || !note.selected);

    } else {
      updateSelNotesStatus('trash');
    }
  }

  if(btnType === 'restore') updateSelNotesStatus('saved');


}


export const search = function(query) {
  const queryLowerCase = query.toString().toLowerCase();
  const notes = state.notes;
  const status = state.path;
  const isDescending = state.isDescending;


  const matched = notes.filter((note)=>{
    if(note.status === status) {
      const titleLowerCase = note.title.toString().toLowerCase();
      const bodyLowerCase = note.body.toString().toLowerCase();
       return titleLowerCase.includes(queryLowerCase) || bodyLowerCase.includes(queryLowerCase)
    }
  });

  if (isDescending) 
    return matched.reverse();
  else 
    return matched;
}

export const getNoteById = function(id) {
  return state.notes.find(note => note.id === id);
}

export const toggleIsDescending = function() {
  state.isDescending = !state.isDescending;
}





