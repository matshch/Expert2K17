import { KAttributes, Attribute } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncConditionAction {
    type: 'SYNC_ATTRIBUTE';
    attribute: Attribute;
    guid: string;
}
interface AddConditionAction {
    type: 'ADD_ATTRIBUTE';
    attribute: Attribute;
}

interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

interface DeleteAttributeAction {
    type: 'DELETE_ATTRIBUTE';
    attribute: Attribute;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncConditionAction | AddConditionAction | DeleteAttributeAction | LoadSystemAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addAttribute: (attr: Attribute): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let new_attr: Attribute = {
            ...attr,
            guid: Guid.MakeNew()
        }
        dispatch({ type: 'ADD_ATTRIBUTE', attribute: new_attr });
    },
    syncAttribute: (attr: Attribute, guid_: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_ATTRIBUTE', attribute: attr, guid: guid_ });
    },
    deleteAttribute: (attr: Attribute): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'DELETE_ATTRIBUTE', attribute: attr});
    }
};




export const unloadedState: Attribute[] = 
    []
;

export const reducer: Reducer<Attribute[]> = (state: Attribute[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_ATTRIBUTE":
            return [...state, action.attribute];
        case "DELETE_ATTRIBUTE":
            return state.filter((e) => {
                if (e.guid == action.attribute.guid) {
                    return false;
                }
                return true;
            });
        case "SYNC_ATTRIBUTE":
            return state.map((e, index) => {
                if (e.guid == action.guid) {
                    return { ...action.attribute };
                }
                return e
            });
        case "LOAD_SYSTEM":
            return action.system.attributes;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};