'use client';
import CircularProgressBar from '@/components/CircularProgressBar';
import styles from './index.module.css';
import PageBox from '@/components/PageBox';
import { useState } from 'react';
import CountUp from 'react-countup';
import StudentLecturePopup from '@/components/StudentLecturePopup';

const dummyCourses = [
    {
        id: 1,
        name: '최신기술콜로키움',
        professor: '김영훈',
        classroom: '강의실',
        time: '수 10:00-11:00',
    },
    {
        id: 2,
        name: '최신기술콜로키움',
        professor: '김영훈',
        classroom: '강의실',
        time: '수 10:00-11:00',
    },
]
const StudentCheck = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.container}>
            <PageBox>
                <h1 className={styles.title}>출결 현황</h1>
                <div className={styles.courseList}>
                    {dummyCourses.map((course) => (
                        <div className={`${styles.courseItem} ${selectedCourse === course.id ? styles.active : ''}`} key={course.id}>
                            <div className={styles.courseItemHeader}>
                                <div className={styles.courseName}>{course.name}</div>
                                <div className={styles.professor}>{course.professor}</div>
                                <div className={styles.classroom}>{course.classroom}</div>
                                <div className={styles.time}>{course.time}</div>
                                <span className={styles.dropdownBtn} onClick={() => {setSelectedCourse(selectedCourse === course.id ? null : course.id);}}><img src="/images/icons/dropdown.png" alt="dropdown" /></span>
                            </div>
                            {selectedCourse === course.id && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownRow}>
                                        <div className={styles.dropdownItem}>
                                            <div className={styles.dropdownItemTitle}>전체</div>
                                            <div className={styles.dropdownItemProgress}>
                                                <CircularProgressBar value={50} max={100} />
                                            </div>
                                        </div>
                                        <div className={styles.dropdownItem}>
                                            <div className={styles.dropdownItemTitle}>횟수</div>
                                            <div className={styles.dropdownItemRow}>
                                                <div className={styles.dropdownItemRowItem}>
                                                    <div className={styles.dropdownItemRowItemTitle}>수업</div>
                                                    <div className={styles.dropdownItemRowItemValue}><CountUp end={6} duration={1.5} /></div>
                                                </div>
                                                <div className={styles.dropdownItemRowItem}>
                                                    <div className={styles.dropdownItemRowItemTitle}>출석</div>
                                                    <div className={styles.dropdownItemRowItemValue}><CountUp end={6} duration={1.5} /></div>
                                                </div>
                                                <div className={styles.dropdownItemRowItem}>
                                                    <div className={styles.dropdownItemRowItemTitle}>결석</div>
                                                    <div className={styles.dropdownItemRowItemValue}><CountUp end={0} duration={1.5} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.dropdownRow2}>
                                        <div className={styles.lectureList}>
                                            <div className={styles.lectureItem} onClick={() => setIsOpen(true)}>
                                                <div className={styles.lectureItemTitle}>1회차 수업</div>
                                                <div className={styles.lectureItemDate}>25-05-25 (수)</div>
                                                <div className={styles.lectureItemTime}>10:00-11:00</div>
                                                <div className={styles.lectureItemStatus}><img src="/images/icons/check_success.png" alt="check" /></div>
                                            </div>
                                            <div className={styles.lectureItem} onClick={() => setIsOpen(true)}>
                                                <div className={styles.lectureItemTitle}>2회차 수업</div>
                                                <div className={styles.lectureItemDate}>25-05-25 (수)</div>
                                                <div className={styles.lectureItemTime}>10:00-11:00</div>
                                                <div className={styles.lectureItemStatus}><img src="/images/icons/check_success.png" alt="check" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    {isOpen && <StudentLecturePopup setIsOpen={setIsOpen} isOffline={true} />}
                                </div>
                            )}
                        </div>
                        
                    ))}
                </div>
            </PageBox>
        </div>
    )
}

export default StudentCheck;