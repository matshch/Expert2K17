import { fetch, addTask } from '../custom/fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

interface TestObject {
    id: string;
    name: string;
    description: string;
    picture: string;
}

export interface ProfileState {
    TestsList: TestObject[];
    loading: boolean;
}

interface UselessProfileAction {
    type: 'USELESS_PROFILE_ACTION';
}

interface GetProfileResponse {
    type: 'GET_GET_TESTS_LIST';
    data: TestObject[]
}

type KnownActions = UselessProfileAction | GetProfileResponse;

export const actionCreators = {
    GetTestsList: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/system/get", {credentials: 'same-origin'})
            .then(response => response.json() as Promise<TestObject[]>).then(data => {
                dispatch({ type: 'GET_GET_TESTS_LIST', data: data });
            });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_PROFILE_ACTION' });
    }
};

export const reducer: Reducer<ProfileState> = (state: ProfileState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_GET_TESTS_LIST':
            return { TestsList: action.data, loading: false };
        case 'USELESS_PROFILE_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { TestsList: [], loading: false };
};