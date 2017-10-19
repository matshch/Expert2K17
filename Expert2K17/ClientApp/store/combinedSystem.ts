import {combineReducers} from 'redux';
import * as SystemI from './TestInterfaces'
import { fetch, addTask } from '../custom/fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import * as SystemS from './System';
import * as AttributeS from './Attribute';
import * as SubjectS from './Subject';
import * as PairS from './Pair';
import * as ParameterS from './Parameters'
import * as ParPairsS from './ParameterPair'
import * as QuestionS from './Question'
import * as ConditionS from './Condition'
import * as LogicS from './Logic'





export interface SystemCreateState {
    system: SystemI.System;
    attributes: SystemI.Attribute[];
    subjects: SystemI.Subject[];
    pairs: SystemI.Pair[];
    parameters: SystemI.Parameter[];
    parpairs: SystemI.ParameterPair[];
    questions: SystemI.Question[];
    conditions: SystemI.Condition[];
    logics: SystemI.Logic[];
}

export const reducers = {
    system: SystemS.reducer,
    attributes: AttributeS.reducer,
    subjects: SubjectS.reducer,
    pairs: PairS.reducer,
    parameters: ParameterS.reducer,
    parpairs: ParPairsS.reducer,
    questions: QuestionS.reducer,
    conditions: ConditionS.reducer,
    logics: LogicS.reducer
};

interface LoadPreviousAction {
    type: 'LOAD_SYSTEM_PREVIOUS';
}
interface AddSystemAction {
    type: 'SYNC_SUBJECT1';
}
interface ClearSystemAction {
    type: 'CLEAR_STORE';
}

export const actionCreators = {
    loadPreviousSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOAD_SYSTEM_PREVIOUS'});
    },
    syncSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SUBJECT1' });
    },
    addAttribute: (attr: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {

    }
};


let defaultReducer = combineReducers<SystemCreateState>(reducers);

type KnownAction = LoadPreviousAction | AddSystemAction | ClearSystemAction;

function CollectState(state: SystemCreateState) {
    return JSON.stringify(state);
}

export const reducer: Reducer<SystemCreateState> = (state: SystemCreateState, action: KnownAction) => {
    switch (action.type) {
        case "CLEAR_STORE":
            let kek;
            return defaultReducer(kek, action);
        default:
            let new_state = defaultReducer(state, action);
            if (new_state.system.guid != '') {
                let fetchTask = fetch("/api/system/autosave", {
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: CollectState(new_state)
                }).then(response => response.json() as Promise<any>).then(data => {
                    
                });
                addTask(fetchTask);   
            }
            return defaultReducer(state, action);
    }
};