import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { SetUser } from './User'
import { AppThunkAction } from './';

export interface LoginState {
    ResponseObject: LoginResponse;
    loading: boolean;
}

interface User {
    id: string;
    userName: string;
    surname: string;
    name: string;
    patronymic: string;
    group: string;
    year: string;
    isAdmin: boolean;
    userpic: string;
    cover: string;
}

interface LoginResponse {
    user: User;
    succeeded: boolean | null;
    isLockedOut: boolean;
    isNotAllowed: boolean;
    requiresTwoFactor: boolean;
}

export interface LoginObject {
    username: string,
    password: string,
    rememberMe: boolean
}

interface UselessLoginAction {
    type: 'USELESS_LOGIN_ACTION';
}

interface GetLoginResponse {
    type: 'GET_LOGIN_RESPONSE';
    data: LoginResponse;
}

type KnownActions = UselessLoginAction | GetLoginResponse | SetUser;

type ReducerActions = UselessLoginAction | GetLoginResponse;

export const actionCreators = {
    LogIn: (inputObject: LoginObject): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/login", {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(inputObject)
        }).then(response => response.json() as Promise<LoginResponse>).then(data => {
            dispatch({type: 'SET_USER', data: data.user})
            dispatch({ type: 'GET_LOGIN_RESPONSE', data: data });
        });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_LOGIN_ACTION' });
    },
    Logout: (): AppThunkAction<KnownActions> => (dispatch) => {
        let fetchTask = fetch(`/api/login`, { credentials: 'same-origin', method: "DELETE" })
                        .then(() => dispatch({ type: 'SET_USER', data: null }));
    }
};

export const reducer: Reducer<LoginState> = (state: LoginState, action: ReducerActions) => {
    switch (action.type) {
        case 'GET_LOGIN_RESPONSE':
            return { ResponseObject: action.data, loading: false };
        case 'USELESS_LOGIN_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { ResponseObject: null, loading: false };
};
