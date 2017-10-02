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
    values: string[];
    unitValue: boolean;
}
export interface KAttributes {
    attr: Attribute[];    
}


export interface Pair {
    //[guid: string]: string;//Attribute -> value
    attributeGuid: string;
    value: string;
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
    questionGuids: string[];
}
interface Answer {
    answer: string;
    value: string;
}

enum Operation {
    Equal,
    NotEqual,
    Greater,
    Less,
    Add,
    Substract,
    Set
}
export interface Condition {
    left: string; // guid par/attr
    right: string; // value
    act: Operation;
    parameter: boolean; // 0 - par -> 1 - attr
    guid: string;   
}
export interface KCondition {
    [guid: string]: Condition;
}



export interface Question {
    system_guid: string;
    question: string;
    guid: string;
    parameter_guid: string;
    answers: Answer[];
    cast_after: string; //Question_guid
    cast_if: string; //Condition guid 

}
export interface KQuestion {
    questions: Question[];
}

export interface Logic {
    conditions: Condition[];
    guid: string;
    then: Condition;
    operation: Operation;
}

export interface Klogic {
    logics: Logic[];
}
