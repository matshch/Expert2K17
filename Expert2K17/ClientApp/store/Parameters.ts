import { KParameter, Parameter} from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncConditionAction {
    type: 'SYNC_ATTRIBUTE';
    parameters: Parameter;
}
interface AddConditionAction {
    type: 'ADD_ATTRIBUTE';
    parameters: Parameter;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncConditionAction | AddConditionAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addCondition: (attr: Parameter): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_ATTRIBUTE', parameters: attr });
    },
    syncCondition: (attr: Parameter): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_ATTRIBUTE', parameters: attr });
    },
};




export const unloadedState: Parameter[] =
    []
    ;

export const reducer: Reducer<Parameter[]> = (state: Parameter[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_ATTRIBUTE":
            return {
                ...state
            };
        case "SYNC_ATTRIBUTE":
            return {
                ...state
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};