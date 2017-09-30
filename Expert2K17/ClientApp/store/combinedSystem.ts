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



export interface SystemCreateState {
    system: SystemI.System;
    attributes: SystemI.Attribute[];
    subjects: SystemI.Subject[];
    pairs: SystemI.Pair[];
}

export const reducers = {
    system: SystemS.reducer,
    attributes: AttributeS.reducer,
    subjects: SubjectS.reducer,
    pairs: PairS.reducer
};

interface LoadPreviousAction {
    type: 'LOAD_SYSTEM_PREVIOUS';
}
interface AddSystemAction {
    type: 'SYNC_SYSTEM';
}

export const actionCreators = {
    loadPreviousSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOAD_SYSTEM_PREVIOUS'});
    },
    syncSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SYSTEM'});
    },
    addAttribute: (attr: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {

    }
};


let defaultReducer = combineReducers<SystemCreateState>(reducers);

type KnownAction = LoadPreviousAction | AddSystemAction;

export const reducer: Reducer<SystemCreateState> = (state: SystemCreateState, action: KnownAction) => {
    switch (action.type) {
        default:
            return defaultReducer(state, action);
    }
};