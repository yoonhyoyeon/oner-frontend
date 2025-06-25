'use client';

import { useState } from 'react';
import styles from './index.module.css';
import PageBox from '@/components/PageBox';
import Image from 'next/image';
import Table from '@/components/Table';
import cx from 'classnames';
import Link from 'next/link';
import AddCoursePopup from '@/components/AddCoursePopup';

const ProfessorCourses = () => {
    const headers = ['순번', '아이디', '학번', '이름', '학과', '학년', '학교'];
    const data = [...Array(18)].map((_, index) => ({
        순번: index + 1,
        아이디: '00000000',
        학번: index < 2 ? `23${index + 1}11111` : '21000000',
        이름: '이름',
        학과: '학과',
        학년: Math.ceil((index + 1) / 6),
        학교: '세종대학교'
    }));

    const courseData = [...Array(5)].map((_, index) => ({
        id: index + 1,
        강의명: '강의명',
        강의실: '강의실',
        수업시간: '수업시간'
    }));

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isAddCoursePopupOpen, setIsAddCoursePopupOpen] = useState(false);

    return (
        <div className={styles.container}>
            {isAddCoursePopupOpen && <AddCoursePopup setIsOpen={setIsAddCoursePopupOpen} />}
            <PageBox>
                <h1 className={styles.title}>
                    강의 목록 
                    <button className={styles.add_button} onClick={() => setIsAddCoursePopupOpen(true)}>강의 개설하기</button>
                </h1>
                {
                    courseData.map((course, index) => (
                        <div className={cx(styles.course_item, selectedCourse === course.id && styles.selected)} key={course.id}>
                            <div className={styles.course_header}>
                                <h2>{course.강의명}</h2>
                                <div className={styles.course_info}>
                                    <span>{course.강의실}</span>
                                    <span>{course.수업시간}</span>
                                </div>
                                <div className={styles.course_actions}>
                                    <Image className={styles.edit_icon} src="/images/icons/edit.png" alt="edit" width={24} height={24} />
                                    <button className={styles.toggle_btn} onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}>
                                        <Image src="/images/icons/dropdown.png" alt="toggle" width={24} height={24} />
                                    </button>
                                </div>
                            </div>
                            {
                                selectedCourse === course.id && (
                                    <div className={styles.student_info}>
                                        <div className={styles.student_count}>
                                            학생수 <span className={styles.highlight}>총 18명</span>
                                        </div>

                                        <Table headers={headers} data={data} isScroll={true} />

                                        <div className={styles.action_buttons}>
                                            <Link href={`/professor/courses/${course.id}`}>
                                                <button className={styles.outline_button}>과목 자세히보기</button>
                                            </Link>
                                            <Link href={`/professor/lecture/${course.id}/setting`}>
                                                <button className={styles.primary_button}>수업 시작하기</button>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
                
            </PageBox>
        </div>
    );
};

export default ProfessorCourses;