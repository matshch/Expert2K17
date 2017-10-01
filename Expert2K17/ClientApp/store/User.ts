import { fetch, addTask } from '../custom/fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

interface UserObject {
    id: string,
    userName: string,
    surname: string,
    name: string,
    patronymic: string,
    group: string,
    year: string,
    isAdmin: boolean,
    userpic: string,
    cover: string
}

export interface UserState {
    user: UserObject | undefined | null,
    userLoading: boolean
}

interface UselessUserAction {
    type: 'USELESS_USER_ACTION';
}

export interface SetUser {
    type: 'SET_USER';
    data: UserObject;
}

type KnownActions = UselessUserAction | SetUser;

export const actionCreators = {
    GetUser: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
            let fetchTask = fetch(`/api/login`, {credentials: 'same-origin'})
                .then(response => response.json() as Promise<{user:UserObject}>)
                .then(data => {
                    dispatch({type: 'SET_USER', data: data.user});
                });
            addTask(fetchTask);
            dispatch({ type: 'USELESS_USER_ACTION'});
        }
};

export const reducer: Reducer<UserState> = (state: UserState, action: KnownActions) => {
    switch (action.type) {
        case 'SET_USER':
            return { user: action.data, userLoading: false };
        case 'USELESS_USER_ACTION':
            return { ...state, userLoading: true };
        default:
            const exhaustiveCheck: never = action;
    }
    return state || { userLoading: false, user: undefined };
};
