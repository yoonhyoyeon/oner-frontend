'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useMediaStore } from '@/store/mediaStore';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function ProfessorLecture({lectureId}) {
  // Zustand 전역 상태
  const myStream = useMediaStore(state => state.stream);
  const videoOn = useMediaStore(state => state.videoOn);
  const audioOn = useMediaStore(state => state.audioOn);
  const setAudioOn = useMediaStore(state => state.setAudioOn);
  const setVideoOn = useMediaStore(state => state.setVideoOn);
  const setStream = useMediaStore(state => state.setStream);
  const clearStream = useMediaStore(state => state.clearStream);
  
  const mainVideoRef = useRef(null);
  const router = useRouter();
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceCandidateQueueRef = useRef([]); // ICE candidate 큐
  const processingOfferRef = useRef(false); // Offer 처리 중 플래그
  
  // 상태 관리
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [lectureTime, setLectureTime] = useState(0);
  const [remoteStream, setRemoteStream] = useState(null);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 강의 시간 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setLectureTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebRTC 및 Socket.io 초기화
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        console.log('미디어 스트림 획득 시작...');
        
        // 1. 캠 켜기
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        console.log('미디어 스트림 획득 성공:', stream);
        
        setStream(stream);
        localStreamRef.current = stream;
        
        // 비디오/오디오 상태 초기화
        setVideoOn(true);
        setAudioOn(true);

        // Socket.io 연결 - test.html과 동일한 방식
        const socket = io('http://13.238.227.125:3000', {
          transports: ['websocket'],
          forceNew: true,
          reconnection: false
        });
        socketRef.current = socket;

        // PeerConnection 생성
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = peerConnection;

        // 로컬 스트림 트랙 추가
        stream.getTracks().forEach(track => {
          console.log(`트랙 추가 (${track.kind}):`, track);
          peerConnection.addTrack(track, stream);
        });

        // 2. ICE 후보 전송
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('ICE candidate 전송:', event.candidate);
            socket.emit('ice-candidate', { 
              from: socket.id,
              candidate: event.candidate
            });
          }
        };

        // 3. 상대 영상 수신
        peerConnection.ontrack = (event) => {
          console.log('🎥 원격 스트림 수신:', event.streams[0]);
          setRemoteStream(event.streams[0]);
        };

        // ICE candidate 큐 처리 함수
        const processQueuedIceCandidates = async () => {
          console.log(`큐에 저장된 ICE candidate ${iceCandidateQueueRef.current.length}개 처리 중...`);
          const candidates = [...iceCandidateQueueRef.current];
          iceCandidateQueueRef.current = [];
          
          for (const candidate of candidates) {
            try {
              await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
              console.log('큐에서 ICE candidate 추가 성공');
            } catch (e) {
              console.error('큐에서 ICE candidate 추가 오류:', e);
            }
          }
        };

        // 방 입장 - 클라이언트 타입 명시
        socket.emit('joinRoom', { 
          room: 'testRoom',
          clientType: 'web_client',
          deviceType: 'browser'
        });
        console.log('joinRoom 이벤트 전송 (web_client)');

        socket.on('connect', () => {
          console.log('✅ Socket 연결 성공, ID:', socket.id);
        });

        socket.on('connect_error', (error) => {
          console.error('❌ Socket 연결 에러:', error);
        });

        socket.on('disconnect', (reason) => {
          console.log('🔌 Socket 연결 해제:', reason);
        });

        // 모든 이벤트 로깅
        const originalEmit = socket.emit;
        socket.emit = function(...args) {
          console.log('📤 Socket 이벤트 전송:', args[0], args[1]);
          return originalEmit.apply(this, args);
        };

        // 4. 서버로부터 Offer 수신 처리 (서버가 먼저 Offer를 보내는 경우)
        socket.on('offer', async (data) => {
          console.log('서버로부터 Offer 수신:', data);
          
          // 중복 처리 방지
          if (processingOfferRef.current) {
            console.warn('이미 Offer 처리 중 - 무시');
            return;
          }
          
          try {
            processingOfferRef.current = true;
            
            // 시그널링 상태 확인
            console.log('Offer 수신 시 시그널링 상태:', peerConnection.signalingState);
            
            // stable 상태이고 remote description이 없는 경우만 처리
            if (peerConnection.signalingState === 'stable' && !peerConnection.remoteDescription) {
              console.log('Offer 처리 시작...');
              
              await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
              console.log('✅ Remote description 설정 완료');
              
              // 큐에 저장된 ICE candidate 처리
              await processQueuedIceCandidates();
              
              // 상태 재확인
              if (peerConnection.signalingState === 'have-remote-offer') {
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                
                socket.emit('answer', { 
                  to: data.from,
                  from: socket.id,
                  fromType: 'web_client',
                  sdp: peerConnection.localDescription
                });
                console.log('✅ Answer 전송 완료');
              } else {
                console.warn('Answer 생성 불가 - 시그널링 상태:', peerConnection.signalingState);
              }
            } else {
              console.warn('Offer 무시 - 상태:', {
                signalingState: peerConnection.signalingState,
                hasRemoteDescription: !!peerConnection.remoteDescription
              });
            }
          } catch (error) {
            console.error('❌ Offer 처리 오류:', error);
          } finally {
            processingOfferRef.current = false;
          }
        });

        // Answer 수신 처리
        socket.on('answer', async (data) => {
          console.log('Answer 수신:', data);
          try {
            // 시그널링 상태 확인
            console.log('Answer 수신 시 시그널링 상태:', peerConnection.signalingState);
            
            // have-local-offer 상태이고 remote description이 없는 경우만 처리
            if (peerConnection.signalingState === 'have-local-offer' && !peerConnection.remoteDescription) {
              console.log('Answer 처리 시작...');
              
              await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
              console.log('✅ Remote description 설정 완료');
              
              // 큐에 저장된 ICE candidate 처리
              await processQueuedIceCandidates();
              console.log('✅ Answer 처리 완료');
            } else {
              console.warn('Answer 무시 - 상태:', {
                signalingState: peerConnection.signalingState,
                hasRemoteDescription: !!peerConnection.remoteDescription
              });
            }
          } catch (error) {
            console.error('❌ Answer 처리 오류:', error);
          }
        });

        // ICE Candidate 수신 처리
        socket.on('ice-candidate', async (data) => {
          console.log('ICE candidate 수신:', data);
          if (data.candidate) {
            try {
              // remote description이 설정되었는지 확인
              if (peerConnection.remoteDescription) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                console.log('ICE candidate 추가 성공');
              } else {
                console.log('Remote description 대기 중 - ICE candidate 큐에 저장');
                iceCandidateQueueRef.current.push(data.candidate);
              }
            } catch (e) {
              console.error('ICE candidate error:', e);
            }
          }
        });

        // 5. Offer 시작 (방 참여 후 약간 기다리고 실행)
        const createOffer = async () => {
          try {
            console.log('Offer 생성 시작');
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', { 
              from: socket.id,
              fromType: 'web_client',
              sdp: peerConnection.localDescription
            });
            console.log('Offer 전송 완료:', peerConnection.localDescription);
          } catch (error) {
            console.error('Offer 생성 오류:', error);
          }
        };

        // 페이지 로드 후 약간 기다리고 Offer 시작
        setTimeout(() => {
          createOffer();
        }, 2000);

        // 방 사용자 목록 수신
        socket.on('usersInRoom', (users) => {
          console.log('방 사용자 목록:', users);
          setConnectedUsers(users || []);
        });

        // 사용자 퇴장
        socket.on('userDisconnected', (userId) => {
          console.log(`사용자 퇴장: ${userId}`);
          setConnectedUsers(prev => prev.filter(user => user !== userId));
        });

        // 채팅 메시지 수신
        socket.on('chatMessage', (data) => {
          setChatMessages(prev => [...prev, data]);
        });

        // 연결 상태 모니터링
        peerConnection.onconnectionstatechange = () => {
          console.log('🔗 WebRTC 연결 상태:', peerConnection.connectionState);
          if (peerConnection.connectionState === 'connected') {
            console.log('✅ WebRTC 연결 성공!');
          } else if (peerConnection.connectionState === 'failed') {
            console.log('❌ WebRTC 연결 실패');
          }
        };

        peerConnection.oniceconnectionstatechange = () => {
          console.log('🧊 ICE 연결 상태:', peerConnection.iceConnectionState);
        };

        peerConnection.onsignalingstatechange = () => {
          console.log('📡 시그널링 상태:', peerConnection.signalingState);
        };

      } catch (error) {
        console.error('초기화 오류:', error);
      }
    };

    initializeConnection();

    return () => {
      console.log('컴포넌트 언마운트 - 연결 정리');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      // ICE candidate 큐 및 플래그 정리
      iceCandidateQueueRef.current = [];
      processingOfferRef.current = false;
      clearStream();
    };
  }, [lectureId, setStream, clearStream]);

  // 메인 비디오 스트림 설정
  useEffect(() => {
    if (mainVideoRef.current && myStream) {
      console.log('메인 비디오에 스트림 설정:', myStream);
      mainVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

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
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    router.push(`/professor/lecture/${lectureId}/complete`);
  };

  // 채팅 메시지 전송
  const handleSendMessage = () => {
    if (messageInput.trim() && socketRef.current) {
      const messageData = {
        room: 'testRoom',
        sender: '교수',
        message: messageInput.trim(),
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour12: true, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      socketRef.current.emit('chatMessage', messageData);
      setChatMessages(prev => [...prev, messageData]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 학생 목록 생성 (원격 비디오 + 플레이스홀더)
  const students = [];
  
  // 실제 연결된 학생들 (원격 스트림이 있으면 표시)
  if (remoteStream) {
    students.push({
      id: 'remote_student',
      name: '학생 1',
      isConnected: true,
      stream: remoteStream
    });
  }
  
  // 나머지는 플레이스홀더로 채우기 (최대 16개)
  while (students.length < 16) {
    students.push({
      id: `placeholder_${students.length}`,
      name: '이름',
      isConnected: false,
      stream: null
    });
  }

  return (
    <div className={styles.container}>
      {/* 좌측: 강의/학생 비디오 */}
      <div className={styles.left}>
        {/* 강의명, 시간 */}
        <div className={styles.lectureHeader}>
          <span className={styles.lectureTitle}>최신기술콜로키움</span>
          <span className={styles.lectureTime}>{formatTime(lectureTime)}</span>
        </div>
        {/* 상단: 학생 비디오 (가로 스크롤) */}
        <div className={styles.studentsRow}>
          {students.map((student) => (
            <div key={student.id} className={styles.studentBox}>
              {student.isConnected && student.stream ? (
                <video
                  key={`video_${student.id}`}
                  autoPlay
                  playsInline
                  muted={false}
                  className={styles.studentVideo}
                  onLoadedMetadata={() => {
                    console.log(`비디오 메타데이터 로드됨: ${student.id}`);
                  }}
                  onError={(e) => {
                    console.error(`비디오 에러 ${student.id}:`, e);
                  }}
                  ref={(el) => {
                    if (el && student.stream) {
                      console.log(`비디오 요소에 스트림 설정: ${student.id}`, student.stream);
                      el.srcObject = student.stream;
                    }
                  }}
                />
              ) : (
                <div className={styles.profilePlaceholder}>{student.name}</div>
              )}
              <div className={styles.studentName}>{student.name}</div>
            </div>
          ))}
        </div>
        {/* 메인 강의(교수님) 비디오 */}
        <div className={styles.lectureBox}>
          {myStream ? (
            <video
              ref={mainVideoRef}
              autoPlay
              playsInline
              muted
              className={styles.professorVideo}
              style={{ display: videoOn ? 'block' : 'none' }}
            />
          ) : null}
          {!myStream || !videoOn ? (
            <div className={styles.professorVideoPlaceholder}>
              <div className={styles.placeholderText}>교수님 화면</div>
            </div>
          ) : null}
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
          <div className={styles.participantHeader}>참석자 ({connectedUsers.length}명)</div>
          <ul className={styles.participantList}>
            <li><span className={styles.participantNumber}>1</span>교수 (나)</li>
            {connectedUsers.map((user, idx) => {
              if (user !== socketRef.current?.id) {
                return (
                  <li key={user}>
                    <span className={styles.participantNumber}>{idx + 2}</span>
                    학생 {idx + 1}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>채팅</div>
          <div className={styles.chatMessages}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={styles.chatMessage}>
                <div className={styles.chatMessageHeader}>
                  <span className={styles.chatMessageSender}>{msg.sender}</span>
                  <span className={styles.chatMessageTime}>{msg.timestamp}</span>
                </div>
                <span className={styles.chatMessageText}>{msg.message}</span>
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <input 
              type="text" 
              placeholder="메시지를 입력하세요..." 
              className={styles.messageInput}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}