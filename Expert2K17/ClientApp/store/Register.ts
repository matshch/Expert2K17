import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface RegisterState {
    SomeUselessObject: RegisterObject[];
    loading: boolean;
}

export interface RegisterObject {
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

interface GetRegisterResponse {
    type: 'GET_REGISTER_RESPONSE';
    data: RegisterObject[]
}

type KnownActions = UselessAction | GetRegisterResponse;

export const actionCreators = {
    Register: (inputObject): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/register", {
            method: "PUT",
            body: JSON.stringify(inputObject)
        }).then(response => response.json() as Promise<RegisterObject[]>).then(data => {
            dispatch({ type: 'GET_REGISTER_RESPONSE', data: data });
        });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_ACTION' });
    }
};

export const reducer: Reducer<RegisterState> = (state: RegisterState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_REGISTER_RESPONSE':
            return { SomeUselessObject: action.data, loading: false };
        case 'USELESS_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { SomeUselessObject: [], loading: false };
};
