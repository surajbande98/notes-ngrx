import { NoteActionTypes, NoteAction } from "../actions/notes.actions";
import { StorageService } from 'src/shared/services/storage.service';
import { Helper as HelperService } from 'src/app/main/services/helper';
import { IAppState } from '../app-state.interface';
import { Note } from 'src/app/main/models/note';

import * as _ from 'lodash';

// Define the App Store state
export const INITIAL_STATE: IAppState = {
    selectedNote: null,
    notes: [],
    originalNotes: [],
    searchQuery: '',
    lastUpdate: new Date()
};

// App Reducer
export function NoteReducer(state = INITIAL_STATE, action: NoteAction) {
    switch (action.type) {
        case NoteActionTypes.Add:
            return addOrUpdateNote(state, action);
        case NoteActionTypes.Select:
            return selectNote(state, action);
        case NoteActionTypes.Save:
            return saveNote(state, action);
        case NoteActionTypes.Delete:
            return deleteNote(state, action);
        case NoteActionTypes.Search:
            return searchNote(state, action);
        case NoteActionTypes.Fetch:
            return getNotes(state, action);
        default:
            return state;
    }
}

// Add or update the note selector
const addOrUpdateNote = (state, action) => {

    // Take shallow copy of notes for immutable update
    let notesCopy = [...state.notes];

    let originalNotesCopy = [...state.originalNotes];

    const count = notesCopy.length;

    let selectedNote = null;

    // If more than 2 notes found & note is selected
    if (count > 1 && state.selectedNote) {

        // find and update
        let isNote = HelperService.findItem(notesCopy, state.selectedNote.id);

        if (isNote !== -1) {
            notesCopy[isNote] = action.payload;
            selectedNote = action.payload;

            // update original notes
            isNote = HelperService.findItem(originalNotesCopy, state.selectedNote.id);
            originalNotesCopy[isNote] = action.payload;

        } else {
            selectedNote = null;
        }
    } else {
        // If count is 0 or 1
        if (state.selectedNote && count == 1) {
            notesCopy[0] = action.payload;
            selectedNote = action.payload;
        } else {
            notesCopy.unshift(action.payload);
            selectedNote = action.payload;
        }

        originalNotesCopy = notesCopy;
    }

    /// filter notes which have text empty
    notesCopy = notesCopy.filter(note => note.text);

    originalNotesCopy = originalNotesCopy.filter(note => note.text);

    // Save into storage
    StorageService.saveData(originalNotesCopy);

    // action creator to return the pure state
    return HelperService.updateObject(state, {
        notes: originalNotesCopy,
        originalNotes: originalNotesCopy.filter(note => note.text),
        selectedNote: selectedNote,
        lastUpdate: new Date()
    });

};

// fetch notes selector
const getNotes = (state, action) => {

    // Get from storage
    let notes = <Note[]>JSON.parse(StorageService.fetchData(action.payload));

    // action creator to return the pure state
    return HelperService.updateObject(state, {
        notes: notes ? notes : [],
        originalNotes: notes,
        selectedNote: null,
        lastUpdate: new Date()
    });
};

// Select note selector
const selectNote = (state, action) => {

    // Copy of notes
    let notesCopy = [...state.notes];

    // Update note as selected
    let updatedNotes = notesCopy.map(note => {
        if (note.id === action.payload.id) {
            return { ...note, isSelected: !note.isSelected };
        }
        return { ...note, isSelected: false };
    });

    // Action creator
    return HelperService.updateObject(state, {
        notes: updatedNotes,
        selectedNote: updatedNotes.filter(note => note.isSelected).length != 0 ? { ...action.payload } : null,
        lastUpdate: new Date()
    });
};

// Save note selector
const saveNote = (state, action) => {

    // Take copy 
    let notesCopy = [...state.notes];

    // Copy of original notes
    let originalNotesCopy = [...state.originalNotes];

    // On note save, make all notes as non selected & clear input
    let updatedNotes = notesCopy.map((note: Note) => {
        return { ...note, isSelected: false }
    });

    let updatedOriginalNotes = originalNotesCopy.map((note: Note) => {
        return { ...note, isSelected: false }
    });

    // Save into storage
    StorageService.saveData(originalNotesCopy);

    // Action creator returns the pure/ Immutable state
    return HelperService.updateObject(state, {
        notes: updatedNotes,
        originalNotes: updatedOriginalNotes,
        selectedNote: null,
        lastUpdate: new Date()
    });

};

const deleteNote = (state, action) => {

    // Delete is basically filtering the list
    let filteredNotes = [...state.notes];

    let filteredOriginalNotes = [...state.originalNotes];

    if (state.selectedNote) {
        filteredNotes = filteredNotes.filter(note => note.id !== state.selectedNote.id);

        filteredOriginalNotes = filteredOriginalNotes.filter(note => note.id !== state.selectedNote.id);

        // Save into storage
        StorageService.saveData(filteredOriginalNotes);

    }

    // Action creator returns the pure/ Immutable state
    return HelperService.updateObject(state, {
        notes: filteredNotes,
        originalNotes: filteredOriginalNotes,
        selectedNote: null,
        lastUpdate: new Date()
    });

};

// Search note selector
const searchNote = (state, action) => {

    // Deep copy 
    let notesToDelete = _.cloneDeep(state.originalNotes);

    // filter for given search string
    notesToDelete = notesToDelete.filter(note =>
        note.text.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
    );

    // action creator to return the pure state
    return HelperService.updateObject(state, {
        notes: notesToDelete,
        selectedNote: null,
        searchQuery: action.payload,
        lastUpdate: new Date()
    });
};
