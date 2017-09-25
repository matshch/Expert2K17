import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface CardsState {
    SomeUselessObject: CardObject[];
    loading: boolean;
}

export interface User {
    id: string,
    nickname: string;
    surname: string,
    name: string,
    patronymic: string;
}

export interface CardObject {
    id: string,
    name: string,
    description: string,
    image: string,
    user: User;
}

interface UselessAction {
    type: 'USELESS_ACTION';
}

interface GetAllCards {
    type: 'GET_ALL_CARDS';
    data: CardObject[]
}

type KnownActions = UselessAction | GetAllCards;

export const actionCreators = {
    GetCards: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
            let fetchTask = fetch(`/api/tests`)
                .then(response => response.json() as Promise<CardObject[]>)
                .then(data => {
                    dispatch({type: 'GET_ALL_CARDS', data: data});
                });
            addTask(fetchTask);
            dispatch({ type: 'USELESS_ACTION'});
        }
};

export const reducer: Reducer<CardsState> = (state: CardsState, action: KnownActions) => {
    switch (action.type) {
        case 'GET_ALL_CARDS':
            return { SomeUselessObject: action.data, loading: false };
        case 'USELESS_ACTION':
            return { ...state, loading: true };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { SomeUselessObject: [], loading: false };
};
