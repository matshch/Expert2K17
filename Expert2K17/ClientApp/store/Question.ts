// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Question } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncQuestionAction {
    type: 'SYNC_QUESTION';
    question: Question;
}
interface AddQuestionAction {
    type: 'ADD_QUESTION';
    question: Question;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncQuestionAction | AddQuestionAction;
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addQuestion: (question_: Question): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_QUESTION', question: {
                ...question_,
                guid: Guid.MakeNew(),
                system_guid: getState().combinedSystem.system.guid
            }
        });

    },
    syncQuestion: (question_: Question): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_QUESTION', question: question_ });
    }
};




export const unloadedState: Question[] = [];

export const reducer: Reducer<Question[]> = (state: Question[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_QUESTION":
            return [...state, action.question];
        case "SYNC_QUESTION":
            return state.map((e) => {
                if (e.guid == action.question.guid) {
                    return action.question
                }
                return e
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};