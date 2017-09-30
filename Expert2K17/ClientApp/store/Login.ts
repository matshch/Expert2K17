import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface LoginState {
    SomeUselessObject: LoginObject[];
    loading: boolean;
}

export interface LoginObject {
    UserName: string,
    Password: string,
    Surname: string,
    Name: string,
    Patronymic: string,
    Group: string,
    Year: string;
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
    Register: (inputObject): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/login", {
            method: "PUT",
            body: JSON.stringify(inputObject)
        }).then(response => response.json() as Promise<LoginObject[]>).then(data => {
            dispatch({ type: 'GET_LOGIN_RESPONSE', data: data });
        });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_ACTION' });
    }
};

export const reducer: Reducer<CardsState> = (state: CardsState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_LOGIN_RESPONSE':
            return { SomeUselessObject: action.data, loading: false };
        case 'USELESS_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { SomeUselessObject: [], loading: false };
};
