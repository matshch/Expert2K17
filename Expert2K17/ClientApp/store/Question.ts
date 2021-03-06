﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Question, QuestionType } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'


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
interface ChangeParameterAction {
    type: 'CHANGE_PARAMETER';
    parameterGuid: string;
    questionGuid: string;
    typer: QuestionType;
}

interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

interface LinkQuestionAction {
    type: 'LINK_QUESTION';
    questionGuid: string;
    guid: string;
}

interface DeleteQuestionAction {
    type: 'DELETE_QUESTION',
    questionGuid: string
}

interface DeleteAdditionalConditionsAction {
    type: 'DELETE_QUESTIONCONDITION',
    conditionGuid: string
}

interface DeleteAnswerAction {
    type: 'DELETE_ANSWER',
    index: number,
    questionGuid: string
}

interface DeletePairAction {
    type: 'DELETE_PARPAIR',
    guid: string
    parGuid: string
}
interface SortUpAction {
    type: 'SORT_UP',
    index: number
}
interface SortDownAction {
    type: 'SORT_DOWN',
    index: number
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = SyncQuestionAction | AddQuestionAction | AddAnswerAction | SyncAnswerAction |
    ChangeParameterAction | LoadSystemAction | LinkQuestionAction | DeleteQuestionAction | DeleteAnswerAction | DeletePairAction |
    SortUpAction | SortDownAction;
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
    syncAnswer: (index: number, questionGuid: string, valueGuid: string, answer: string): AppThunkAction<KnownAction | AddPairAction> => (dispatch, getState) => {
        let state = getState().combinedSystem;
            let dispatcher = {
                answer: answer,
                questionGuid: questionGuid,
                guid: valueGuid,
                index: index
            }
            dispatch({
                ...dispatcher,
                type: 'SYNC_ANSWER'
            });

    }, syncNewAnswer: (index: number, questionGuid: string, answer: string, value: string): AppThunkAction<KnownAction | AddPairAction> => (dispatch, getState) => {
        let state = getState().combinedSystem;  
        let question = getState().combinedSystem.questions.find((e) => {
            if (e.guid == questionGuid) {
                return true;
            }
        })
        let guid = Guid.MakeNew();
        dispatch({
            type: 'ADD_PARPAIR',
            guid: guid,
            value: value,
            parameterGuid: question.parameter_guid
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
    },
    addAnswer: (valueGuid: string, answer: string, questionGuid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_ANSWER',
            questionGuid: questionGuid,
            guid: valueGuid,
            answer: answer
        });
    },
    addParpair: (value: string, parameterGuid: string): AppThunkAction<KnownAction | AddPairAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_PARPAIR',
            parameterGuid: parameterGuid,
            guid: Guid.MakeNew(),
            value: value
        });
    },
    changeParameter: (questionGuid: string, parameterGuid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        var param = getState().combinedSystem.parameters.find((e) => {
            if (parameterGuid == e.guid) {
                return true
            }
        })
        var typer = param.unitValue ? QuestionType.Value : QuestionType.Variety
        dispatch({
            type: 'CHANGE_PARAMETER',
            parameterGuid: parameterGuid,
            questionGuid: questionGuid,
            typer: typer
        });
    },
    deleteQuestion: (questionGuid: string): AppThunkAction<KnownAction | DeleteAdditionalConditionsAction> => (dispatch, getState) => {
        let current_state = getState();
        let conditionGuid = current_state.combinedSystem.questions.find((e)=>{
            if(e.guid == questionGuid){
                return true;
            }
            return false;
        }).cast_if

        if(conditionGuid.length > 0){
            dispatch({
                type: 'DELETE_QUESTIONCONDITION',
                conditionGuid: conditionGuid
            })
        }
        dispatch({
            type: 'DELETE_QUESTION',
            questionGuid: questionGuid
        });
    },
    deleteAnswer: (questionGuid: string ,index: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'DELETE_ANSWER', index: index, questionGuid: questionGuid });
    },
    sortQuestionUp: (index: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SORT_UP', index: index});
    },
    sortQuestionDown: (index: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SORT_DOWN', index: index });
    }

};




export const unloadedState: Question[] = [];

export const reducer: Reducer<Question[], KnownAction> = (state, action) => {
    switch (action.type) {
        case "ADD_QUESTION":
            return [...state, { ...action.question }];
        case "LOAD_SYSTEM":
            return action.system.questions;
        case "ADD_ANSWER":
            return state.map((e) => {
                if (e.guid == action.questionGuid) {
                    return {
                        ...e,
                        answers: [...e.answers, { answer: action.answer, value: action.guid }]
                    }
                }
                return e;

            });
        case "SYNC_ANSWER":
            return state.map((e) => {
                if (e.guid == action.questionGuid) {
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
        case "DELETE_QUESTION":
            return state.filter((e) => {
                if (e.guid == action.questionGuid) {
                    return false
                }
                return true
            });
        case "LINK_QUESTION":
            return state.map((e) => {
                if (e.guid == action.questionGuid) {
                    return {
                        ...e,
                        cast_if: action.guid
                    }
                }
                return e;
            });
        case "SORT_UP":
            let new_stateUp = [...state];                       
            new_stateUp[action.index - 1] = state[action.index];
            new_stateUp[action.index] = state[action.index - 1];
            return new_stateUp;
        case "SORT_DOWN":
            let new_state = [...state];
            new_state[action.index + 1] = state[action.index];
            new_state[action.index] = state[action.index + 1];
            return new_state;
        case "CHANGE_PARAMETER":
            return state.map((e) => {
                if (e.guid == action.questionGuid) {
                    return {
                        ...e,
                        parameter_guid: action.parameterGuid,
                        answers: e.answers.map((e) => {
                            return {
                                answer: e.answer,
                                value: ''
                            }
                        }),
                        type: action.typer
                    }
                }
                return e
            })
        case "DELETE_ANSWER":
            return state.map((e) => {
                if (e.guid == action.questionGuid) {
                    let answers = e.answers.filter((e, ind)=>{
                        if(ind == action.index){
                            return false;
                        }
                        return true;
                    })
                    return {
                        ...e,
                        answers: answers
                    }
                }
                return e;
            });
        case "DELETE_PARPAIR":
            return state.map((e) => {
                if (e.parameter_guid == action.parGuid) {
                    let answers = e.answers.map((e, ind)=>{
                        if(e.value == action.guid){
                            return {
                                ...e,
                                value: ''
                            };
                        }
                        return e;
                    })
                    return {
                        ...e,
                        answers: answers
                    }
                }
                return e;
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};