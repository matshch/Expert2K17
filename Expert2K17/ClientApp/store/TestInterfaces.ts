import { Action, Reducer } from 'redux';

export interface System {
    name: string;
    user: string;
    picture: string;
    about: string;
    pub: boolean;
    guid: string;
}
export interface KSystem {
    system: System;
}

export interface Attribute {
    system_guid: string;
    name: string;
    guid: string;
    unitValue: boolean;
}
export interface KAttributes {
    attr: Attribute[];    
}



export interface Pair {
    attributeGuid: string;
    value: string;
    guid: string;
    subjectGuids: string[];
}
export interface Subject {
    system_guid: string;
    name: string;
    guid: string;
}


export interface KSubject {
    subjects: Subject[];
}


export interface Parameter {
    name: string;
    guid: string;
    unitValue: boolean; 
}

export interface KParameter {
    parameters: Parameter[];
}
export interface ParameterPair {
    //[guid: string]: string;//Attribute -> value
    parameterGuid: string;
    value: string;
    guid: string;
}

export interface Answer {
    answer: string;
    value: string; //value guid
}

export enum Operation {
    Equal,
    NotEqual,
    Greater,
    Less,
    Add,
    Substract,
    Set
}

export enum ComponentCondition {
    Question,
    Logic,
    Result
}

export interface Condition {
    left: string; // guid par/attr
    right: string; // value or guid
    act: Operation;
    parameter: number; // 1 - par -> 0 - attr -> -1 - not chosen
    guid: string;
    origin: ComponentCondition;
}

export interface KCondition {
    [guid: string]: Condition;
}


export enum QuestionType {
    Variety,
    Value
}

export enum LogicOperation {
    And,
    Or
}

export interface Question {
    question: string;
    guid: string;
    parameter_guid: string;
    answers: Answer[];
    cast_after: string; //Question_guid
    cast_if: string; //Condition guid 
    type: QuestionType;
}
export interface KQuestion {
    questions: Question[];
}

export interface Logic {
    conditions: string[];
    guid: string;
    then: string; //condition result
    operation: LogicOperation;
}

export interface Klogic {
    logics: Logic[];
}
