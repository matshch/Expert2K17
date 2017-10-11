import { fetch, addTask } from "../custom/fetch";
import { Reducer } from "redux";
import { AppThunkAction } from "./";

interface UserObject {
    id: string;
    userName: string;
    surname: string;
    name: string;
    patronymic: string;
    group: string;
    year: string;
    userpic: string;
    cover: string;
}

interface User {
    id: string,
    username: string;
    surname: string,
    name: string,
    patronymic: string;
}

interface TestObject {
    id: string,
    name: string,
    description: string,
    picture: string,
    user: User;
}

export interface PanelState {
    UsersList: UserObject[];
    TestsList: TestObject[];
    loading: boolean;
}

interface UselessPanelAction {
    type: "USELESS_PANEL_ACTION";
}

interface GetUsersResponse {
    type: "GET_ADMIN_USERS_LIST";
    data: UserObject[];
}

interface GetTestsResponse {
    type: "GET_ADMIN_TESTS_LIST";
    data: TestObject[];
}

type KnownActions = UselessPanelAction | GetUsersResponse | GetTestsResponse;

export const actionCreators = {
    GetUsersList: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        const fetchTask = fetch("/api/admin/getUsers", { credentials: "same-origin" })
            .then(response => response.json() as Promise<UserObject[]>).then(data => {
                dispatch({ type: "GET_ADMIN_USERS_LIST", data: data });
            });
        addTask(fetchTask);
        dispatch({ type: "USELESS_PANEL_ACTION" });
    },
    GetAdminTestsList: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        const fetchTask = fetch("/api/admin/getTests", { credentials: "same-origin" })
            .then(response => response.json() as Promise<TestObject[]>).then(data => {
                dispatch({ type: "GET_ADMIN_TESTS_LIST", data: data });
            });
        addTask(fetchTask);
        dispatch({ type: "USELESS_PANEL_ACTION" });
    }
};

export const reducer: Reducer<PanelState> = (state: PanelState, action: KnownActions) => {
    switch (action.type) {
        case "GET_ADMIN_USERS_LIST":
            return { ...state, UsersList: action.data, loading: false };
        case "GET_ADMIN_TESTS_LIST":
            return { ...state, TestsList: action.data, loading: false };
        case "USELESS_PANEL_ACTION":
            return { ...state, loading: true };
        default:
            const exhaustiveCheck = action;
    }

    return state || { TestsList: [], UsersList: [], loading: false };
};