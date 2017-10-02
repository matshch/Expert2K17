import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface HomeState {
    ResponseObject: CardObject[];
    loading: boolean;
}

interface User {
    id: string,
    nickname: string;
    surname: string,
    name: string,
    patronymic: string;
}

interface CardObject {
    id: string,
    name: string,
    description: string,
    image: string,
    user: User;
}

interface UselessCardsAction {
    type: 'USELESS_CARDS_ACTION';
}

interface GetAllCards {
    type: 'GET_ALL_CARDS';
    data: CardObject[]
}

type KnownActions = UselessCardsAction | GetAllCards;

export const actionCreators = {
    GetCards: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
            let fetchTask = fetch(`/api/tests`)
                .then(response => response.json() as Promise<CardObject[]>)
                .then(data => {
                    dispatch({type: 'GET_ALL_CARDS', data: data});
                });
            addTask(fetchTask);
            dispatch({ type: 'USELESS_CARDS_ACTION'});
        }
};

export const reducer: Reducer<HomeState> = (state: HomeState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_ALL_CARDS':
            return { ResponseObject: action.data, loading: false };
        case 'USELESS_CARDS_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { ResponseObject: [], loading: false };
};
