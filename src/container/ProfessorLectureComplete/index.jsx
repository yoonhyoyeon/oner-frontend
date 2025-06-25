'use client';

import { useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import ProfessorLectureResult from '@/components/ProfessorLectureResult';

// 더미 데이터
const attendanceData = {
    present: 80,
    late: 12,
    absent: 8
};

const studentData = [
    { 아이디: '00000000', 학번: '23011111', 이름: '이름', 학과: '학과', 학년: '1', 학교: '세종대학교', 출결: { status: '결석', type: 'absent' } },
    { 아이디: '00000000', 학번: '22111111', 이름: '이름', 학과: '학과', 학년: '2', 학교: '세종대학교', 출결: { status: '결석', type: 'absent' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '결석', type: 'absent' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '결석', type: 'absent' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '지각', type: 'late' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '지각', type: 'late' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '지각', type: 'late' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '출석', type: 'present' } },
    { 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 출결: { status: '출석', type: 'present' } },
];

// 학생들의 집중도 평균 데이터
const graphData = [
    { name: '10분', value: 85 },
    { name: '20분', value: 82 },
    { name: '30분', value: 78 },
    { name: '40분', value: 75 },
    { name: '50분', value: 73 },
    { name: '60분', value: 70 },
    { name: '70분', value: 72 },
    { name: '80분', value: 68 },
    { name: '90분', value: 65 },
    { name: '100분', value: 63 },
    { name: '110분', value: 60 },
    { name: '120분', value: 58 }
];

const ProfessorLectureComplete = ({lectureId}) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>강의가 종료되었습니다.</h1>
            <h2 className={styles.subtitle}>최신기술콜로키움</h2>
            <div className={styles.time}>02:03:00</div>
            
            <Link href="/professor/courses">
                <button className={styles.homeButton}>홈으로 돌아가기</button>
            </Link>

            <ProfessorLectureResult 
                lectureId={lectureId}
                comment="좋은 강의였습니다."
                attendanceData={attendanceData}
                studentData={studentData}
                graphData={graphData}
            />
        </div>
    );
}

export default ProfessorLectureComplete; 