import { Note } from './note.interface';

export interface IAppState {
    currentNote: Note;
    originalNotes: Note[];
    notes: Note[];
    searchQuery: string
    lastUpdate: Date;
}