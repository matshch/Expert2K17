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

type DefaultActions = SystemS.KnownAction |
                      AttributeS.KnownAction |
                      SubjectS.KnownAction |
                      PairS.KnownAction |
                      ParameterS.KnownAction |
                      ParPairsS.KnownAction |
                      QuestionS.KnownAction |
                      ConditionS.KnownAction |
                      LogicS.KnownAction;

let defaultReducer = combineReducers<SystemCreateState>(reducers as any);

type KnownActions = SystemS.ClearSystemAction;

function CollectState(state: SystemCreateState) {
    return JSON.stringify(state);
}

export const reducer: Reducer<SystemCreateState, KnownActions | DefaultActions> = (state, action) => {
    switch (action.type) {
        case "CLEAR_STORE":
            return defaultReducer(undefined, action);
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