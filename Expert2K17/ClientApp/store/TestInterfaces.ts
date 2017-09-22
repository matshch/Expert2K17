﻿import { Action, Reducer } from 'redux';

export interface System {
    name: string;
    user: string;
    picture: string;
    co_users: string[];
    tldr: string;
    //guid: string;
}
export interface KSystem {
    [guid: string]: System;
}

interface Attributes {
    system_guid: string;
    name: string;
    //guid: string;
    values: string[];
    unitValue: boolean;
}
export interface KAttributes {
    [guid: string]: Attributes;    
}


interface Pair {
    [guid: string]: string;//Attribute -> value
}
interface Subject {
    system_guid: string;
    name: string;
    //guid: string;
    pairs: Pair;
}

export interface KSubject {
    [guid: string]: Subject;
}


interface Parameter {
    name: string;
    //guid: string;
    unitValue: boolean; 
    values: string[];
}

export interface KParameter {
    [guid: string]: string;
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
interface Condition {
    left: string; // guid par/attr
    right: string; // value
    act: Operation;
    parameter: boolean; // 0 - par -> 1 - attr
    //guid: string;   
}
export interface KCondition {
    [guid: string]: Condition;
}



interface Question {
    system_guid: string;
    question: string;
    //guid: string;
    parameter_guid: string;
    answers: Answer[];
    cast_after: string; //Question_guid
    cast_if: string; //Condition guid 

}
export interface KQuestion {
    [guid: string]: Question;
}

interface Logic {
    conditions: Condition[];
   // guid: string;
    then: Condition;
    operation: Operation;
}

export interface Klogic {
    [guid: string]: Logic;
}
