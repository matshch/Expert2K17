﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Pair } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncSystemAction {
    type: 'SYNC_SUBJECT';
    system: FormData;
}
interface AddSystemAction {
    type: 'ADD_SUBJECT';
    system: FormData;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncSystemAction | AddSystemAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addSystem: (sys: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_SUBJECT', system: sys });
    },
    syncSystem: (sys: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SUBJECT', system: sys });
    },
    addAttribute: (attr: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {

    }
};




export const unloadedState: Pair[] = [];

export const reducer: Reducer<Pair[]> = (state: Pair[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_SUBJECT":
            return {
                ...state
            };
        case "SYNC_SUBJECT":
            return {
                ...state
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};