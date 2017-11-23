// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import { Condition, Operation, ComponentCondition, ParameterPair, Question } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'

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

interface LinkResultAction {
    type: 'LINK_RESULT';
    logicGuid: string;
    guid: string;
}
interface LinkLogicAction {
    type: 'LINK_LOGIC';
    logicGuid: string;
    guid: string;
}
interface LinkQuestionAction {
    type: 'LINK_QUESTION';
    questionGuid: string;
    guid: string;
}

interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

interface DeletePairAction {
    type: 'DELETE_PARPAIR',
    guid: string
    parGuid: string
}

interface DeleteAdditionalConditionsAction {
    type: 'DELETE_QUESTIONCONDITION',
    conditionGuid: string
}

interface SyncQuestionAction {
    type: 'SYNC_QUESTION';
    question: Question;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AddConditionAction | SyncConditionAction | LoadSystemAction | DeletePairAction | DeleteAdditionalConditionsAction;

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.



export const actionCreators = {
    addCondition: (condition: Condition, guid: string): AppThunkAction<KnownAction | LinkResultAction | LinkLogicAction | LinkQuestionAction> => (dispatch, getState) => {
        let condition_ = {
            ...condition,
            guid: Guid.MakeNew()
        }
        dispatch({ type: 'ADD_CONDITION', condition: condition_ });
        if (condition_.origin == ComponentCondition.Logic) {
            dispatch({ type: 'LINK_LOGIC', guid: condition_.guid, logicGuid: guid});
        }
        if (condition_.origin == ComponentCondition.Result) {
            dispatch({ type: 'LINK_RESULT', guid: condition_.guid, logicGuid: guid });
        }
        if (condition_.origin == ComponentCondition.Question) {
            dispatch({ type: 'LINK_QUESTION', guid: condition_.guid, questionGuid: guid });
        }
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
        let condition_: Condition = {
            ...condition,
            right: guid
        }
        dispatch({ type: 'SYNC_CONDITION', condition: condition_ });
    },
    deleteCondition: (guid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'DELETE_QUESTIONCONDITION', conditionGuid: guid });
    },
    deleteQuestionCondition: (guid: string): AppThunkAction<KnownAction | SyncQuestionAction> => (dispatch, getState) => {
       let question = getState().combinedSystem.questions.find(e=>{
           if(e.cast_if == guid){
               return true;
           }
           return false;
       })
       let newQuestion = {
           ...question,
           cast_if: ''
       }
        dispatch({type:'SYNC_QUESTION', question: newQuestion})
        dispatch({ type: 'DELETE_QUESTIONCONDITION', conditionGuid: guid });
    }
};



export const unloadedState: Condition[] = [];

export const reducer: Reducer<Condition[]> = (state: Condition[], action: KnownAction) => {
    switch (action.type) {
        case "DELETE_QUESTIONCONDITION":
            return state.filter((e)=>{
                if(e.guid == action.conditionGuid){
                    return false;
                }
                return true;
            });
        case "ADD_CONDITION":
            return [...state, { ...action.condition }];
        case "SYNC_CONDITION":
            return state.map((e) => {
                if (e.guid == action.condition.guid) {
                    return { ...action.condition }
                }
                return e
            });
        case "LOAD_SYSTEM":
            return action.system.conditions;
        case "DELETE_PARPAIR":
            return state.map((e)=>{
                if(e.right == action.guid){
                    return {
                        ...e,
                        right: ''
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