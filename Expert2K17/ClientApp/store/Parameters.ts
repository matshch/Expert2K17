import { KParameter, Parameter} from './TestInterfaces'
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
    type: 'SYNC_PARAMETER';
    parameter: Parameter;
}
interface AddConditioParameternAction {
    type: 'ADD_PARAMETER';
    parameter: Parameter;
}

interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}
interface DeleteParameterAction {
    type: 'DELETE_PARAMETER';
    parameterGuid: string;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = SyncConditionAction | AddConditioParameternAction | LoadSystemAction | DeleteParameterAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addParameter: (parameter: Parameter): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let par = {
            ...parameter,
            guid: Guid.MakeNew()
        }
        dispatch({ type: 'ADD_PARAMETER', parameter: par });
    },
    syncParameter: (parameter: Parameter): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_PARAMETER', parameter: parameter });
    },
    deleteParameter: (parameterGuid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'DELETE_PARAMETER', parameterGuid: parameterGuid});
    }
};




export const unloadedState: Parameter[] =  [];

export const reducer: Reducer<Parameter[], KnownAction> = (state, action) => {
    switch (action.type) {
        case "ADD_PARAMETER":
            return [...state, action.parameter]
        case "LOAD_SYSTEM":
            return action.system.parameters;
        case "DELETE_PARAMETER":
            return state.filter((e)=>{
                if(e.guid == action.parameterGuid){
                    return false;
                }
                return true;
            });
        case "SYNC_PARAMETER":
            return state.map((val) => {
                if (val.guid == action.parameter.guid) {
                    return action.parameter;
                }
                return val;

            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};