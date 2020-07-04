import { ADD_NOTE, SHOW_NOTE, SAVE_NOTE, GET_NOTES, EDIT_NOTE } from './action.type.constant';
import { stat } from 'fs';

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
    notes: Note[];
    lastUpdate: Date;
}

export const INITIAL_STATE: IAppState = {
    currentNote: null,
    notes: [],
    lastUpdate: null
};

export const rootReducer = (state: IAppState, action): IAppState => {
    switch (action.type) {
        case SHOW_NOTE:

            if (state.notes.length && state.currentNote) {

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
                // else {
                //     // Add new one
                //     action.payload.id = state.notes.length + 1;

                //     let notesCopy = [...state.notes];

                //     notesCopy = notesCopy.splice(1, 0, action.payload);

                //     //const notesCopy = state.notes.concat(Object.assign({}, action.payload));

                //     localStorage.setItem('NOTES', JSON.stringify(notesCopy));

                //     return Object.assign({}, state, {
                //         notes: notesCopy,
                //         currentNote: null,
                //         lastUpdate: new Date()
                //     });
                // }


            } else {
                // Add new one

                let notesCopy = [...state.notes];

                // if (state.currentNote) {
                //     const fetchedNote = notesCopy.findIndex(ben => (ben.id == action.payload.id));

                //     if (fetchedNote > -1) {
                //         notesCopy[fetchedNote] = action.payload;

                //         localStorage.setItem('NOTES', JSON.stringify(notesCopy));

                //         return {
                //             ...state,
                //             notes: notesCopy,
                //             currentNote: null,
                //             lastUpdate: new Date()
                //         }
                //     }
                // } 
                // else {
                //action.payload = { ...action.payload.id };

                notesCopy[0] = action.payload;
                //notesCopy.splice(1, 0, action.payload);

                localStorage.setItem('NOTES', JSON.stringify(notesCopy));

                return Object.assign({}, state, {
                    notes: notesCopy,
                    currentNote: null,
                    lastUpdate: new Date()
                });
                //}

            }

        case EDIT_NOTE:

            let notesCopy = [...state.notes];

            notesCopy = notesCopy.map(item => {
                var temp = Object.assign({}, item);
                if (temp.isSelected) {
                    temp.isSelected = false;
                }
                return temp;
            });

            let noteFound = notesCopy.findIndex(note => note.id == action.payload.id);

            if (noteFound > -1) notesCopy[noteFound].isSelected = true;

            console.log(notesCopy);
            return {
                ...state,
                notes: notesCopy,
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


            if (notes.length >= 0 && state.currentNote && notes[0].id == state.currentNote.id) {
                notes.map(x => (x.isDefault == true) ? x.isDefault = false : x);
                notes.splice(0, 0, note);
            }


            notes.map(x => (x.isSelected == true) ? x.isSelected = false : x);

            localStorage.setItem('NOTES', JSON.stringify(notes));

            return {
                ...state,
                notes: notes,
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
                notes: notesInStorage
            };

        default:
            return state;

    }

}
