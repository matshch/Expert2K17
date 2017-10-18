import { fetch, addTask } from "../custom/fetch";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";
import { SystemCreateState } from "./combinedSystem";
import { ApplicationState } from "./";

export interface TestState extends SystemCreateState {

}

export interface TestStore {
    testLoading: boolean;
    testId: string;
    test: TestState | null;
}

interface LoadTestAction {
    type: "LOAD_TEST_JSON";
    data: SystemCreateState;
}

interface LoadingTestAction {
    type: "LOADING_TEST";
}

type KnownActions = LoadTestAction | LoadingTestAction;

export const actionCreators = {
    loadTest: (id: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        if (getState().test.testId === id) {
            return;
        }
        let fetchTask = fetch("/api/tests/" + id, {credentials: "same-origin"})
            .then(response => response.json() as Promise<SystemCreateState>).then(data => {
                dispatch({ type: "LOAD_TEST_JSON", data: data });
            });
        addTask(fetchTask);
        dispatch({ type: "LOADING_TEST" });
    }
};

export const reducer: Reducer<TestStore> = (state: TestStore, action: KnownActions) => {
    switch (action.type) {
        case "LOAD_TEST_JSON":
            return { test: action.data, testId: action.data.system.guid, testLoading: false };
        case "LOADING_TEST":
            return { ...state, testLoading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { test: null, testId: "", testLoading: false };
};