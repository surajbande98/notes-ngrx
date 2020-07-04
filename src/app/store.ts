import { SHOW_NOTE, SAVE_NOTE, GET_NOTES, EDIT_NOTE, DELETE_NOTE, SEARCH_NOTE } from './action.type.constant';

export interface Note {
    id: number;
    title: string;
    text: string;
    isSelected: boolean;
    isDefault?: boolean;
    createdDate: Date;
}

export interface IAppState {
    currentNote: Note;
    originalNotes: Note[];
    notes: Note[];
    searchQuery: string
    lastUpdate: Date;
}

export const INITIAL_STATE: IAppState = {
    currentNote: null,
    notes: [],
    originalNotes: [],
    searchQuery:'',
    lastUpdate: null
};

export const rootReducer = (state: IAppState, action): IAppState => {
    switch (action.type) {
        case SHOW_NOTE:

            if (state.notes.length > 1) {

                let notesCopy = [...state.notes];

                const fetchedNote = notesCopy.findIndex(ben => (ben.id == state.currentNote.id));

                // update the note
                if (fetchedNote > -1) {

                    // if it is default note
                    action.payload.isDefault = false;

                    notesCopy[fetchedNote] = action.payload;

                    localStorage.setItem('NOTES', JSON.stringify(notesCopy));

                    return {
                        ...state,
                        notes: notesCopy,
                        currentNote: { ...action.payload },
                        lastUpdate: new Date()
                    }
                }

            } else {
                // Add new one

                let notesCopy = [...state.notes];

                notesCopy[0] = action.payload;

                notesCopy[0].isDefault = true;

                localStorage.setItem('NOTES', JSON.stringify(notesCopy));

                return Object.assign({}, state, {
                    notes: notesCopy,
                    originalNotes: notesCopy,
                    currentNote: null,
                    lastUpdate: new Date()
                });
            }

        case EDIT_NOTE:

            let notesCopy = [...state.notes];

            notesCopy = notesCopy.map(note => {
                return {
                    ...note,
                    isSelected: false
                };
            });

            let noteFound = notesCopy.findIndex(note => note.id == action.payload.id);

            if (noteFound > -1) notesCopy[noteFound].isSelected = true;

            return {
                ...state,
                notes: notesCopy,
                originalNotes: notesCopy,
                currentNote: action.payload,
                lastUpdate: new Date()
            }

        case SAVE_NOTE:
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

            if (notes.length == 1) {
                isDummyNote = notes.find(note => note.isDefault);
            }

            if (isDummyNote && isDummyNote.isDefault) {
                notes.map(x => (x.isDefault == true) ? x.isDefault = false : x);
                notes.splice(0, 0, note);
            }

            if (notes.length >= 0 && state.currentNote && notes[0].id == state.currentNote.id) {
                notes.map(x => (x.isDefault == true) ? x.isDefault = false : x);
                notes.splice(0, 0, note);
            }


            notes.map(x => (x.isSelected == true) ? x.isSelected = false : x);

            localStorage.setItem('NOTES', JSON.stringify(notes));

            return {
                ...state,
                notes: notes,
                originalNotes: notes,
                currentNote: null
            }

        case GET_NOTES:
            const storage = localStorage;

            let notesInStorage = [];

            if (storage && storage.NOTES) {
                notesInStorage = JSON.parse(storage.getItem('NOTES'));
            }

            let isDefault = false;

            if (notesInStorage.length > 0) {
                isDefault = notesInStorage.find(note => note.isDefault);
            }

            if (notesInStorage.length == 0 || !isDefault) {
                notesInStorage.unshift({
                    id: new Date().getTime(),
                    title: 'New Title',
                    text: 'No additional t...', // 15 chars
                    createdDate: new Date(),
                    isSelected: false,
                    isDefault: true
                });
            }

            notesInStorage.map(x => (x.isSelected == true) ? x.isSelected = false : x);

            localStorage.setItem('NOTES', JSON.stringify(notesInStorage));

            return {
                ...state,
                notes: notesInStorage,
                originalNotes: notesInStorage
            };

        case DELETE_NOTE:
            let clonedNotes = [...state.notes];

            if (state.currentNote && clonedNotes.length) {

                clonedNotes = clonedNotes.filter(note => note.id != state.currentNote.id)

                localStorage.setItem('NOTES', JSON.stringify(clonedNotes));

            }

            if (!clonedNotes.length) {
                clonedNotes.unshift({
                    id: new Date().getTime(),
                    title: 'New Title',
                    text: 'No additional t...', // 15 chars
                    createdDate: new Date(),
                    isSelected: false,
                    isDefault: true
                });
            }

            return {
                ...state,
                notes: clonedNotes,
                originalNotes: clonedNotes,
                currentNote: null,
                lastUpdate: new Date()
            }

        case SEARCH_NOTE:

            let notesToDelete = [...state.originalNotes];

            // filter for given search string
            notesToDelete = notesToDelete.filter(
                note => note.title.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
            );

            return {
                ...state,
                notes: notesToDelete,
                currentNote: null,
                searchQuery: action.payload,
                lastUpdate: new Date()
            }

        default:
            return state;
    }

}

// selectors


