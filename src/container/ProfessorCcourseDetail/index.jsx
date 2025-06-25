'use client';
import styles from './index.module.css';
import { useState } from 'react';
import Table from '@/components/Table';
import TranscriptUploadPopup from '@/components/TranscriptUploadPopup';
import { useRouter } from 'next/navigation';
import PageBox from '@/components/PageBox';
import Link from 'next/link';

const ProfessorCcourseDetail = ({courseId}) => {
    const router = useRouter();
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

    const headers = ['순번', '아이디', '학번', '이름', '학과', '학년', '학교', '상태'];
    const studentData = [
        { 순번: '1', 아이디: '00000000', 학번: '23011111', 이름: '이름', 학과: '학과', 학년: '1', 학교: '세종대학교', 상태: '삭제' },
        { 순번: '2', 아이디: '00000000', 학번: '22111111', 이름: '이름', 학과: '학과', 학년: '2', 학교: '세종대학교', 상태: '삭제' },
        { 순번: '3', 아이디: '00000000', 학번: '21000000', 이름: '이름', 학과: '학과', 학년: '3', 학교: '세종대학교', 상태: '삭제' },
    ];

    const lectureId = 123;

    return (
        <div className={styles.container}>
            <PageBox>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1>강의명</h1>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>수강학생 목록</h2>
                        <div className={styles.buttonGroup}>
                            <button className={styles.editButton}>수정</button>
                            <button 
                                className={styles.uploadButton}
                                onClick={() => setIsUploadPopupOpen(true)}
                            >
                                학생데이터 업로드
                            </button>
                        </div>
                    </div>
                    <Table headers={headers} data={studentData} />
                </div>

                <div className={styles.section}>
                    <h2>수업</h2>
                    <div className={styles.classInfo}>
                        <Link href={`/professor/lectureinfo/${lectureId}`}>
                            <div className={styles.classRow}>
                                <h3>1회차 수업</h3>
                                <div className={styles.classDetails}>
                                    <span>25/05/05/수</span>
                                    <span>18:00-20:00</span>
                                </div>
                            </div>
                        </Link>
                        <Link href={`/professor/lectureinfo/${lectureId}`}>
                            <div className={styles.classRow}>
                                <h3>1회차 수업</h3>
                                <div className={styles.classDetails}>
                                    <span>25/05/05/수</span>
                                    <span>18:00-20:00</span>
                                </div>
                            </div>
                        </Link>
                        <Link href={`/professor/lectureinfo/${lectureId}`}>
                            <div className={styles.classRow}>
                                <h3>1회차 수업</h3>
                                <div className={styles.classDetails}>
                                    <span>25/05/05/수</span>
                                    <span>18:00-20:00</span>
                                </div>
                            </div>
                        </Link>
                        <Link href={`/professor/lectureinfo/${lectureId}`}>
                            <div className={styles.classRow}>
                                <h3>1회차 수업</h3>
                                <div className={styles.classDetails}>
                                    <span>25/05/05/수</span>
                                    <span>18:00-20:00</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {isUploadPopupOpen && (
                    <TranscriptUploadPopup setIsOpen={setIsUploadPopupOpen} />
                )}
            </PageBox>
        </div>
    );
};

export default ProfessorCcourseDetail;