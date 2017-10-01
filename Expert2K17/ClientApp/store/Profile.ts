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

interface SetProfileCover {
    type: 'SET_PROFILE_COVER';
    data: ProfileObject[]
}

interface SetProfileUserpic {
    type: 'SET_PROFILE_USERPIC';
    data: ProfileObject[]
}

type KnownActions = UselessProfileAction | GetProfileResponse | SetProfileCover | SetProfileUserpic;

export const actionCreators = {
    GetTestsList: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        // let fetchTask = fetch("/api/system/get", {credentials: 'same-origin'}).then(response => response.json() as Promise<any>).then(data => {
        //     dispatch({ type: 'GET_PROFILE_RESPONSE', data: data });
        // });
        // addTask(fetchTask);
        dispatch({ type: 'USELESS_PROFILE_ACTION' });
        dispatch({ type: 'GET_PROFILE_RESPONSE', data: [] });
    },
    SetCover: (picture: FormData): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/profile/setCover", { credentials: 'same-origin', body: picture }).then(response => response.json() as Promise<any>).then(data => {
            dispatch({ type: 'SET_PROFILE_COVER', data: data["picture"] });
        });
        addTask(fetchTask);
    },
    SetUserpic: (picture: FormData): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/profile/setUserpic", { credentials: 'same-origin', body: picture }).then(response => response.json() as Promise<any>).then(data => {
            dispatch({ type: 'SET_PROFILE_COVER', data: data["picture"] });
        });
        addTask(fetchTask);
    }
};

export const reducer: Reducer<ProfileState> = (state: ProfileState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_PROFILE_RESPONSE':
            return { ResponseObject: action.data, loading: false };
        case 'SET_PROFILE_COVER':
            return { ResponseObject: { ...state.ResponseObject, user: { ...state.ResponseObject.user, cover: action.data } }, loading: false };
        case 'SET_PROFILE_USERPIC':
            return { ResponseObject: { ...state.ResponseObject, user: { ...state.ResponseObject.user, userpic: action.data } }, loading: false };
        case 'USELESS_PROFILE_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { ResponseObject: [], loading: false };
};