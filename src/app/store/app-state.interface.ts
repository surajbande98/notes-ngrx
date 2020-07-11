import { Note } from '../main/models/note';

export interface IAppState {
    selectedNote: Note;
    originalNotes: Note[];
    notes: Note[];
    searchQuery: string
    lastUpdate: Date;
}