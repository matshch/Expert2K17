// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Logic} from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'


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

interface LinkResultAction {
    type: 'LINK_RESULT';
    logicGuid: string;
    guid: string;
}
interface LinkLogicAction {
    type: 'LINK_LOGIC';
    logicGuid: string;
    guid: string;
}

interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

interface DeleteLogicAction {
    type: 'DELETE_LOGIC';
    guid: string;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncLogicAction | AddLogicAction | LinkResultAction | LinkLogicAction | LoadSystemAction | DeleteLogicAction;

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
    },
    deleteLogic: (guid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'DELETE_LOGIC', guid: guid });
    }
};




export const unloadedState: Logic[] = [];

export const reducer: Reducer<Logic[]> = (state: Logic[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_LOGIC":
            return [...state, action.logic];
        case "LOAD_SYSTEM":
            return action.system.logics;
        case "SYNC_LOGIC":
            return state.map((e) => {
                if (e.guid == action.logic.guid) {
                    return action.logic
                }
                return e
            })
        case "LINK_RESULT":
            return state.map((e) => {
                if (e.guid == action.logicGuid) {
                    return {
                        ...e,
                        then: action.guid
                    }
                }
                return e
            })
        case "DELETE_LOGIC":
            return state.filter((e) => {
                if (e.guid == action.guid) {
                    return false;
                }
                return true;
            })
        case "LINK_LOGIC":
            return state.map((e) => {
                if (e.guid == action.logicGuid) {
                    return {
                        ...e,
                        conditions: [...e.conditions, action.guid]
                    }
                }
                return e
            })
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};