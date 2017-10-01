import {combineReducers} from 'redux';
import * as SystemI from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import * as SystemS from './System';
import * as AttributeS from './System';
import * as SubjectS from './Subject';
import * as PairS from './Pair';
import * as ParameterS from './Parameters'


export interface SystemCreateState {
    system: SystemI.System;
    attributes: SystemI.Attribute[];
    subjects: SystemI.Subject[];
    pairs: SystemI.Pair[];
    parameters: SystemI.Parameter[];
}

export const reducers = {
    system: SystemS.reducer,
    attributes: AttributeS.reducer,
    subjects: SubjectS.reducer,
    pairs: PairS.reducer,
    parameters: ParameterS.reducer
};

interface LoadPreviousAction {
    type: 'LOAD_SYSTEM_PREVIOUS';
}
interface AddSystemAction {
    type: 'SYNC_SUBJECT';
}

export const actionCreators = {
    loadPreviousSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOAD_SYSTEM_PREVIOUS'});
    },
    syncSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SUBJECT' });
    },
    addAttribute: (attr: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {

    }
};


let defaultReducer = combineReducers<SystemCreateState>(reducers);

type KnownAction = LoadPreviousAction | AddSystemAction;

function CollectState(state: SystemCreateState) {
    return JSON.stringify(state);
}

export const reducer: Reducer<SystemCreateState> = (state: SystemCreateState, action: KnownAction) => {
    switch (action.type) {
        default:
            if (state.system.guid == '') {
                let fetchTask = fetch("/api/system/autosave", {
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: CollectState(state)
                }).then(response => response.json() as Promise<any>).then(data => {
                    
                });
                addTask(fetchTask);   
            }
            return defaultReducer(state, action);
    }
};