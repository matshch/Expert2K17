// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { ParameterPair } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface AddPairAction {
    type: 'ADD_PARPAIR';
    parameterGuid: string;
    value: string;
    guid: string;
}
interface UnPairAction {
    type: 'UN_PARPAIR';
    guid: string;
}

interface SetPairAction {
    type: 'SYNC_PARPAIR';
    parameterGuid: string;
    value: string;
    guid: string;
}

interface SyncPairAction {
    type: 'SYNC_THATPAIR';
    index: number;
    value: string;
}

interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

interface DeleteParameterAction {
    type: 'DELETE_PARAMETER';
    parameterGuid: string;
}
interface DeletePairAction {
    type: 'DELETE_PARPAIR',
    guid: string
    parGuid: string
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AddPairAction | UnPairAction | SetPairAction | LoadSystemAction | DeleteParameterAction | SyncPairAction | DeletePairAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.


export const actionCreators = {
    syncPair: (ind: number, value: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: 'SYNC_THATPAIR', index: ind, value: value});
        
    },
    deletePair: (guid: string, parGuid:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: 'DELETE_PARPAIR', guid: guid, parGuid: parGuid});
        
    }
};


export const unloadedState: ParameterPair[] = [];

export const reducer: Reducer<ParameterPair[]> = (state: ParameterPair[], action: KnownAction) => {
    switch (action.type) {
        case "UN_PARPAIR":
            return state.filter((e, ind) => {
                if (e.guid== action.guid) {
                    return false;
                } else {
                    return true
                }

            });
        case "ADD_PARPAIR":
            return [...state, { parameterGuid: action.parameterGuid, guid: action.guid, value: action.value }];
        case "LOAD_SYSTEM":
            return action.system.parpairs;
        case "DELETE_PARAMETER":
            return state.filter((e)=>{
                if(e.parameterGuid == action.parameterGuid){
                    return false;
                }
                return true;
            });
        case "DELETE_PARPAIR":
            return state.filter((e)=>{
                if(e.guid == action.guid){
                    return false;
                }
                return true;
            });
        case "SYNC_PARPAIR":
            return state.map((e) => {
                if (e.guid == action.guid) {
                    return { ...e, value: action.value }
                }
                return e
            });
        case "SYNC_THATPAIR":
            return state.map((e, index) => {
                if (index == action.index) {
                    return { ...e, value: action.value }
                }
                return e
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};