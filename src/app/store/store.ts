
// Action types
import { SHOW_NOTE, SAVE_NOTE, GET_NOTES, EDIT_NOTE, DELETE_NOTE, SEARCH_NOTE } from '../action.type.constant';

import { IAppState } from './app-state.interface';
import { updateObject } from './helper';
import { StorageService } from 'src/shared/services/storage.service';

// Store config
// Define the app store state
export const INITIAL_STATE: IAppState = {
    currentNote: null,
    notes: [],
    originalNotes: [],
    searchQuery: '',
    lastUpdate: null
};

//Redux selector
// Basically this function takes care of saving the note into storage
// Bind the entered text into text area into sidebar note and save into storage
const bindEnteredTextToSidebar = (state, action) => {
    // if note is selected for edit
    if (state.notes.length > 1 && state.currentNote) {

        // Take shallow copy of notes for immutable update
        let notesCopy = [...state.notes];

        const fetchedNote = notesCopy.findIndex(ben => (ben.id == state.currentNote.id));

        // if note found && update the note
        if (fetchedNote > -1) {

            // if it is default note
            action.payload.isDefault = false;

            notesCopy[fetchedNote] = action.payload;

            StorageService.saveData(notesCopy);
            
            //localStorage.setItem('NOTES', JSON.stringify(notesCopy));

            // action creator to return the pure state
            return updateObject(state, {
                notes: notesCopy,
                currentNote: { ...action.payload },
                lastUpdate: new Date()
            });
        }

    } else {
        // Update the entered title to dummy note title

        // Take shallow copy of notes for immutable update
        let notesCopy = [...state.notes];

        notesCopy[0] = action.payload;

        notesCopy[0].isDefault = false;

        StorageService.saveData(notesCopy);
        //localStorage.setItem('NOTES', JSON.stringify(notesCopy));

        // action creator to return the pure state
        return updateObject(state, {
            notes: notesCopy,
            originalNotes: notesCopy,
            currentNote: null,
            lastUpdate: new Date()
        });
    }
};

// Edit note on select from sidebar
const editNote = (state, action) => {

    // Take shallow copy of notes for immutable update
    let notesCopy = [...state.notes];

    // Make all notes as not selected (toggle active class based on isSelected flag)
    notesCopy = notesCopy.map(note => {
        return {
            ...note,
            isSelected: false
        };
    });

    let noteFound = notesCopy.findIndex(note => note.id == action.payload.id);

    // if found make as select to make it active (background color)
    if (noteFound > -1) notesCopy[noteFound].isSelected = true;

    // action creator to return the pure state
    return updateObject(state, {
        notes: notesCopy,
        currentNote: action.payload,
        lastUpdate: new Date()
    });
};

// Basically this function used to just add dummy note if user update the dummy note
// Save selector to save the note into permenant storage
const saveNoteSelector = (state, action) => {

    // create a dummy note
    let note = {
        id: new Date().getTime(),
        title: 'New Title',
        text: 'No additional t...', // 15 chars
        createdDate: new Date(),
        isSelected: false,
        isDefault: true
    };

    let notes = [...state.notes];

    let isDummyNote;

    isDummyNote = notes.find(note => note.isDefault);

    // if not dummy note found, add one
    if (!isDummyNote && notes.length >= 1) {
        notes.map(x => (x.isDefault == true) ? x.isDefault = false : x);

        // Remove and add dummy note
        notes.splice(0, 0, note);
    }

    // user selects note from sidebar and update
    if (notes.length >= 0 && state.currentNote && notes[0].id == state.currentNote.id) {
        notes.map(x => (x.isDefault == true) ? x.isDefault = false : x);
        notes.splice(0, 0, note);
    }

    notes.map(x => (x.isSelected == true) ? x.isSelected = false : x);

    // Save into storage for further use
    StorageService.saveData(notes);
    //localStorage.setItem('NOTES', JSON.stringify(notes));

    // action creator to return the pure state
    return updateObject(state, {
        notes: notes,
        originalNotes: notes,
        currentNote: null,
        lastUpdate: new Date()
    });
};

// Get selector to fetch all notes from storage
const getNotesSelector = (state, action) => {

    const storage = localStorage;

    let notesInStorage = [];

    // check if storage is empty or not
    if (storage && storage.NOTES) {
        notesInStorage = JSON.parse(StorageService.fetchData('NOTES'));
        //notesInStorage = JSON.parse(storage.getItem('NOTES'));
    }

    let isDefault = false;

    //  check for dummy note 
    if (notesInStorage.length > 0) {
        isDefault = notesInStorage.find(note => note.isDefault);
    }

    // if exists add new into notes list
    if (notesInStorage.length == 0 || !isDefault) {
        addDummyNote(notesInStorage);
    }

    // make all as non selected
    notesInStorage.map(x => (x.isSelected == true) ? x.isSelected = false : x);

    // fetch from storage
    
    StorageService.saveData(notesInStorage);
    //localStorage.setItem('NOTES', JSON.stringify(notesInStorage));

    // action creator to return the pure state
    return updateObject(state, {
        notes: notesInStorage,
        originalNotes: notesInStorage
    });

};

// Delete note from storage
const deleteNoteSelector = (state, action) => {

    let clonedNotes = [...state.notes];

    // Deep clone
    let originalNotes = JSON.parse(JSON.stringify(state.originalNotes));

    // if note is selected for deletion
    if (state.currentNote && clonedNotes.length) {

        // filter from original array
        clonedNotes = originalNotes.filter(note => note.id != state.currentNote.id)

        let isDummyNote = clonedNotes.find(note => note.isDefault);

        // if dummy note deleted, add new dummy note
        if (!isDummyNote && clonedNotes.length >= 0) {
            addDummyNote(clonedNotes);
        }

        // log into storage for further use
        StorageService.saveData(clonedNotes);
        //localStorage.setItem('NOTES', JSON.stringify(clonedNotes));
    }

    // user deleted last note, add new dummy note
    if (!clonedNotes.length) {
        addDummyNote(clonedNotes);
    }

    // action creator to return the pure state
    return updateObject(state, {
        notes: clonedNotes,
        originalNotes: clonedNotes,
        currentNote: null,
        lastUpdate: new Date()
    });
};

// Search the note into notes list
const searchNoteSelector = (state, action) => {
    let notesToDelete = JSON.parse(JSON.stringify(state.originalNotes));

    // filter for given search string
    notesToDelete = notesToDelete.filter(
        note => note.title.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
    );

    // action creator to return the pure state
    return updateObject(state, {
        notes: notesToDelete,
        currentNote: null,
        searchQuery: action.payload,
        lastUpdate: new Date()
    });
};

// helper selector
const addDummyNote = (list) => {
    return list.unshift({
        id: new Date().getTime(),
        title: 'New Title',
        text: 'No additional t...', // 15 chars
        createdDate: new Date(),
        isSelected: false,
        isDefault: true
    });
}

// Reducer is pure function
export const rootReducer = (state: IAppState, action): IAppState => {
    switch (action.type) {
        case SHOW_NOTE:
            return bindEnteredTextToSidebar(state, action);

        case EDIT_NOTE:
            return editNote(state, action);

        case SAVE_NOTE:
            return saveNoteSelector(state, action);

        case GET_NOTES:
            return getNotesSelector(state, action);

        case DELETE_NOTE:
            return deleteNoteSelector(state, action);

        case SEARCH_NOTE:
            return searchNoteSelector(state, action);

        default:
            return state;
    }

}


