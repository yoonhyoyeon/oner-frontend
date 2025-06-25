'use client';
import styles from './index.module.css';
import PageBox from '@/components/PageBox';
import { useRouter } from 'next/navigation';

const courses = [
  {
    id: 1,
    title: '최신기술콜로키움',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: true,
    active: true,
  },
  {
    id: 2,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  {
    id: 3,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  {
    id: 4,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  {
    id: 5,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  {
    id: 6,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  {
    id: 7,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  {
    id: 8,
    title: '강의명',
    professor: '교수님',
    time: '수 19:00-21:00',
    canEnter: false,
    active: false,
  },
  // ...더 많은 강의
];

export default function StudentCourses() {
    const router = useRouter();
    const handleEnterLecture = (id) => {
        router.push(`/student/lecture/${id}/setting`);
    }
  return (
    <div className={styles.container}>
        <PageBox>
            <h1 className={styles.title}>강의 목록</h1>
            <div className={styles.courseList}>
                {courses.map((course, idx) => (
                <div
                    key={course.id}
                    className={`${styles.courseItem} ${course.canEnter ? styles.active : ''}`}
                >
                    <div className={styles.header}>
                        <div className={styles.courseTitle}>{course.title}</div>
                        <div className={styles.professor}>{course.professor}</div>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.time}>강의실<br />{course.time}</div>
                        <button
                            className={course.canEnter ? styles.enterBtn : styles.disabledBtn}
                            disabled={!course.canEnter}
                            onClick={() => handleEnterLecture(course.id)}
                        >
                            {course.canEnter ? '입장하기' : '입장 불가'}
                        </button>
                    </div>
                </div>
                ))}
            </div>
        </PageBox>
    </div>
  );
}