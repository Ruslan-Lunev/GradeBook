import { Student } from "./student"
import { Subject } from "./subject"

export interface Score {
    studentId: number
    subjectId: number
    value: number
}

export interface SubjectScore extends Subject {
    value: number
}

export interface StudentScore extends Student {
    scores: SubjectScore[]
}