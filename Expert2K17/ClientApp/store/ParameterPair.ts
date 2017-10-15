// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { ParameterPair } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';


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
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AddPairAction | UnPairAction | SetPairAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.





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
        case "SYNC_PARPAIR":
            return state.map((e) => {
                if (e.guid == action.guid) {
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