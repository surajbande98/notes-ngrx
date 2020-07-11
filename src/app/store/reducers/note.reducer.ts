import { NoteActionTypes, NoteAction } from "../actions/notes.actions";
import { IAppState } from '../app-state.interface';

import { addOrUpdateNote, getNotes, selectNote, saveNote, deleteNote, searchNote } from '../selectors/note.selector';

// App Store state
export const INITIAL_STATE: IAppState = {
    selectedNote: null,
    notes: [],
    originalNotes: [],
    searchQuery: '',
    lastUpdate: new Date()
};

// Notes Reducer
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