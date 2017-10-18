// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Logic} from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncLogicAction {
    type: 'SYNC_LOGIC';
    logic: Logic;

}
interface AddLogicAction {
    type: 'ADD_LOGIC';
    logic: Logic;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncLogicAction | AddLogicAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addLogic: (logic: Logic): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let log = {
            ...logic,
            guid: Guid.MakeNew()
        }
        dispatch({ type: 'ADD_LOGIC', logic: log });
    },
    syncLogic: (logic: Logic): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_LOGIC', logic: logic });
    }
};




export const unloadedState: Logic[] = [];

export const reducer: Reducer<Logic[]> = (state: Logic[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_LOGIC":
            return [...state, action.logic];
        case "SYNC_LOGIC":
            return state.map((e) => {
                if (e.guid == action.logic.guid) {
                    return action.logic
                }
                return e
            })
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};