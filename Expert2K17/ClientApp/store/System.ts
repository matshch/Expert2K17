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
    type: 'SYNC_SYSTEM';
    system: System;
}

interface SyncCondition {
    type: 'SYNC_CONDITION';
    system: Condition;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncSystemAction | SyncCondition;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addSystem: (sys: System): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SYSTEM', system: sys});       
    }
};


export const unloadedState: KSystem = { };

export const reducer: Reducer<KSystem> = (state: KSystem, action: KnownAction) => {
    switch (action.type) {
        case "SYNC_SYSTEM":
            return {
                ...state,
                [Guid.MakeNew().ToString()]: action.system
            };
        case "SYNC_CONDITION":
            return {};
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};