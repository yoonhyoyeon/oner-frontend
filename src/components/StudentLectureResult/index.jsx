'use client';

import styles from './index.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';

const StudentLectureResult = ({faceData, concentrationData, eyeData, attentionData, behaviorData}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [complaintType, setComplaintType] = useState('선택');
    const [complaintContent, setComplaintContent] = useState('');
    const [attachedFile, setAttachedFile] = useState('');

    const handleSubmitComplaint = () => {
        // 이의신청 제출 로직
        console.log({
            type: complaintType,
            content: complaintContent,
            file: attachedFile
        });
        setIsPopupOpen(false);
    };
    return (
        <>
            <div className={styles.analysisSection}>
                <h3>탐지 결과</h3>
                <div className={styles.charts}>
                    <div className={styles.chartItem}>
                        <h4>얼굴 검출</h4>
                        <LineChart width={400} height={200} data={faceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </div>
                    <div className={styles.chartItem}>
                        <h4>얼굴 인식</h4>
                        <LineChart width={400} height={200} data={concentrationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} />
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                        </LineChart>
                    </div>
                    <div className={styles.chartItem}>
                        <h4>생체 활동성</h4>
                        <LineChart width={400} height={200} data={eyeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} />
                            <Line type="monotone" dataKey="value" stroke="#ffc658" />
                        </LineChart>
                    </div>
                    <div className={styles.chartItem}>
                        <h4>주의집중도</h4>
                        <LineChart width={400} height={200} data={attentionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} />
                            <Line type="monotone" dataKey="value" stroke="#ff7300" />
                        </LineChart>
                    </div>
                    <div className={styles.chartItem}>
                        <h4>머리 자세</h4>
                        <LineChart width={400} height={200} data={behaviorData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} />
                            <Line type="monotone" dataKey="value" stroke="#0088fe" />
                        </LineChart>
                    </div>
                </div>
            </div>
            <div className={styles.btn_wrap}>
                <button 
                    className={styles.reportButton} 
                    onClick={() => setIsPopupOpen(true)}
                >
                    이의신청
                </button>
            </div>
            {isPopupOpen && (
                <>
                    <div className={styles.popup_background} onClick={() => setIsPopupOpen(false)} />
                    <div className={styles.popup}>
                        <h2>이의신청</h2>
                        
                        <div className={styles.input_group}>
                            <label>사유</label>
                            <select 
                                value={complaintType}
                                onChange={(e) => setComplaintType(e.target.value)}
                            >
                                <option value="선택">선택</option>
                                <option value="네트워크">네트워크 문제</option>
                                <option value="시스템">시스템 오류</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        <div className={styles.input_group}>
                            <label>내용</label>
                            <textarea
                                placeholder="내용을 상세하게 작성해주세요"
                                value={complaintContent}
                                onChange={(e) => setComplaintContent(e.target.value)}
                            />
                        </div>

                        <div className={styles.input_group}>
                            <label>제출파일</label>
                            <input 
                                type="file" 
                                placeholder="내 파일에서 선택"
                                value={attachedFile}
                                onChange={(e) => setAttachedFile(e.target.value)}
                            />
                        </div>
                        <button 
                            className={styles.submit_button}
                            onClick={handleSubmitComplaint}
                        >
                            이의신청 완료하기
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default StudentLectureResult;