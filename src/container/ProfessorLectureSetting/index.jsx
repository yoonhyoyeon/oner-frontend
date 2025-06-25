'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { useMediaStore } from '@/store/mediaStore';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import LectureValueEditPopup from '@/components/LectureValueEditPopup';
import { useUserStore } from '@/store/userStore';

const userName = '000교수님';
const lectureTitle = '최신기술콜로키움';
const professor = '교수님';

export default function ProfessorLectureSetting({lectureId}) {
  const router = useRouter();
  const videoRef = useRef(null);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isValueEditOpen, setIsValueEditOpen] = useState(false);
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

  // Zustand 전역 상태
  const { user } = useUserStore();
  const stream = useMediaStore((state) => state.stream);
  const setStream = useMediaStore((state) => state.setStream);
  const clearStream = useMediaStore((state) => state.clearStream);
  const audioOn = useMediaStore((state) => state.audioOn);
  const setAudioOn = useMediaStore((state) => state.setAudioOn);
  const videoOn = useMediaStore((state) => state.videoOn);
  const setVideoOn = useMediaStore((state) => state.setVideoOn);

  // 장치 목록 불러오기
  useEffect(() => {
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
      setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
    }
    getDevices();
  }, []);

  // 장치 선택 시 스트림 연결
  useEffect(() => {
    if (!selectedAudio && !selectedVideo) return;
    async function getStream() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        clearStream();
      }
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: selectedAudio ? { deviceId: { exact: selectedAudio } } : false,
          video: selectedVideo ? { deviceId: { exact: selectedVideo } } : false,
        });
        setStream(newStream);
        setAudioOn(!!selectedAudio);
        setVideoOn(!!selectedVideo);
      } catch (e) {
        alert('장치 접근에 실패했습니다.');
      }
    }
    getStream();
    // eslint-disable-next-line
  }, [selectedAudio, selectedVideo]);

  // stream이 바뀔 때마다 videoRef에 srcObject 할당
  useEffect(() => {
    if (videoRef.current) {
      if (stream && videoOn && stream.getVideoTracks().length > 0) {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, videoOn]);

  // 오디오/비디오 토글
  const handleAudioToggle = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setAudioOn(track.enabled);
    });
  };
  const handleVideoToggle = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setVideoOn(track.enabled);
    });
  };

  // 가중치 수정 핸들러
  const handleWeightsUpdate = (newWeights) => {
    setWeights(newWeights);
  };

  return (
    <div className={styles.container}>
      {/* 좌측 상단 데코 */}
      <img src="/images/logo/logo.png" alt="logo" width={100} className={styles.logo}/>

      {/* 중앙 비디오/프로필 카드 */}
      <div className={styles.centerArea}>
        <div className={styles.videoArea}>
          <div className={styles.videoCard}>
            {videoOn && stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={styles.video}
                style={{ background: '#181a2a', borderRadius: 12 }}
              />
            ) : (
              <div className={styles.profileArea}>
                <img
                  src="/images/icons/user.png"
                  alt="프로필"
                  className={styles.profileImg}
                />
                <div className={styles.userName}>{user?.name}</div>
              </div>
            )}
            <div className={styles.statusBar}>
              <button
                className={`${styles.statusBtn} ${!audioOn ? styles.muted : ''}`}
                onClick={handleAudioToggle}
                type="button"
                disabled={!stream}
              >
                <img src={audioOn ? "/images/icons/audio_on.png" : "/images/icons/audio_off.png"} alt="마이크" />
                {audioOn ? '음소거' : '음소거 해제'}
              </button>
              <button
                className={`${styles.statusBtn} ${!videoOn ? styles.muted : ''}`}
                onClick={handleVideoToggle}
                type="button"
                disabled={!stream}
              >
                <img src={videoOn ? "/images/icons/video_on.png" : "/images/icons/video_off.png"} alt="비디오" />
                {videoOn ? '비디오 중지' : '비디오 사용'}
              </button>
            </div>
          </div>
          <div className={styles.selectArea}>
            <select
              className={styles.select}
              value={selectedAudio}
              onChange={e => setSelectedAudio(e.target.value)}
            >
              <option value="">🎤 오디오 선택</option>
              {audioDevices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || '마이크'}</option>
              ))}
            </select>
            <select
              className={styles.select}
              value={selectedVideo}
              onChange={e => setSelectedVideo(e.target.value)}
            >
              <option value="">📷 카메라 선택</option>
              {videoDevices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || '카메라'}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.infoArea}>
          <div>
            <div className={styles.lectureTitle}>{lectureTitle}</div>
            <div className={styles.professor}>{professor}</div>
          </div>
          <div className={styles.buttonGroup}>
            <Input label="온라인 확인 주기(분)" placeholder="온라인 확인 주기 입력" type="number" />
            <button
              className={styles.settingBtn}
              onClick={() => setIsValueEditOpen(true)}
            >
              임계값 및 가중치 수정
            </button>
            <button
              className={styles.enterBtn}
              onClick={() => router.push(`/professor/lecture/${lectureId}`)}
            >
              입장하기
            </button>
          </div>
        </div>
      </div>

      {isValueEditOpen && (
        <LectureValueEditPopup
          setIsOpen={setIsValueEditOpen}
          initialWeights={weights}
          onWeightsUpdate={handleWeightsUpdate}
        />
      )}
    </div>
  );
}