import { Subject } from './TestInterfaces'
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Guid from '../guid';
import { SystemCreateState } from './combinedSystem'


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
export
    interface SyncSubjectAction {
    type: 'SYNC_SUBJECT';
    subject: Subject;
}
interface AddSubjectAction {
    type: 'ADD_SUBJECT';
    subject: Subject;
}
interface AddPairAction {
    type: 'ADD_PAIR';
    attrGuid: string;
    value: string;
    subjectGuid: string;
    guid: string;
}
interface UnPairAction {
    type: 'UN_PAIR';
    index: number;
    innerIndex: number;
}
interface SetPairAction {
    type: 'SET_PAIR';
    attrGuid: string;
    value: string;
    subjectGuid: string;
}
interface LoadSystemAction {
    type: 'LOAD_SYSTEM';
    system: SystemCreateState;
}

interface DeleteSubjectAction {
    type: 'DELETE_SUBJECT';
    subjectGuid: string;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SyncSubjectAction | AddSubjectAction | LoadSystemAction | DeleteSubjectAction ;
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const actionCreators = {
    addSubject: (subject_: Subject): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_SUBJECT', subject: {
                ...subject_,
                guid: Guid.MakeNew(),
                system_guid: getState().combinedSystem.system.guid
            }
        });

    },
    syncSubject: (subject: Subject): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SYNC_SUBJECT', subject: subject });
    },
    addPair: (attrGuid: string, value: string, subjectGuid: string): AppThunkAction<AddPairAction | UnPairAction> => (dispatch, getState) => {
        let pairs = getState().combinedSystem.pairs;
        let innerIndex = -1;
        let index = pairs.findIndex((e) => {
            if (e.attributeGuid == attrGuid && e.subjectGuids.findIndex((x,y) => {
                if (x == subjectGuid) {
                    innerIndex = y
                    return true;
                }
                return false;
            }) > -1) {
                return true;
            }
            return false;

        })
        if (index > -1 && innerIndex > -1) {
            dispatch({ type: 'UN_PAIR', index: index, innerIndex: innerIndex });
        }
        dispatch({ type: 'ADD_PAIR', attrGuid: attrGuid, value: value, subjectGuid: subjectGuid, guid: Guid.MakeNew() });
    },
    setPair: (attrGuid: string, value: string, subjectGuid: string): AppThunkAction<SetPairAction | UnPairAction> => (dispatch, getState) => {
        let pairs = getState().combinedSystem.pairs;
        let innerIndex = -1;
        let index = pairs.findIndex((e) => {
            if (e.attributeGuid == attrGuid && e.value == value && e.subjectGuids.findIndex((x, y) => {
                if (x == subjectGuid) {
                    innerIndex = y
                    return true;
                }
                return false;
            }) > -1) {
                return true;
            }
            return false;

        })
        if (index > -1 && innerIndex > -1) {
            dispatch({ type: 'UN_PAIR', index: index, innerIndex: innerIndex });
        }
        dispatch({ type: 'SET_PAIR', attrGuid: attrGuid, value: value, subjectGuid: subjectGuid });
    },
    deleteSubject: (subjectGuid: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: 'DELETE_SUBJECT', subjectGuid: subjectGuid});

    }

};




export const unloadedState: Subject[] = [];

export const reducer: Reducer<Subject[]> = (state: Subject[], action: KnownAction) => {
    switch (action.type) {
        case "ADD_SUBJECT":
            return [...state, action.subject];
        case "LOAD_SYSTEM":
            return action.system.subjects;
        case "DELETE_SUBJECT":
            return state.filter((e)=>{
                if(e.guid == action.subjectGuid){
                    return false;
                }
                return true;
            })
        case "SYNC_SUBJECT":
            return state.map((e) => {
                if (e.guid == action.subject.guid) {
                    return action.subject
                }
                return e
            });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};