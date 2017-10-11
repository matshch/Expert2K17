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

export interface PanelState {
    UsersList: UserObject[];
    loading: boolean;
}

interface UselessPanelAction {
    type: "USELESS_PANEL_ACTION";
}

interface GetPanelResponse {
    type: "GET_ADMIN_USERS_LIST";
    data: UserObject[];
}

type KnownActions = UselessPanelAction | GetPanelResponse;

export const actionCreators = {
    GetTestsList: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        const fetchTask = fetch("/api/admin/getUsers", { credentials: "same-origin" })
            .then(response => response.json() as Promise<UserObject[]>).then(data => {
                dispatch({ type: "GET_ADMIN_USERS_LIST", data: data });
            });
        addTask(fetchTask);
        dispatch({ type: "USELESS_PANEL_ACTION" });
    }
};

export const reducer: Reducer<PanelState> = (state: PanelState, action: KnownActions) => {
    switch (action.type) {
    case "GET_ADMIN_USERS_LIST":
        return { UsersList: action.data, loading: false };
    case "USELESS_PANEL_ACTION":
        return { ...state, loading: true };
    default:
        const exhaustiveCheck = action;
    }

    return state || { UsersList: [], loading: false };
};