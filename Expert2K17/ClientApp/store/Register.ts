import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { SetUser } from './User';
import { AppThunkAction } from './';

export interface RegisterState {
    ResponseObject: any;
    GroupsYearsObject: GroupsYearsObject[];
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

export interface GroupsYearsObject {
    year: string,
    groups: string[]
}

interface UselessRegisterAction {
    type: 'USELESS_REGISTER_ACTION';
}

interface GetRegisterResponse {
    type: 'GET_REGISTER_RESPONSE';
    data: RegisterObject[]
}

interface GetGroupsYearsResponse {
    type: 'GET_GROUPSYEARS_RESPONSE';
    data: GroupsYearsObject[]
}

type KnownActions = UselessRegisterAction | GetRegisterResponse | GetGroupsYearsResponse | SetUser;

export const actionCreators = {
    Register: (inputObject: RegisterObject): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/login", {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(inputObject)
        }).then(response => response.json() as Promise<any>).then(data => {
            dispatch({ type: 'SET_USER', data: data["user"] });
            dispatch({ type: 'GET_REGISTER_RESPONSE', data: data });
        });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_REGISTER_ACTION' });
    },
    GetGroupsYears: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let fetchTask = fetch("/api/groups").then(response => response.json() as Promise<GroupsYearsObject[]>).then(data => {
            dispatch({ type: 'GET_GROUPSYEARS_RESPONSE', data: data });
        });
        addTask(fetchTask);
        dispatch({ type: 'USELESS_REGISTER_ACTION' });
    }
};

type KnownReducerActions = UselessRegisterAction | GetRegisterResponse | GetGroupsYearsResponse;

export const reducer: Reducer<RegisterState> = (state: RegisterState, action: KnownReducerActions) => {
    switch (action.type) {
        case 'GET_REGISTER_RESPONSE':
            return { ...state, ResponseObject: action.data, loading: false };
        case 'GET_GROUPSYEARS_RESPONSE':
            return { ...state, GroupsYearsObject: action.data, loading: false };
        case 'USELESS_REGISTER_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { GroupsYearsObject: [], ResponseObject: [], loading: false };
};
