'use client';

import { useRef, useEffect } from 'react';
import styles from './index.module.css';
import { useMediaStore } from '@/store/mediaStore';
import { useRouter } from 'next/navigation';

const students = [
  { id: 'me', name: '나', isMe: true },
  { id: 's1', name: '이름' },
  { id: 's2', name: '이름' },
  { id: 's3', name: '이름' },
  { id: 's4', name: '이름' },
  { id: 's5', name: '이름' },
  { id: 's6', name: '이름' },
  { id: 's7', name: '이름' },
  { id: 's8', name: '이름' },
  { id: 's9', name: '이름' },
  { id: 's10', name: '이름' },
  { id: 's11', name: '이름' },
  { id: 's12', name: '이름' },
  { id: 's13', name: '이름' },
  { id: 's14', name: '이름' },
  { id: 's15', name: '이름' },
  { id: 's16', name: '이름' },
  // ...더 많은 학생
];

const participants = Array.from({ length: 16 }, (_, i) => `참석자 이름`);

export default function StudentLecture() {
  // Zustand 전역 상태
  const myStream = useMediaStore(state => state.stream);
  const videoOn = useMediaStore(state => state.videoOn);
  const audioOn = useMediaStore(state => state.audioOn);
  const setAudioOn = useMediaStore(state => state.setAudioOn);
  const setVideoOn = useMediaStore(state => state.setVideoOn);
  const clearStream = useMediaStore(state => state.clearStream);
  const myVideoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (myVideoRef.current && myStream && videoOn) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream, videoOn]);

  // 오디오/비디오 토글
  const handleAudioToggle = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setAudioOn(track.enabled);
    });
  };
  const handleVideoToggle = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setVideoOn(track.enabled);
    });
  };
  const handleHangup = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop();
      });
      clearStream();
    }
    router.push('/student/courses');
  };

  return (
    <div className={styles.container}>
      {/* 좌측: 강의/학생 비디오 */}
      <div className={styles.left}>
        {/* 상단: 학생 비디오 (가로 스크롤) */}
         {/* 강의명, 시간 */}
         <div className={styles.lectureHeader}>
          <span className={styles.lectureTitle}>최신기술콜로키움</span>
          <span className={styles.lectureTime}>05:25</span>
        </div>
        <div className={styles.studentsRow}>
            {students.map((student, idx) => (
              <div key={student.id} className={styles.studentBox}>
                {student.isMe ? (
                  myStream && videoOn ? (
                    <video
                      ref={myVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={styles.studentVideo}
                    />
                  ) : (
                    <div className={styles.profilePlaceholder}>나</div>
                  )
                ) : (
                  <div className={styles.profilePlaceholder}>{student.name}</div>
                )}
                <div className={styles.studentName}>{student.name}</div>
              </div>
            ))}
        </div>
        {/* 메인 강의(교수님) 비디오 */}
        <div className={styles.lectureBox}>
          {/* 실제로는 교수님 stream이 들어가야 함 */}
          <div className={styles.professorVideoPlaceholder}></div>
        </div>
        {/* 하단 컨트롤 */}
        <div className={styles.controls}>
          <button
            className={`${styles.statusBtn} ${!audioOn ? styles.muted : ''}`}
            onClick={handleAudioToggle}
            type="button"
            disabled={!myStream}
          >
            <img src={audioOn ? "/images/icons/audio_on.png" : "/images/icons/audio_off.png"} alt="음소거" />
            {audioOn ? '음소거 해제' : '음소거'}
          </button>
          <button
            className={`${styles.statusBtn} ${!videoOn ? styles.muted : ''}`}
            onClick={handleVideoToggle}
            type="button"
            disabled={!myStream}
          >
            <img src={videoOn ? "/images/icons/video_on.png" : "/images/icons/video_off.png"} alt="비디오" />
            {videoOn ? '비디오 중지' : '비디오 사용'}
          </button>
          <button className={styles.hangupBtn} onClick={handleHangup}>
            <img src="/images/icons/call.png" alt="통화 종료" />
          </button>
        </div>
      </div>
      {/* 우측: 참석자 목록 & 채팅 */}
      <div className={styles.right}>
        <div className={styles.participantPanel}>
            <div className={styles.participantHeader}>참석자</div>
            <ul className={styles.participantList}>
                {participants.map((name, idx) => (
                <li key={idx}><span className={styles.participantNumber}>{idx + 1}</span>{name}</li>
                ))}
            </ul>
            </div>
            <div className={styles.chatPanel}>
                <div className={styles.chatHeader}>채팅</div>
                <div className={styles.chatMessages}>
                    {/* 채팅 메시지들이 여기에 표시됩니다 */}
                    <div className={styles.chatMessage}>
                        <div className={styles.chatMessageHeader}>
                            <span className={styles.chatMessageSender}>이름</span>
                            <span className={styles.chatMessageTime}>PM 04:00</span>
                        </div>
                        <span className={styles.chatMessageText}>메시지</span>
                    </div>
                    <div className={styles.chatMessage}>
                        <div className={styles.chatMessageHeader}>
                            <span className={styles.chatMessageSender}>이름</span>
                            <span className={styles.chatMessageTime}>PM 04:00</span>
                        </div>
                        <span className={styles.chatMessageText}>메시지</span>
                    </div>
                    <div className={styles.chatMessage}>
                        <div className={styles.chatMessageHeader}>
                            <span className={styles.chatMessageSender}>이름</span>
                            <span className={styles.chatMessageTime}>PM 04:00</span>
                        </div>
                        <span className={styles.chatMessageText}>메시지</span>
                    </div>
                    <div className={styles.chatMessage}>
                        <div className={styles.chatMessageHeader}>
                            <span className={styles.chatMessageSender}>이름</span>
                            <span className={styles.chatMessageTime}>PM 04:00</span>
                        </div>
                        <span className={styles.chatMessageText}>메시지</span>
                    </div>
                    <div className={styles.chatMessage}>
                        <div className={styles.chatMessageHeader}>
                            <span className={styles.chatMessageSender}>이름</span>
                            <span className={styles.chatMessageTime}>PM 04:00</span>
                        </div>
                        <span className={styles.chatMessageText}>메시지</span>
                    </div>
                    <div className={styles.chatMessage}>
                        <div className={styles.chatMessageHeader}>
                            <span className={styles.chatMessageSender}>이름</span>
                            <span className={styles.chatMessageTime}>PM 04:00</span>
                        </div>
                        <span className={styles.chatMessageText}>메시지</span>
                    </div>
                    
                </div>
                <div className={styles.chatInput}>
                    <input 
                    type="text" 
                    placeholder="메시지를 입력하세요..." 
                    className={styles.messageInput}
                    />
                    <button className={styles.sendButton}>
                    전송
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}