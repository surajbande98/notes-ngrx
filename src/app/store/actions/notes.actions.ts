
export const GET_NOTES = 'GET_NOTES';
export const ADD_NOTE = 'ADD_NOTE';
export const SELECT_NOTE = 'SELECT_NOTE';
export const SAVE_NOTE = 'SAVE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SEARCH_NOTE = 'SEARCH_NOTE';

import { Action } from '@ngrx/store';
import { Note } from 'src/app/main/models/note';

export enum NoteActionTypes {
    Add = '[Note Component] Add',
    Select = '[Note Component] Select',
    Remove = '[Note Component] Remove',
    Fetch = '[Note Component] Fetch',
    Save = '[Note Component] Save',
    Delete = '[Note Component] Delete',
    Search =  '[Note Component] Search'
}

export class NoteAction implements Action {
    readonly type;
    payload: any;
}

export class NoteAdd implements NoteAction {
    readonly type = NoteActionTypes.Add;

    constructor(public payload: Note) {
    }
}

export class NoteRemove implements NoteAction {
    readonly type = NoteActionTypes.Remove;

    constructor(public payload: any) {
    }
}

export class NoteFetch implements NoteAction {
    readonly type = NoteActionTypes.Fetch;

    constructor(public payload: any) {
    }
}

export class NoteSelect implements NoteAction {
    readonly type = NoteActionTypes.Select;

    constructor(public payload: any) {
    }
}

export class NoteSave implements NoteAction {
    readonly type = NoteActionTypes.Save;

    constructor(public payload: any) {
    }
}

export class NoteDelete implements NoteAction {
    readonly type = NoteActionTypes.Delete;

    constructor(public payload: any) {
    }
}

export class NoteSearch implements NoteAction {
    readonly type = NoteActionTypes.Search;

    constructor(public payload: any) {
    }
}