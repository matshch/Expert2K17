// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Pair, Attribute } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncSystemAction {
    type: 'SYNC_PAIRS';
    system: FormData;
}
interface AddSystemAction {
    type: 'ADD_PAIRS';
    system: FormData;
}
interface AddPairAction {
    type: 'ADD_PAIR';
    attrGuid: string;
    value: string;
    guid: string;
    subjectGuid: string;
}
interface UnPairAction {
    type: 'UN_PAIR';
    index: number;
    innerIndex: number;
}

interface DeleteAttributeAction {
    type: 'DELETE_ATTRIBUTE';
    attribute: Attribute;
}
interface DeletePairAction {
    type: 'DELETE_PAIR';
    guid: string;
}

interface ChangePairAction {
    type: 'CHANGE_PAIR';
    guid: string;
    value: string;
}
interface SetPairAction {
    type: 'SET_PAIR';
    attrGuid: string;
    value: string;
    subjectGuid: string;
}
interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncSystemAction | AddSystemAction | AddPairAction | UnPairAction | SetPairAction | DeleteAttributeAction | LoadSystemAction | DeletePairAction | ChangePairAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addSystem: (sys: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_PAIRS', system: sys });
    },
    syncSystem: (sys: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_PAIRS', system: sys });
    }
};




export const unloadedState: Pair[] = [];

export const reducer: Reducer<Pair[]> = (state: Pair[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_PAIRS":
            return {
                ...state
            };
        case "LOAD_SYSTEM":
            return action.system.pairs;
        case "SYNC_PAIRS":
            return {
                ...state
            };
        case "UN_PAIR":
            return state.map((e, ind) => {
                if (ind == action.index) {
                    return {
                        ...e,
                        subjectGuids: e.subjectGuids.filter((ex, inde) => {
                            if (inde == action.innerIndex) {
                                return false;
                            }
                            return true;
                        })
                    }
                } else {
                    return e
                }

            });
        case "ADD_PAIR":
            return [...state, { attributeGuid: action.attrGuid, subjectGuids: [action.subjectGuid], value: action.value, guid: action.guid }];
        case "SET_PAIR":
            return state.map((e) => {
                if (e.attributeGuid == action.attrGuid && e.value == action.value) {
                    return { ...e, subjectGuids: [...e.subjectGuids, action.subjectGuid] }
                } 
                return e
            });
        case "DELETE_PAIR":
            return state.filter((e) => {
                if (e.guid == action.guid) {
                    return false;
                }
                return true;
            })
        case "CHANGE_PAIR":
            return state.map((e) => {
                if (e.guid == action.guid) {
                    return {
                        ...e,
                        value: action.value
                    }
                }
                return e;
            })

        case "DELETE_ATTRIBUTE":
            return state.filter((e) => {
                if (e.attributeGuid == action.attribute.guid) {
                    return false;
                }
                return true;
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};