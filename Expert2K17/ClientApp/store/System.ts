import { KSystem, System, KCondition, Condition } from './TestInterfaces'
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
    system: System;
}
interface AddSystemAction {
    type: 'ADD_SUBJECT';
    system: System;
}
interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: System;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncSystemAction | AddSystemAction | LoadSystemAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addSystem: (sys: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch("/api/system/create", {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: sys
        }).then(response => response.json() as Promise<any>).then(data => {
            if (data.succeded) {
                let new_data = JSON.parse(data.json);
                dispatch({ type: 'ADD_SUBJECT', system: new_data });       
            }
        });
        addTask(fetchTask);      
    },
    syncSystem: (sys: System): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: "SYNC_SUBJECT", system: sys });
    },
    saveSystem: (attr: System): AppThunkAction<KnownAction> => (dispatch, getState) => {

    },
    loadGuidSystem: (guid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch("/api/system/get/" + guid, {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET"
        }).then(response => response.json() as Promise<any>).then(data => {
            if (data.succeded) {
                let new_data = JSON.parse(data.json);
                dispatch({ type: 'LOAD_SYSTEM', system: data.json });
            }
        });
        addTask(fetchTask);   
    }

};




export const unloadedState: System = {
    name: '',
    user: '',
    picture: '',
    about: '',
    pub: false,
    guid: '',
};

export const reducer: Reducer<System> = (state: System, action: KnownAction) => {
    switch (action.type) {
        case "ADD_SUBJECT":
            return {
                ...action.system               
            };
        case "SYNC_SUBJECT":
            return {
                ...action.system
            };
        case "LOAD_SYSTEM":
            return {
                ...action.system
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};