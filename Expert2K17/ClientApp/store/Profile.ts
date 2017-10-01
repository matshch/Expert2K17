import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface ProfileState {
    ResponseObject: any;
    loading: boolean;
}

export interface ProfileObject {
    testlist: any[];
}

interface UselessProfileAction {
    type: 'USELESS_PROFILE_ACTION';
}

interface GetProfileResponse {
    type: 'GET_PROFILE_RESPONSE';
    data: ProfileObject[]
}

type KnownActions = UselessProfileAction | GetProfileResponse;

export const actionCreators = {
    GetTestsList: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        // let fetchTask = fetch("/api/system/get", {credentials: 'same-origin'}).then(response => response.json() as Promise<any>).then(data => {
        //     dispatch({ type: 'GET_PROFILE_RESPONSE', data: data });
        // });
        // addTask(fetchTask);
        dispatch({ type: 'USELESS_PROFILE_ACTION' });
        dispatch({ type: 'GET_PROFILE_RESPONSE', data: [] });
    }
};

export const reducer: Reducer<ProfileState> = (state: ProfileState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_PROFILE_RESPONSE':
            return { ResponseObject: action.data, loading: false };
        case 'USELESS_PROFILE_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { ResponseObject: [], loading: false };
};