'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import Input from '@/components/Input';
import WeightSelect from '@/components/WeightSelect';
import Select from '@/components/Select';
import authFetch from '@/utils/authFetch';

const AddCoursePopup = ({setIsOpen}) => {
    const dayOptions = [
        { value: 'MON', label: '월요일' },
        { value: 'TUE', label: '화요일' },
        { value: 'WED', label: '수요일' },
        { value: 'THU', label: '목요일' },
        { value: 'FRI', label: '금요일' },
        { value: 'SAT', label: '토요일' },
        { value: 'SUN', label: '일요일' },
    ];

    // 요일 매핑 객체
    const dayMapping = {
        MON: '월',
        TUE: '화',
        WED: '수',
        THU: '목',
        FRI: '금',
        SAT: '토',
        SUN: '일'
    };

    const formatTimeString = (days, startTime, endTime) => {
        if (!days.length || !startTime || !endTime) return '';

        // 요일 변환 (예: ['MON', 'THU'] -> '월,목')
        const formattedDays = days
            .map(day => dayMapping[day])
            .join(',');

        // 시간 형식 변환 (예: "14:00" -> "14:00")
        return `${formattedDays} ${startTime}~${endTime}`;
    };

    const [formData, setFormData] = useState({
        courseName: '',
        dayOfWeek: [],
        startTime: '',
        endTime: '',
        location: '',
        studentInfo: null
    });

    const [weights, setWeights] = useState({
        faceDetection: 0.2,
        faceRecognition: 0.2,
        bioActivity: 0.2,
        attention: 0.2,
        headPose: 0.2,
        excellent: 0.8,
        warning: 0.4,
        attend: 0.6,
    });

    // 실시간 검증 결과
    const validationResult = useMemo(() => {
        const errors = {};
        
        // 가중치 합계 검증
        const weightSum = (
            weights.faceDetection + 
            weights.faceRecognition + 
            weights.bioActivity + 
            weights.attention + 
            weights.headPose
        );
        
        const isWeightSumValid = Math.abs(weightSum - 1) < 0.1; // 0.1 단위 오차 허용

        if (!isWeightSumValid) {
            errors.weightSum = true;
            errors.faceDetection = true;
            errors.faceRecognition = true;
            errors.bioActivity = true;
            errors.attention = true;
            errors.headPose = true;
        }

        // 임계값 순서 검증
        if (weights.excellent <= weights.warning) {
            errors.excellent = true;
            errors.warning = true;
        }

        return {
            errors,
            weightSum,
            isValid: Object.keys(errors).length === 0
        };
    }, [weights]);

    const handleWeightChange = (field) => (value) => {
        setWeights(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleChange = (field) => (value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            studentInfo: file
        }));
    };

    const handleSubmit = async () => {
        if (!validationResult.isValid) return;

        // 필수 입력값 검증
        if (!formData.courseName || !formData.dayOfWeek.length || !formData.startTime || !formData.endTime) {
            alert('강의 이름, 요일, 시작 시간, 종료 시간은 필수 입력값입니다.');
            return;
        }

        try {
            // FormData 객체 생성
            const apiFormData = new FormData();
            
            // 파일 추가
            if (formData.studentInfo) {
                apiFormData.append('file', formData.studentInfo);
            }

            // 강의 이름
            apiFormData.append('name', formData.courseName);
            
            // 고정 값들
            apiFormData.append('group', '000');
            apiFormData.append('longitude', 0);
            apiFormData.append('latitude', 0);
            
            // 시간 문자열 생성
            const timeString = formatTimeString(
                formData.dayOfWeek,
                formData.startTime,
                formData.endTime
            );
            
            apiFormData.append('startsAt', timeString);
            apiFormData.append('endsAt', timeString);

            console.log('전송할 시간:', timeString); // 디버깅용

            const response = await authFetch('/api/api/lecture', {
                method: 'POST',
                body: apiFormData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('강의 생성 성공:', result);
                setIsOpen(false);
            } else {
                const error = await response.json();
                console.error('강의 생성 실패:', error);
                alert('강의 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 호출 에러:', error);
            alert('강의 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.popup_background}>
            <div className={styles.popup_container}>
                <div className={styles.popup_header}>
                    <h2>강의 개설하기</h2>
                    <button 
                        className={styles.close_button}
                        onClick={() => setIsOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.popup_content}>
                    <Input
                        label="강의 이름"
                        placeholder="강의 이름을 입력해주세요"
                        value={formData.courseName}
                        onChange={(e) => handleChange('courseName')(e.target.value)}
                        required
                    />

                    <div className={styles.time_select}>
                        <Select
                            label="강의 요일"
                            placeholder="요일 선택"
                            value={formData.dayOfWeek}
                            onChange={handleChange('dayOfWeek')}
                            options={dayOptions}
                            multiple={true}
                        />
                    </div>
                    <div className={styles.time_select}>
                        <Input
                            label="강의 시간(시작)"
                            placeholder="시작 시간 입력"
                            value={formData.startTime}
                            onChange={(e) => handleChange('startTime')(e.target.value)}
                            type="time"
                        />
                    </div>
                    <div className={styles.time_select}>
                        <Input
                            label="강의 시간(종료)"
                            placeholder="종료 시간 입력"
                            value={formData.endTime}
                            onChange={(e) => handleChange('endTime')(e.target.value)}
                            type="time"
                        />
                    </div>

                    <div className={styles.location_section}>
                        <Input
                            label="강의실 위치"
                            placeholder="주소를 입력해주세요"
                            value={formData.location}
                            onChange={(e) => handleChange('location')(e.target.value)}
                        />
                        <div className={styles.map_placeholder}>
                            {/* 지도 컴포넌트가 들어갈 자리 */}
                        </div>
                    </div>

                    <div className={styles.file_input}>
                        <label>학생 정보 파일</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".csv,.xlsx,.xls"
                        />
                    </div>

                    <div className={styles.weight_section}>
                        <h3>가중치 설정</h3>
                        {!validationResult.isValid && validationResult.errors.weightSum && (
                            <p className={styles.error_message}>
                                가중치의 합이 1이 되어야 합니다. (현재: {validationResult.weightSum.toFixed(2)})
                            </p>
                        )}
                        <div className={styles.weight_list}>
                            <WeightSelect 
                                label="얼굴 검출 가중치" 
                                value={weights.faceDetection}
                                onChange={handleWeightChange('faceDetection')}
                                error={validationResult.errors.faceDetection}
                            />
                            <WeightSelect 
                                label="얼굴 인식 가중치" 
                                value={weights.faceRecognition}
                                onChange={handleWeightChange('faceRecognition')}
                                error={validationResult.errors.faceRecognition}
                            />
                            <WeightSelect 
                                label="생체 활동성 가중치" 
                                value={weights.bioActivity}
                                onChange={handleWeightChange('bioActivity')}
                                error={validationResult.errors.bioActivity}
                            />
                            <WeightSelect 
                                label="주의집중 가중치" 
                                value={weights.attention}
                                onChange={handleWeightChange('attention')}
                                error={validationResult.errors.attention}
                            />
                            <WeightSelect 
                                label="머리 자세 가중치" 
                                value={weights.headPose}
                                onChange={handleWeightChange('headPose')}
                                error={validationResult.errors.headPose}
                            />
                        </div>
                    </div>

                    <div className={styles.threshold_section}>
                        <h3>임계값 설정</h3>
                        {!validationResult.isValid && validationResult.errors.excellent && (
                            <p className={styles.error_message}>
                                '최우수' 임계값은 '주의필요' 임계값보다 커야 합니다.
                            </p>
                        )}
                        <div className={styles.weight_list}>
                            <WeightSelect 
                                label="'최우수' 임계값" 
                                value={weights.excellent}
                                onChange={handleWeightChange('excellent')}
                                error={validationResult.errors.excellent}
                            />
                            <WeightSelect 
                                label="'주의필요' 임계값" 
                                value={weights.warning}
                                onChange={handleWeightChange('warning')}
                                error={validationResult.errors.warning}
                            />
                            <WeightSelect 
                                label="'출석' 임계값" 
                                value={weights.attend}
                                onChange={handleWeightChange('attend')}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.popup_footer}>
                    <button 
                        className={`${styles.submit_button} ${!validationResult.isValid ? styles.disabled : ''}`}
                        onClick={handleSubmit}
                        disabled={!validationResult.isValid}
                    >
                        강의 개설 완료하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCoursePopup;