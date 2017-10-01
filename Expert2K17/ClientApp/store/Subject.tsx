// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Subject } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncSubjectAction {
    type: 'SYNC_SUBJECT';
    subject: Subject;
}
interface AddSubjectAction {
    type: 'ADD_SUBJECT';
    subject: Subject;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncSubjectAction | AddSubjectAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addSubject: (subject_: Subject): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_SUBJECT', subject: {
                ...subject_,
                guid: Guid.MakeNew().ToString(),
                system_guid: getState().combinedSystem.system.guid
            }
        });

    },
    syncSubject: (subject: Subject): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SUBJECT', subject: subject });
    }
};




export const unloadedState: Subject[] = [];

export const reducer: Reducer<Subject[]> = (state: Subject[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_SUBJECT":
            return [...state, action.subject];
        case "SYNC_SUBJECT":
            return state.map((e) => {
                if (e.guid == action.subject.guid) {
                    return action.subject
                }
                return e
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};