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

interface AddAnswerAction {
    type: 'ADD_ANSWER';
    answer: string;
    questionGuid: string;
    guid: string;
}

interface SyncAnswerAction {
    type: 'SYNC_ANSWER';
    answer: string;
    questionGuid: string;
    guid: string;
    index: number;
}

interface AddPairAction {
    type: 'ADD_PARPAIR';
    parameterGuid: string;
    value: string;
    guid: string;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncQuestionAction | AddQuestionAction | AddAnswerAction | SyncAnswerAction;
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
    },
    syncAnswer: (index: number, questionGuid: string, valueGuid: string, answer: string, value: string): AppThunkAction<KnownAction | AddPairAction> => (dispatch, getState) => {
        let state = getState().combinedSystem;
        let previousValue = state.parpairs.find((e) => {
            if (e.guid == valueGuid) {
                return true
            }
        })
        if (previousValue.value == value) {
            let dispatcher = {
                answer: answer,
                questionGuid: questionGuid,
                guid: previousValue.guid,
                index: index
            }
            dispatch({
                ...dispatcher,
                type: 'SYNC_ANSWER'
            });
        } else {
            let guid = Guid.MakeNew();
            dispatch({
                type: 'ADD_PARPAIR',
                guid: guid,
                value: value,
                parameterGuid: previousValue.parameterGuid
            });
            let dispatcher = {
                answer: answer,
                questionGuid: questionGuid,
                guid: guid,
                index: index
            }
            dispatch({
                ...dispatcher,
                type: 'SYNC_ANSWER'
            });
        }
    },
    addAnswer: (valueGuid: string, answer: string, questionGuid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_ANSWER',
            questionGuid: questionGuid,
            guid: valueGuid,
            answer: answer
        });
    },
    addParpair: (valueGuid: string, value: string, parameterGuid: string): AppThunkAction<KnownAction | AddPairAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_PARPAIR',
            parameterGuid: parameterGuid,
            guid: Guid.MakeNew(),
            value: value
        });
    }

};




export const unloadedState: Question[] = [];

export const reducer: Reducer<Question[]> = (state: Question[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_QUESTION":
            return [...state, action.question];
        case "ADD_ANSWER":
            return state.map((e) => {
                if (e.guid == action.guid) {
                    return {
                        ...e,
                        answers: [...e.answers, { answer: action.answer, value: action.guid }]
                    }
                }
                return e;

            });
        case "SYNC_ANSWER":
            return state.map((e) => {
                if (e.guid == action.guid) {
                    return {
                        ...e,
                        answers: e.answers.map((e, ind) => {
                            if (ind == action.index) {
                                return {
                                    answer: action.answer,
                                    value: action.guid
                                }
                            }
                            return e;

                        })
                    }
                }
                return e;
            });
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