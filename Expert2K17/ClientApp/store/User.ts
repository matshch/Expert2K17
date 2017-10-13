import { fetch, addTask } from '../custom/fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

interface UserObject {
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

interface ImageResponse {
    succeded: boolean;
    error: string;
    picture: string;
}

export interface UserState {
    user: UserObject | undefined | null;
    imageUploadSucceeded: boolean;
    imageUploadError: string;
    userLoading: boolean;
}

interface UselessUserAction {
    type: 'USELESS_USER_ACTION';
}

export interface SetUser {
    type: 'SET_USER';
    data: UserObject;
}

export interface SetProfileCover {
    type: 'SET_PROFILE_COVER';
    data: ImageResponse
}

export interface SetProfileUserpic {
    type: 'SET_PROFILE_USERPIC';
    data: ImageResponse
}

type KnownActions = UselessUserAction | SetUser | SetProfileCover | SetProfileUserpic;

export const actionCreators = {
    GetUser: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/login`, { credentials: 'same-origin' })
            .then(response => response.json() as Promise<{ user: UserObject }>)
            .then(data => {
                dispatch({ type: 'SET_USER', data: data.user });
            });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_USER_ACTION' });
    },
    SetCover: (picture: FormData): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/profile/setCover", { credentials: 'same-origin', method: "POST", body: picture })
            .then(response => response.json() as Promise<ImageResponse>).then(data => {
                dispatch({ type: 'SET_PROFILE_COVER', data: data });
            });
    },
    SetUserpic: (picture: FormData): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/profile/setUserpic", { credentials: 'same-origin', method: "POST", body: picture })
            .then(response => response.json() as Promise<ImageResponse>).then(data => {
                dispatch({ type: 'SET_PROFILE_USERPIC', data: data });
            });
    }
};

export const reducer: Reducer<UserState> = (state: UserState, action: KnownActions) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.data, userLoading: false };
        case 'SET_PROFILE_COVER':
            return {
                ...state, user: { ...state.user, cover: action.data.picture },
                imageUploadSucceeded: action.data.succeded, imageUploadError: action.data.error
            };
        case 'SET_PROFILE_USERPIC':
            return {
                ...state, user: { ...state.user, userpic: action.data.picture },
                imageUploadSucceeded: action.data.succeded, imageUploadError: action.data.error
            };
        case 'USELESS_USER_ACTION':
            return { ...state, userLoading: true };
        default:
            const exhaustiveCheck: never = action;
    }
    return state || {
        userLoading: false, user: undefined, imageUploadSucceeded: true, imageUploadError: ""
    };
};
