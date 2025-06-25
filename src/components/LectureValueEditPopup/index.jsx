'use client';

import { useState, useMemo } from 'react';
import styles from './index.module.css';
import WeightSelect from '@/components/WeightSelect';

const LectureValueEditPopup = ({ setIsOpen, initialWeights, onWeightsUpdate }) => {
    const [weights, setWeights] = useState(initialWeights || {
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
        const newWeights = {
            ...weights,
            [field]: value
        };
        setWeights(newWeights);
        onWeightsUpdate(newWeights);
    };

    const handleSubmit = () => {
        if (validationResult.isValid) {
            setIsOpen(false);
        }
    };

    return (
        <div className={styles.popup_background}>
            <div className={styles.popup_container}>
                <div className={styles.popup_header}>
                    <h2>임계값 수정하기</h2>
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
                    <div className={styles.weight_section}>
                        <h3>얼굴 검출 가중치</h3>
                        {!validationResult.isValid && validationResult.errors.weightSum && (
                            <p className={styles.error_message}>
                                가중치의 합이 1이 되어야 합니다. (현재: {validationResult.weightSum.toFixed(1)})
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
                        수정 완료하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LectureValueEditPopup; 