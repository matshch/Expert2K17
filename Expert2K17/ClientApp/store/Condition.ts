// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Condition, Operation, ComponentCondition, ParameterPair } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
/*
enum Operation {
    Equal,
    NotEqual,
    Greater,
    Less,
    Add,
    Substract,
    Set
}

enum ComponentCondition {
    Question,
    Logic
}

export interface Condition_ {
    left: string; // guid par/attr
    right: string; // value
    act: Operation;
    parameter: boolean; // 1 - par -> 0 - attr
    guid: string;
    origin: ComponentCondition;
}
*/
// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface AddConditionAction {
    type: 'ADD_CONDITION';
    condition: Condition

}
interface SyncConditionAction {
    type: 'SYNC_CONDITION';
    condition: Condition;
}

interface AddPairAction {
    type: 'ADD_PARPAIR';
    parameterGuid: string;
    value: string;
    guid: string;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AddConditionAction | SyncConditionAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.



export const actionCreators = {
    addCondition: (condition: Condition): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let condition_ = {
            ...condition,
            guid: Guid.MakeNew()
        }
        dispatch({ type: 'ADD_CONDITION', condition: condition_ });
    },
    syncCondition: (condition: Condition): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_CONDITION', condition: condition });
    },
    syncWithAddCondition: (condition: Condition, label: string): AppThunkAction<KnownAction | AddPairAction> => (dispatch, getState) => {
        let guid = Guid.MakeNew();
        let newPair: ParameterPair = {
            guid: guid,
            parameterGuid: condition.left,
            value: label
        }
        dispatch({
            type: 'ADD_PARPAIR',
            parameterGuid: newPair.parameterGuid,
            guid: newPair.guid,
            value: newPair.value
        });
        dispatch({ type: 'SYNC_CONDITION', condition: condition });
    },
};



export const unloadedState: Condition[] = [];

export const reducer: Reducer<Condition[]> = (state: Condition[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_CONDITION":
            return [...state, { ...action.condition }];
        case "SYNC_CONDITION":
            return state.map((e) => {
                if (e.guid == action.condition.guid) {
                    return { ...action.condition }
                }
                return e
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};