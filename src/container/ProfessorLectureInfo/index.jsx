'use client';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';
import Table from '@/components/Table';
import PageBox from '@/components/PageBox';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ProfessorLectureInfo = ({lectureId}) => {
    const router = useRouter();

    // 더미 데이터
    const attendanceData = {
        present: 80,
        late: 12,
        absent: 8
    };

    const graphData = [
        { name: '1주차', value: 85 },
        { name: '2주차', value: 78 },
        { name: '3주차', value: 82 },
        { name: '4주차', value: 85 },
        { name: '5주차', value: 83 },
        { name: '6주차', value: 87 },
        { name: '7주차', value: 89 },
    ];

    const headers = ['아이디', '학번', '이름', '학과', '학년', '학교', '출결'];
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

    const renderAttendanceStatus = (value) => {
        return (
            <div className={`${styles.attendanceStatus} ${styles[value.type]}`}>
                {value.status}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <PageBox>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <div className={styles.lectureInfo}>
                        <h1>1회차 수업</h1>
                        <span>25/05/05/수 18:00-20:00</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>한줄평</h2>
                    <span>한줄평</span>
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
                            <span>결석 {attendanceData.late}%</span>
                        </div>
                        <div 
                            className={styles.absent} 
                            style={{ width: `${attendanceData.absent}%` }}
                        >
                            <span>지각 {attendanceData.absent}%</span>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>그래프</h2>
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

export default ProfessorLectureInfo;