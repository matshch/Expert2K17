import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface LoginState {
    ResponseObject: any[];
    loading: boolean;
}

export interface LoginObject {
    username: string,
    password: string,
    rememberMe: boolean
}

interface UselessAction {
    type: 'USELESS_ACTION';
}

interface GetLoginResponse {
    type: 'GET_LOGIN_RESPONSE';
    data: LoginObject[]
}

type KnownActions = UselessAction | GetLoginResponse;

export const actionCreators = {
    LogIn: (inputObject: LoginObject): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/login", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(inputObject)
        }).then(response => response.json() as Promise<any>).then(data => {
            dispatch({ type: 'GET_LOGIN_RESPONSE', data: data });
        });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_ACTION' });
    }
};

export const reducer: Reducer<LoginState> = (state: LoginState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_LOGIN_RESPONSE':
            return { ResponseObject: action.data, loading: false };
        case 'USELESS_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { ResponseObject: [], loading: false };
};
