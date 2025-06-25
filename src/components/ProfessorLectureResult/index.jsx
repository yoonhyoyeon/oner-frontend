'use client';

import styles from './index.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Table from '@/components/Table';
import PageBox from '@/components/PageBox';

const ProfessorLectureResult = ({
    lectureId,
    comment,
    attendanceData,
    studentData,
    graphData
}) => {
    const renderAttendanceStatus = (value) => {
        return (
            <div className={`${styles.attendanceStatus} ${styles[value.type]}`}>
                {value.status}
            </div>
        );
    };

    const headers = ['아이디', '학번', '이름', '학과', '학년', '학교', '출결'];

    return (
        <div className={styles.container}>
            <PageBox>
                <div className={styles.section}>
                    <h2>한줄평</h2>
                    <p>{comment}</p>
                </div>
                <div className={styles.section}>
                    <h2>출결율</h2>
                    <div className={styles.attendanceBar}>
                        <div 
                            className={styles.present} 
                            style={{ width: `${attendanceData.present}%` }}
                        >
                            <span>출석 {attendanceData.present}%</span>
                        </div>
                        <div 
                            className={styles.late} 
                            style={{ width: `${attendanceData.late}%` }}
                        >
                            <span>지각 {attendanceData.late}%</span>
                        </div>
                        <div 
                            className={styles.absent} 
                            style={{ width: `${attendanceData.absent}%` }}
                        >
                            <span>결석 {attendanceData.absent}%</span>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>학생 평균 집중도</h2>
                    <div className={styles.graph}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#4F48D6" 
                                    strokeWidth={2}
                                    dot={{ fill: '#4F48D6', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>출결 현황</h2>
                    <Table 
                        headers={headers} 
                        data={studentData} 
                        customRenderers={{
                            출결: renderAttendanceStatus
                        }}
                    />
                </div>
            </PageBox>
        </div>
    );
};

export default ProfessorLectureResult; 