import { fetch, addTask } from "../custom/fetch";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";
import { SystemCreateState } from "./combinedSystem";
import { LogicOperation, Operation, Question, QuestionType } from "./TestInterfaces";
import { ApplicationState } from "./";
import createCachedSelector from "re-reselect";
import deepEqual from "deep-equal";

export interface Answer {
    question_guid: string;
    answer: number | string;
}

export interface Parameter {
    guid: string;
    name: string;
    value: string;
    unitValue: boolean;
    set: boolean;
    reasons: number[];
}

export interface AskedQuestion {
    guid: string;
    question: string;
    type: QuestionType;
    answers: string[];
}

export interface ParameterValue {
    guid: string;
    value: string;
}

export interface Subject {
    guid: string;
    name: string;
    attributes: ParameterValue[];
    exactness: number;
}

export interface TestState extends SystemCreateState {
    answers: Answer[];
    answeredAttributes: Parameter[];
    answeredParameters: Parameter[];
    askedQuestions: AskedQuestion[];
    objects: Subject[];
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

interface AnswerQuestionAction {
    type: "ANSWER_QUESTION";
    question: string;
    answer: number | string;
}

type KnownActions = LoadTestAction | LoadingTestAction | AnswerQuestionAction;

export const actionCreators = {
    loadTest: (guid: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        if (getState().test.testId === guid) {
            return;
        }
        let fetchTask = fetch("/api/tests/" + guid, {credentials: "same-origin"})
            .then(response => response.json() as Promise<SystemCreateState>).then(data => {
                dispatch({ type: "LOAD_TEST_JSON", data: data });
            });
        addTask(fetchTask);
        dispatch({ type: "LOADING_TEST" });
    },
    answerQuestion: (guid: string, ans: number | string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: "ANSWER_QUESTION",
            question: guid,
            answer: ans
        });
    }
};

const getQuestions = (state : TestState) => state.questions;
const getQuestion = createCachedSelector(
                        getQuestions,
                        (state : TestState, guid : string) => guid,
                        (questions, guid) => questions.find(e => e.guid === guid)
                    )((state, guid) => guid);

const getParameters = (state : TestState) => state.parameters;
const getParameter = createCachedSelector(
                         getParameters,
                         (state : TestState, guid : string) => guid,
                         (parameters, guid) => parameters.find(e => e.guid === guid)
                     )((state, guid) => guid);

const getAttributes = (state : TestState) => state.attributes;
const getAttribute = createCachedSelector(
                         getAttributes,
                         (state : TestState, guid : string) => guid,
                         (attributes, guid) => attributes.find(e => e.guid === guid)
                     )((state, guid) => guid);

const getObjects = (state : TestState) => state.objects;
const getMinAttributeValue = createCachedSelector(
                         getObjects,
                         (state : TestState, guid : string) => guid,
                         (objects, guid) => {
                             const nums : number[] = [];
                             objects.forEach(e => {
                                 const b = e.attributes.find(i => i.guid === guid);
                                 if (b) {
                                     nums.push(parseFloat(b.value));
                                 }
                             });
                             if (nums.length === 0) {
                                 return 0;
                             }
                             let min = nums[0];
                             nums.forEach(e => {if (e < min) min = e});
                             return min;
                         }
                     )((state, guid) => guid);
const getMaxAttributeValue = createCachedSelector(
                         getObjects,
                         (state : TestState, guid : string) => guid,
                         (objects, guid) => {
                             const nums : number[] = [];
                             objects.forEach(e => {
                                 const b = e.attributes.find(i => i.guid === guid);
                                 if (b) {
                                     nums.push(parseFloat(b.value));
                                 }
                             });
                             if (nums.length === 0) {
                                 return 0;
                             }
                             let max = nums[0];
                             nums.forEach(e => {if (e > max) max = e});
                             return max;
                         }
                     )((state, guid) => guid);

const getParameterValues = (state : TestState) => state.parpairs;
const getParameterValue = createCachedSelector(
                              getParameterValues,
                              (state : TestState, guid : string) => guid,
                              (parameterValues, guid) => parameterValues.find(e => e.guid === guid)
                          )((state, guid) => guid);

const getAttributeValues = (state : TestState) => state.pairs;
const getAttributeValue = createCachedSelector(
                              getAttributeValues,
                              (state : TestState, guid : string) => guid,
                              (attributeValues, guid) => attributeValues.find(e => e.guid === guid)
                          )((state, guid) => guid);

const getAnsweredParameter = createCachedSelector(
                                 (state : TestState) => state,
                                 (state : TestState, answer : Answer) => getQuestion(state, answer.question_guid),
                                 (state : TestState, answer : Answer) => answer,
                                 (state, question, answer) => {
                                     const parameter = getParameter(state, question.parameter_guid);
                                     if (question.type === QuestionType.Variety) {
                                         const answerNumber = parseInt(answer.answer.toString());
                                         const value = getParameterValue(state, question.answers[answerNumber].value);
                                         return {
                                             guid: question.parameter_guid,
                                             name: parameter.name,
                                             unitValue: parameter.unitValue,
                                             value: value.value,
                                             set: true,
                                             reasons: []
                                         };
                                     } else {
                                         return {
                                             guid: question.parameter_guid,
                                             name: parameter.name,
                                             unitValue: parameter.unitValue,
                                             value: answer.answer.toString(),
                                             set: true,
                                             reasons: []
                                         };
                                     }
                                 }
                             )((state, answer) => answer.question_guid);

const getAnsweredParameterValues = (state : TestState) => state.answeredParameters;
const getAnsweredParameterValue = createCachedSelector(
                                      getAnsweredParameterValues,
                                      (state : TestState, guid : string) => guid,
                                      (answeredParameterValues, guid) => answeredParameterValues.find(e => e.guid === guid)
                                  )((state, guid) => guid);

const getAnsweredAttributeValues = (state : TestState) => state.answeredAttributes;
const getAnsweredAttributeValue = createCachedSelector(
                                      getAnsweredAttributeValues,
                                      (state : TestState, guid : string) => guid,
                                      (answeredAttributeValues, guid) => answeredAttributeValues.find(e => e.guid === guid)
                                  )((state, guid) => guid);

const getConditions = (state : TestState) => state.conditions;
const getCondition = createCachedSelector(
                         getConditions,
                         (state : TestState, guid : string) => guid,
                         (conditions, guid) => conditions.find(e => e.guid === guid)
                     )((state, guid) => guid);
const getLogicConditionResult = createCachedSelector(
                                    (state : TestState) => state,
                                    (state : TestState, guid : string) => getCondition(state, guid),
                                    (state : TestState, guid : string) => getAnsweredParameterValue(state, getCondition(state, guid).left),
                                    (state : TestState, guid : string) => getParameter(state, getCondition(state, guid).left),
                                    (state, condition, value, param) => {
                                        switch (condition.act) {
                                            case Operation.Equal:
                                                if (value === undefined) {
                                                    return false;
                                                }
                                                if (param.unitValue) {
                                                    return value.value === condition.right;
                                                } else {
                                                    const val = getParameterValue(state, condition.right);
                                                    return value.value === val.value;
                                                }
                                            case Operation.NotEqual:
                                                if (value === undefined) {
                                                    return true;
                                                }
                                                if (param.unitValue) {
                                                    return value.value !== condition.right;
                                                } else {
                                                    const val = getParameterValue(state, condition.right);
                                                    return value.value !== val.value;
                                                }
                                            case Operation.Greater:
                                                if (value === undefined) {
                                                    return false;
                                                }
                                                if (param.unitValue) {
                                                    return parseFloat(value.value) > parseFloat(condition.right);
                                                } else {
                                                    const val = getParameterValue(state, condition.right);
                                                    return value.value > val.value;
                                                }
                                            case Operation.Less:
                                                if (value === undefined) {
                                                    return false;
                                                }
                                                if (param.unitValue) {
                                                    return parseFloat(value.value) < parseFloat(condition.right);
                                                } else {
                                                    const val = getParameterValue(state, condition.right);
                                                    return value.value < val.value;
                                                }
                                            default:
                                                console.error("This condition is uncomputable:", state, condition);
                                                return false;
                                        }
                                    }
                                )((state, guid) => guid);

const toAskedQuestion = (q : Question) => ({
                                               guid: q.guid,
                                               question: q.question,
                                               answers: q.answers.map(e => e.answer),
                                               type: q.type
                                           });

export const reducer: Reducer<TestStore> = (state: TestStore, action: KnownActions) => {
    switch (action.type) {
        case "LOAD_TEST_JSON":
            const test : TestStore = {
                test: {
                    ...action.data,
                    answers: [],
                    answeredAttributes: [],
                    answeredParameters: [],
                    askedQuestions: [],
                    objects: action.data.subjects.map(e => ({
                        guid: e.guid,
                        name: e.name,
                        attributes: [],
                        exactness: 0
                    }))
                },
                testId: action.data.system.guid,
                testLoading: false
            };
            action.data.questions.forEach(q => {
                if (q.cast_if === "" && q.cast_after === "") {
                    test.test.askedQuestions.push(toAskedQuestion(q));
                }
                if (q.cast_if !== "" && getLogicConditionResult(test.test, q.cast_if)) {
                    test.test.askedQuestions.push(toAskedQuestion(q));
                }
            });
            action.data.pairs.forEach(e => {
                e.subjectGuids.forEach(s => {
                    let obj = test.test.objects.find(i => i.guid === s);
                    if (obj) {
                        obj.attributes.push({
                            guid: e.attributeGuid,
                            value: e.value
                        });
                    }
                });
            });
            return test;
        case "LOADING_TEST":
            return { ...state, testLoading: true };
        case "ANSWER_QUESTION":
            const ans = {
                            question_guid: action.question,
                            answer: action.answer
                        };
            let newTest : TestState = {
                    ...state.test,
                    answers: [
                        ...state.test.answers
                    ],
                    answeredParameters: [],
                    answeredAttributes: []
                };
            const ansIndex = newTest.answers.findIndex(e => e.question_guid === ans.question_guid);
            if (ansIndex === -1) {
                newTest.answers.push(ans);
            } else {
                newTest.answers[ansIndex] = ans;
            }

            newTest.answeredParameters = newTest.answers.map(e => getAnsweredParameter(newTest, ans));

            let oldTest = newTest;
            console.log("Beginning recalc...");
            do {
                oldTest = newTest;
                newTest = {
                    ...newTest,
                    answeredParameters: newTest.answeredParameters.map(e => e.reasons.length > 0 ? {...e, reasons: []} : e)
                };
                newTest = newTest.logics.reduce((test, rule) => {
                    if ((rule.operation === LogicOperation.And &&
                         rule.conditions.every((conditionGuid) => getLogicConditionResult(test, conditionGuid))) ||
                        (rule.operation === LogicOperation.Or &&
                         rule.conditions.some((conditionGuid) => getLogicConditionResult(test, conditionGuid)))) {
                        let newTest = test;
                        const then = getCondition(test, rule.then);

                        let par : Parameter, oldParam : Parameter, parValue : string;
                        switch (then.parameter) {
                            case 1: //parameter
                                newTest = {
                                    ...test,
                                    answeredParameters: [
                                        ...test.answeredParameters
                                    ]
                                };
                                const param = getParameter(test, then.left);
                                par = {
                                    guid: param.guid,
                                    name: param.name,
                                    value: "",
                                    unitValue: param.unitValue,
                                    set: true,
                                    reasons: []
                                };
                                oldParam = getAnsweredParameterValue(test, then.left);
                                const val = getParameterValue(test, then.right);
                                if (val !== undefined) {
                                    parValue = val.value;
                                }
                                break;
                            case 0: //attribute
                                newTest = {
                                    ...test,
                                    answeredAttributes: [
                                        ...test.answeredAttributes
                                    ]
                                };
                                const attr = getAttribute(test, then.left);
                                par = {
                                    guid: attr.guid,
                                    name: attr.name,
                                    value: "",
                                    unitValue: attr.unitValue,
                                    set: true,
                                    reasons: []
                                };
                                oldParam = getAnsweredAttributeValue(test, then.left);
                                const aVal = getAttributeValue(test, then.right);
                                if (aVal !== undefined) {
                                    parValue = aVal.value;
                                }
                                break;
                            default:
                                console.error("Unknown then operation", test, rule);
                                return test;
                        }
                        switch (then.act) {
                            case Operation.Set:
                                if (par.unitValue) {
                                    par = {
                                        ...par,
                                        value: then.right,
                                        set: true,
                                        reasons: []
                                    };
                                } else {
                                    par = {
                                        ...par,
                                        value: parValue,
                                        set: true,
                                        reasons: []
                                    };
                                }
                                break;
                            case Operation.Add:
                                if (par.unitValue) {
                                    if (oldParam === undefined) {
                                        par = {
                                            ...par,
                                            value: then.right,
                                            set: false,
                                            reasons: [parseFloat(then.right)]
                                        };
                                    } else if (oldParam.set) {
                                        return test;
                                    } else {
                                        par = {
                                            ...par,
                                            value: (parseFloat(oldParam.value) + parseFloat(then.right)).toString(),
                                            set: false,
                                            reasons: [...oldParam.reasons, parseFloat(then.right)]
                                        };
                                    }
                                } else {
                                    par = {
                                        ...par,
                                        value: parValue,
                                        set: true,
                                        reasons: []
                                    };
                                }
                                break;
                            case Operation.Substract:
                                if (par.unitValue) {
                                    if (oldParam === undefined) {
                                        par = {
                                            ...par,
                                            value: (-parseFloat(then.right)).toString(),
                                            set: false,
                                            reasons: [-parseFloat(then.right)]
                                        };
                                    } else if (oldParam.set) {
                                        return test;
                                    } else {
                                        par = {
                                            ...par,
                                            value: (parseFloat(oldParam.value) - parseFloat(then.right)).toString(),
                                            set: false,
                                            reasons: [...oldParam.reasons, -parseFloat(then.right)]
                                        };
                                    }
                                } else {
                                    par = {
                                        ...par,
                                        value: parValue,
                                        set: true,
                                        reasons: []
                                    };
                                }
                                break;
                            default:
                                console.error("Unknown operation", test, rule);
                                return test;
                        }

                        switch (then.parameter) {
                            case 1: //parameter
                                const parIndex = newTest.answeredParameters.findIndex(e => e.guid === par.guid);
                                if (parIndex === -1) {
                                    newTest.answeredParameters.push(par);
                                } else {
                                    newTest.answeredParameters[parIndex] = par;
                                }
                                break;
                            case 0: //attribute
                                const attrIndex = newTest.answeredAttributes.findIndex(e => e.guid === par.guid);
                                if (attrIndex === -1) {
                                    newTest.answeredAttributes.push(par);
                                } else {
                                    newTest.answeredAttributes[attrIndex] = par;
                                }
                                break;
                        }
                        return newTest;
                    }
                    return test;
                }, newTest);
                console.log(oldTest, newTest);
            } while (!deepEqual(oldTest, newTest));
            console.log("Recalc done.");
            const newQuestions : AskedQuestion[] = [];
            newTest.questions.forEach(q => {
                if (!newTest.askedQuestions.some(e => e.guid === q.guid)) {
                    let after = q.cast_after === "";
                    let ifq = q.cast_if === "";
                    if (!after && newTest.answers.some(e => e.question_guid === q.cast_after)) {
                        after = true;
                    }
                    if (!ifq && getLogicConditionResult(newTest, q.cast_if)) {
                        ifq = true;
                    }
                    if (after && ifq) {
                        newQuestions.push(toAskedQuestion(q));
                    }
                }
            });
            if (newQuestions.length > 0) {
                newTest = {
                    ...newTest,
                    askedQuestions: [...newTest.askedQuestions, ...newQuestions]
                };
            }
            let changed = false;
            newTest.objects.forEach((o, i) => {
                const results = o.attributes.map((e => {
                    const ans = getAnsweredAttributeValue(newTest, e.guid);
                    if (ans === undefined) {
                        return 0;
                    }
                    const attr = getAttribute(newTest, e.guid);
                    if (!attr.unitValue) {
                        if (ans.value === e.value) {
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        const a = parseFloat(ans.value);
                        const b = parseFloat(e.value);
                        let d = a - b;
                        d = d >= 0 ? d : -d;
                        const max = getMaxAttributeValue(newTest, e.guid);
                        const min = getMinAttributeValue(newTest, e.guid);
                        let exactness = 1 - d / (max - min);
                        if (exactness > 1) exactness = 1;
                        if (exactness < 0) exactness = 0;
                        return exactness;
                    }
                }));
                let sum = 0;
                results.forEach(e => sum += e);
                const exactness = sum / o.attributes.length;
                if (o.exactness !== exactness) {
                    newTest.objects[i] = {
                        ...newTest.objects[i],
                        exactness: exactness
                    };
                    changed = true;
                }
            });
            if (changed) {
                newTest.objects = [...newTest.objects];
                newTest.objects.sort((a, b) => b.exactness - a.exactness);
            }
            return {
                ...state,
                test: newTest
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || { test: null, testId: "", testLoading: false };
};