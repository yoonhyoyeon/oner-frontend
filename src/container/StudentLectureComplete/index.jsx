'use client';

import { useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import StudentLectureResult from '@/components/StudentLectureResult';

// 더미 데이터
const faceData = Array.from({ length: 10 }, (_, i) => ({
    time: i * 10,
    value: Math.floor(Math.random() * 50) + 30
}));

const concentrationData = Array.from({ length: 10 }, (_, i) => ({
    time: i * 10,
    value: Math.floor(Math.random() * 20) + 80
}));

const eyeData = Array.from({ length: 10 }, (_, i) => ({
    time: i * 10,
    value: Math.floor(Math.random() * 15) + 10
}));

const attentionData = Array.from({ length: 10 }, (_, i) => ({
    time: i * 10,
    value: Math.floor(Math.random() * 10) + 85
}));

const behaviorData = Array.from({ length: 10 }, (_, i) => ({
    time: i * 10,
    value: Math.floor(Math.random() * 15) + 5
}));

const StudentLectureComplete = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>강의가 종료되었습니다.</h1>
            <h2 className={styles.subtitle}>최신기술콜로키움</h2>
            <div className={styles.time}>02:03:00</div>
            
            <Link href="/student/courses">
                <button className={styles.homeButton}>홈으로 돌아가기</button>
            </Link>

            <StudentLectureResult faceData={faceData} concentrationData={concentrationData} eyeData={eyeData} attentionData={attentionData} behaviorData={behaviorData} />
        </div>
    );
}

export default StudentLectureComplete; 