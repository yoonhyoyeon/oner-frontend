import styles from './index.module.css';
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

const StudentLecturePopup = ({setIsOpen, isOffline}) => {
    return (
        <div className={styles.popup_background} onClick={() => setIsOpen(false)}>
            <div className={styles.popup}>
                <div className={styles.popup_header}>
                    <div className={styles.popup_header_text}>
                        <h1>1회차 수업</h1>
                        <span className={styles.popup_header_date}>25-05-25 (수)</span>
                        <span className={styles.popup_header_time}>10:00-11:00</span>
                    </div>
                    <div className={styles.popup_header_close}>
                        <img src="/images/icons/close.png" alt="close" onClick={() => setIsOpen(false)} />
                    </div>
                </div>
                <div className={styles.popup_content}>
                    {isOffline ? (
                        <div className={styles.offline_content}>
                            <img src="/images/icons/check_success.png" alt="check" />
                            <h2>오프라인 출석이 확인되었습니다.</h2>
                        </div>
                    ) : (
                        <StudentLectureResult faceData={faceData} concentrationData={concentrationData} eyeData={eyeData} attentionData={attentionData} behaviorData={behaviorData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentLecturePopup;