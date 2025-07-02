'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import { useMediaStore } from '@/store/mediaStore';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

// WebRTC 상태 열거형
const WebRTCState = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
};

export default function ProfessorLecture({ lectureId }) {
  const router = useRouter();
  
  // WebRTC 상태 관리
  const [state, setState] = useState(WebRTCState.IDLE);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // 미디어 관련 refs
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteRenderersRef = useRef({});
  const peerConnectionsRef = useRef({});
  
  // 소켓 관련 refs
  const socketRef = useRef(null);
  const room = 'testRoom';
  const lastUsersUpdateTimeRef = useRef(null);
  const lastUsersListHashRef = useRef(null);
  const processingUsersRef = useRef(new Set());
  
  // UI 상태
  const [remoteStreams, setRemoteStreams] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [lectureTime, setLectureTime] = useState(0);
  const [isDisposed, setIsDisposed] = useState(false);

  // 시간 포맷 함수
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 상태 업데이트 함수
  const updateState = (newState, message = null, error = null) => {
    if (isDisposed) return;
    
    setState(newState);
    if (message) setStatusMessage(message);
    if (error) setErrorMessage(error);
    console.log(`WebRTC 상태 변경: ${newState}, 메시지: ${message}`);
  };

  // 로컬 스트림 초기화
  const initializeLocalStream = async () => {
    try {
      console.log('로컬 스트림 초기화 시작');

      const constraints = {
        audio: true,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
          facingMode: 'user'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (stream) {
        console.log('로컬 스트림 생성 성공');
        console.log('비디오 트랙 수:', stream.getVideoTracks().length);
        console.log('오디오 트랙 수:', stream.getAudioTracks().length);

        // 비디오 트랙 상태 확인
        const videoTracks = stream.getVideoTracks();
        videoTracks.forEach(track => {
          console.log(`비디오 트랙 상태 - enabled: ${track.enabled}, kind: ${track.kind}`);
        });

        setIsVideoEnabled(stream.getVideoTracks().length > 0);
        setIsMicEnabled(stream.getAudioTracks().length > 0);

        // 로컬 비디오에 스트림 할당
        await assignStreamToRenderer();
      }
    } catch (error) {
      console.log('로컬 스트림 초기화 오류:', error);
      
      // 단순한 제약조건으로 재시도
      try {
        console.log('단순한 제약조건으로 재시도');
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        
        localStreamRef.current = stream;
        setIsVideoEnabled(stream.getVideoTracks().length > 0);
        setIsMicEnabled(stream.getAudioTracks().length > 0);
        
        await assignStreamToRenderer();
        console.log('단순한 제약조건으로 재시도 성공');
      } catch (error2) {
        console.log('재시도도 실패:', error2);
        setIsVideoEnabled(false);
        setIsMicEnabled(false);
        throw new Error('카메라 접근 실패');
      }
    }
  };

  // 로컬 스트림을 비디오 요소에 할당
  const assignStreamToRenderer = async () => {
    try {
      if (!localVideoRef.current) {
        console.log('❌ 비디오 요소가 null - 스트림 할당 불가');
        return;
      }

      if (!localStreamRef.current) {
        console.log('❌ 로컬 스트림이 null - 스트림 할당 불가');
        return;
      }

      if (isDisposed) {
        console.log('❌ 컴포넌트가 disposed 상태 - 스트림 할당 불가');
        return;
      }

      console.log('🎥 비디오 요소에 로컬 스트림 할당 시작');

      // 기존 할당 해제
      localVideoRef.current.srcObject = null;
      await new Promise(resolve => setTimeout(resolve, 50));

      // 새로 할당
      localVideoRef.current.srcObject = localStreamRef.current;
      console.log('🎥 비디오 요소에 로컬 스트림 할당 완료');

      // 할당 검증
      await new Promise(resolve => setTimeout(resolve, 200));
      if (localVideoRef.current.srcObject) {
        console.log('✅ 비디오 스트림 할당 성공 확인');
      } else {
        console.log('❌ 비디오 스트림 할당 실패 - 재시도');
        await new Promise(resolve => setTimeout(resolve, 100));
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    } catch (error) {
      console.log('❌ 스트림 할당 중 오류:', error);
    }
  };

  // 소켓 연결
  const connectToSocket = async () => {
    try {
      console.log('소켓 연결 시작');

      // 기존 소켓 연결 정리
      if (socketRef.current) {
        console.log('기존 소켓 연결 정리');
        socketRef.current.disconnect();
        socketRef.current = null;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const socket = io('http://13.238.227.125:3000', {
        transports: ['websocket']
      });
      
      socketRef.current = socket;

      // 연결 상태 모니터링
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('서버 연결 타임아웃'));
        }, 10000);

        socket.on('connect', () => {
          clearTimeout(timeout);
          console.log('=== 소켓 연결 성공 ===');
          console.log('Socket ID:', socket.id);
          console.log('방 이름:', room);

          // 방에 참여 - 서버에서 기대하는 형식으로 전송
          const joinData = { 
            room: room,
            clientType: 'web_client',
            deviceType: 'browser'
          };
          socket.emit('joinRoom', joinData);
          console.log('joinRoom 이벤트 전송 완료:', joinData);
          resolve();
        });

        socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.log('소켓 연결 오류:', error);
          reject(new Error(`서버 연결 실패: ${error}`));
        });

        socket.on('disconnect', (reason) => {
          console.log('소켓 연결 해제:', reason);
        });

        setupSocketEventHandlers(socket);

        // 연결 후 3초 뒤에 수동으로 다른 클라이언트 찾기 시도
        setTimeout(() => {
          console.log('🔍 수동 연결 시도 - 다른 클라이언트 찾기');
          socket.emit('getUsers', { room: room });
          socket.emit('getRoomUsers', { room: room });
          socket.emit('listUsers', { room: room });
        }, 3000);
      });
    } catch (error) {
      console.log('소켓 연결 설정 오류:', error);
      throw new Error(`서버 연결 실패: ${error}`);
    }
  };

  // 소켓 이벤트 핸들러 설정
  const setupSocketEventHandlers = (socket) => {
      // 사용자 목록 수신
  socket.on('usersInRoom', async (users) => {
    console.log('=== 방 사용자 목록 수신 ===');
    console.log('데이터:', users);
    console.log('데이터 타입:', typeof users);
    console.log('내 소켓 ID:', socket.id);
    console.log('현재 PeerConnection 수:', Object.keys(peerConnectionsRef.current).length);

    if (Array.isArray(users)) {
      await handleUsersInRoom(users);
    }
  });

    // Offer 수신 처리
    socket.on('offer', async (data) => {
      try {
        const { from, sdp } = data;
        console.log('📨 Offer 수신 from:', from, '- 처리 시작');

        // 기존 연결 상태 확인
        if (peerConnectionsRef.current[from]) {
          const existingPc = peerConnectionsRef.current[from];
          const state = existingPc.connectionState;
          const signalingState = existingPc.signalingState;

          console.log('🔍 기존 연결 확인 - Connection:', state, 'Signaling:', signalingState);

          // 이미 연결됐거나 연결 중인 경우 Offer 무시
          if (state === 'connected' || state === 'connecting') {
            console.log('✅ 이미 활성 연결 존재 - Offer 무시:', from, '(state:', state, ')');
            return;
          }

          // signaling 상태가 안정적이지 않으면 Offer 무시
          if (signalingState !== 'stable') {
            console.log('⚠️ Offer 무시 - 불안정한 signaling 상태:', from, '(', signalingState, ')');
            return;
          }

          // new 상태에서 잠시 대기
          if (state === 'new') {
            console.log('⏳ 연결 상태 new - 0.3초 대기 후 재확인:', from);
            await new Promise(resolve => setTimeout(resolve, 300));
            const newState = existingPc.connectionState;
            if (newState !== 'new') {
              console.log('🔄 대기 후 상태 변경됨 - Offer 무시:', from, '(', newState, ')');
              return;
            }
          }

          // 실패한 연결만 정리
          if (state === 'failed' || state === 'closed' || state === 'disconnected') {
            console.log('🧹 실패한 연결 정리:', from, '(state:', state, ')');
            removePeerConnection(from);
            await new Promise(resolve => setTimeout(resolve, 100));
            await createPeerConnection(from, false);
          }
        } else {
          console.log('🔄 Offer용 새 연결 생성:', from);
          await createPeerConnection(from, false);
        }

        const peerConnection = peerConnectionsRef.current[from];
        if (peerConnection) {
          // 최종 상태 확인
          const state = peerConnection.connectionState;
          const signalingState = peerConnection.signalingState;
          console.log('📊 Offer 처리 전 상태 - Connection:', state, 'Signaling:', signalingState);

          // Remote description이 이미 설정되어 있는 경우 무시
          if (peerConnection.remoteDescription) {
            console.log('⚠️ Remote description이 이미 설정됨 - 무시');
            return;
          }

          // signaling state가 stable인 경우만 처리
          if (signalingState !== 'stable') {
            console.log('⚠️ Offer 무시 - signaling 상태가 stable이 아님:', signalingState);
            return;
          }

          await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          if (socket && socket.connected) {
            socket.emit('answer', {
              to: from,
              from: socket.id,
              sdp: answer
            });
          }

          console.log('✅ Answer 전송 완료 to:', from);
        }
      } catch (error) {
        console.log('❌ Offer 처리 오류:', error);
      }
    });

    // Answer 수신 처리
    socket.on('answer', async (data) => {
      try {
        const { from, sdp } = data;
        console.log('Answer 수신 from:', from);

        if (peerConnectionsRef.current[from]) {
          const peerConnection = peerConnectionsRef.current[from];
          const state = peerConnection.connectionState;
          const signalingState = peerConnection.signalingState;

          console.log('Answer 처리 - Connection 상태:', state, 'Signaling 상태:', signalingState);

          // Remote description이 이미 설정되어 있는지 확인
          if (peerConnection.remoteDescription) {
            console.log('Answer 무시 - Remote description이 이미 설정됨');
            return;
          }

          // signaling state가 have-local-offer인 경우만 답변 설정
          if (signalingState === 'have-local-offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
            console.log('Answer 설정 완료');
          } else {
            console.log('Answer 무시 - 잘못된 signaling 상태:', signalingState);
          }
        } else {
          console.log('Answer 무시 - Peer connection 없음:', from);
        }
      } catch (error) {
        console.log('Answer 처리 오류:', error);
      }
    });

    // ICE candidate 수신 처리
    socket.on('ice-candidate', async (data) => {
      try {
        const { from, candidate } = data;
        console.log('ICE candidate 수신 from:', from);

        if (peerConnectionsRef.current[from]) {
          const peerConnection = peerConnectionsRef.current[from];

          // Remote description이 설정되어 있는지 확인
          if (!peerConnection.remoteDescription) {
            console.log('ICE candidate 무시 - Remote description이 null');
            return;
          }

          if (candidate.candidate && candidate.candidate.length > 0) {
            const iceCandidate = new RTCIceCandidate(candidate);
            await peerConnection.addIceCandidate(iceCandidate);
            console.log('ICE candidate 추가 완료');
          }
        } else {
          console.log('ICE candidate 무시 - Peer connection 없음:', from);
        }
      } catch (error) {
        console.log('ICE candidate 처리 오류:', error);
      }
    });

    // 사용자 퇴장 처리
    socket.on('userDisconnected', (userId) => {
      removePeerConnection(userId);
    });

    // 추가 이벤트 리스닝 (서버에서 다른 이벤트명 사용 가능성)
    socket.on('userJoined', (data) => {
      console.log('🎉 새 사용자 입장:', data);
      // 새 사용자와 연결 시도
      if (data && data.userId && data.userId !== socket.id) {
        setTimeout(async () => {
          await createPeerConnection(data.userId, true);
        }, 500);
      }
    });

    socket.on('roomUsers', (users) => {
      console.log('📋 roomUsers 이벤트:', users);
      if (Array.isArray(users)) {
        handleUsersInRoom(users);
      }
    });

    socket.on('userList', (users) => {
      console.log('📋 userList 이벤트:', users);
      if (Array.isArray(users)) {
        handleUsersInRoom(users);
      }
    });

    // 모든 소켓 이벤트 로깅
    const originalOn = socket.on;
    socket.on = function(event, handler) {
      const wrappedHandler = (...args) => {
        console.log(`📥 Socket 이벤트 수신: ${event}`, args);
        return handler(...args);
      };
      return originalOn.call(this, event, wrappedHandler);
    };

    // 모든 소켓 emit 로깅
    const originalEmit = socket.emit;
    socket.emit = function(event, ...args) {
      console.log(`📤 Socket 이벤트 전송: ${event}`, args);
      return originalEmit.call(this, event, ...args);
    };
  };

  // 사용자 목록 처리
  const handleUsersInRoom = async (users) => {
    // 사용자 목록의 해시값 생성 (중복 방지)
    const usersString = users.join(',');
    const currentHash = usersString.hashCode || usersString.length.toString();

    // 이벤트 디바운싱
    const now = Date.now();
    if ((lastUsersUpdateTimeRef.current && (now - lastUsersUpdateTimeRef.current) < 1000) ||
        (lastUsersListHashRef.current && lastUsersListHashRef.current === currentHash)) {
      console.log('⏰ usersInRoom 이벤트 무시 - 중복 이벤트 또는 동일한 사용자 목록');
      return;
    }

    lastUsersUpdateTimeRef.current = now;
    lastUsersListHashRef.current = currentHash;

    console.log('=== 방 사용자 목록 수신 ===');
    console.log('데이터:', users);
    console.log('해시:', currentHash);

    setUserCount(users.length);

    for (const user of users) {
      const userId = user.toString();

      // 자신은 제외
      if (userId === socketRef.current?.id) {
        continue;
      }

      // 이미 처리 중인 사용자인지 확인
      if (processingUsersRef.current.has(userId)) {
        console.log('⚠️ 이미 처리 중인 사용자:', userId, '- 스킵');
        continue;
      }

      // 중복 생성 방지
      if (peerConnectionsRef.current[userId]) {
        const existingPc = peerConnectionsRef.current[userId];
        const state = existingPc.connectionState;
        const signalingState = existingPc.signalingState;

        // 이미 연결됐거나 연결 중인 경우 스킵
        if (state === 'connected' || state === 'connecting' || signalingState !== 'stable') {
          console.log('✅ 이미 활성 연결 존재:', userId, '(state:', state, 'signaling:', signalingState, ')');
          continue;
        }

        // 오래된 연결은 정리
        console.log('🧹 오래된 연결 정리:', userId, '(state:', state, ')');
        removePeerConnection(userId);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('🆕 P2P 연결 생성:', userId);
      processingUsersRef.current.add(userId);

      try {
        await createPeerConnection(userId, true);
      } finally {
        processingUsersRef.current.delete(userId);
      }
    }
  };

  // PeerConnection 생성
  const createPeerConnection = async (userId, isOffer) => {
    try {
      // 중복 생성 방지
      if (peerConnectionsRef.current[userId]) {
        console.log('⚠️ Peer connection 이미 존재함:', userId, '- 무시');
        return;
      }

      console.log('🔄 Peer connection 생성 시작:', userId, '(isOffer:', isOffer, ')');

      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionsRef.current[userId] = peerConnection;

      // 로컬 스트림 추가
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStreamRef.current);
        });
      }

      // 이벤트 핸들러 설정
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && event.candidate.candidate.length > 0 && 
            socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('ice-candidate', {
            to: userId,
            candidate: event.candidate
          });
        }
      };

      peerConnection.ontrack = (event) => {
        console.log('🎥 ontrack 이벤트 발생 from:', userId, 'streams:', event.streams.length);
        if (event.streams && event.streams.length > 0) {
          console.log('🎥 원격 스트림 수신 from:', userId);
          console.log('📺 스트림 트랙 정보:', event.streams[0].getTracks().map(t => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState
          })));
          
          setRemoteStreams(prev => {
            const newStreams = {
              ...prev,
              [userId]: event.streams[0]
            };
            console.log('🔄 원격 스트림 상태 업데이트:', Object.keys(newStreams));
            return newStreams;
          });
        } else {
          console.log('⚠️ ontrack 이벤트에 스트림이 없음 from:', userId);
        }
      };

      // 연결 상태 모니터링
      peerConnection.onconnectionstatechange = () => {
        console.log('🔗', userId, 'WebRTC 연결 상태:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          console.log('✅', userId, 'WebRTC 연결 성공!');
        } else if (peerConnection.connectionState === 'failed') {
          console.log('❌', userId, 'WebRTC 연결 실패');
        }
      };

      // Offer 생성
      if (isOffer && socketRef.current && socketRef.current.connected) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current.emit('offer', {
          to: userId,
          sdp: offer
        });
        console.log('✅ Offer 전송 완료 to:', userId);
      }
    } catch (error) {
      console.log('Peer connection 생성 오류:', error);
    }
  };

  // PeerConnection 제거
  const removePeerConnection = async (userId) => {
    try {
      if (peerConnectionsRef.current[userId]) {
        peerConnectionsRef.current[userId].close();
        delete peerConnectionsRef.current[userId];
      }

      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });

      setUserCount(Object.keys(peerConnectionsRef.current).length + 1);
    } catch (error) {
      console.log('Peer connection 제거 오류:', error);
    }
  };

  // WebRTC 초기화
  const initialize = async () => {
    try {
      // 이미 초기화 중이거나 연결된 상태면 무시
      if (state === WebRTCState.INITIALIZING || state === WebRTCState.CONNECTED) {
        console.log('이미 초기화 중이거나 연결됨 - 무시');
        return;
      }

      setIsDisposed(false);
      console.log('🚀 WebRTC 초기화 시작');

      // 기존 연결 정리
      await cleanupWithoutDisposing();

      updateState(WebRTCState.INITIALIZING, '카메라 접근 중...');

      // 로컬 스트림 초기화
      await initializeLocalStream();

      updateState(WebRTCState.INITIALIZING, '서버 연결 중...');

      // 소켓 연결
      if (localStreamRef.current) {
        await connectToSocket();
        updateState(WebRTCState.CONNECTED, '연결 완료');

        // 연결 완료 후 렌더러 강제 새로고침
        setTimeout(async () => {
          await refreshLocalRenderer();
        }, 500);
      } else {
        updateState(WebRTCState.ERROR, null, '로컬 스트림을 생성할 수 없습니다');
      }
    } catch (error) {
      console.log('WebRTC 초기화 오류:', error);
      updateState(WebRTCState.ERROR, null, `초기화 실패: ${error.message}`);
    }
  };

  // 렌더러 새로고침
  const refreshLocalRenderer = async () => {
    try {
      console.log('🔄 렌더러 강제 새로고침 시작');
      await assignStreamToRenderer();
      console.log('🔄 렌더러 강제 새로고침 완료');
    } catch (error) {
      console.log('렌더러 새로고침 오류:', error);
    }
  };

  // 마이크 토글
  const toggleMicrophone = async () => {
    try {
      if (localStreamRef.current && !isDisposed) {
        const newMicState = !isMicEnabled;
        setIsMicEnabled(newMicState);
        localStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = newMicState;
        });
        console.log('마이크', newMicState ? '켜짐' : '꺼짐');
      }
    } catch (error) {
      console.log('마이크 토글 오류:', error);
    }
  };

  // 카메라 토글
  const toggleCamera = async () => {
    try {
      if (localStreamRef.current && !isDisposed) {
        const newVideoState = !isVideoEnabled;
        setIsVideoEnabled(newVideoState);
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.enabled = newVideoState;
        });
        console.log('카메라', newVideoState ? '켜짐' : '꺼짐');
      } else if (!isDisposed) {
        // 스트림이 없으면 재시작
        await restartLocalStream();
      }
    } catch (error) {
      console.log('카메라 토글 오류:', error);
    }
  };

  // 로컬 스트림 재시작
  const restartLocalStream = async () => {
    try {
      if (isDisposed) return;

      console.log('로컬 스트림 재시작 시작');
      updateState(WebRTCState.INITIALIZING, '비디오 재시작 중...');

      // 기존 스트림 정리
      if (localStreamRef.current) {
        console.log('기존 스트림 정리');
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }

      // 비디오 요소 초기화
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 새 스트림 생성
      await initializeLocalStream();

      // 기존 peer connection들에 새 스트림 추가
      if (localStreamRef.current) {
        console.log('기존 peer connection들에 새 스트림 추가');
        for (const peerConnection of Object.values(peerConnectionsRef.current)) {
          try {
            const senders = peerConnection.getSenders();
            for (const sender of senders) {
              if (sender.track) {
                peerConnection.removeTrack(sender);
              }
            }

            localStreamRef.current.getTracks().forEach(track => {
              peerConnection.addTrack(track, localStreamRef.current);
            });
          } catch (error) {
            console.log('Peer connection 스트림 업데이트 오류:', error);
          }
        }
      }

      updateState(WebRTCState.CONNECTED, '비디오 재시작 완료');
      console.log('로컬 스트림 재시작 완료');
    } catch (error) {
      console.log('로컬 스트림 재시작 오류:', error);
      updateState(WebRTCState.ERROR, null, `스트림 재시작 실패: ${error.message}`);
    }
  };

  // 정리 (disposed 상태 유지하지 않음)
  const cleanupWithoutDisposing = async () => {
    try {
      console.log('🧹 재초기화용 정리 시작');

      // 소켓 연결 정리
      if (socketRef.current) {
        try {
          socketRef.current.disconnect();
          socketRef.current = null;
          console.log('소켓 연결 정리 완료');
        } catch (error) {
          console.log('소켓 연결 정리 오류:', error);
        }
      }

      // Peer connection 정리
      for (const pc of Object.values(peerConnectionsRef.current)) {
        try {
          pc.close();
        } catch (error) {
          console.log('Peer connection 종료 오류:', error);
        }
      }
      peerConnectionsRef.current = {};

      // 로컬 스트림 정리
      if (localStreamRef.current) {
        try {
          localStreamRef.current.getTracks().forEach(track => track.stop());
          localStreamRef.current = null;
        } catch (error) {
          console.log('로컬 스트림 정리 오류:', error);
        }
      }

      // 상태 초기화
      setState(WebRTCState.IDLE);
      setStatusMessage('');
      setErrorMessage(null);
      setUserCount(1);
      setIsMicEnabled(true);
      setIsVideoEnabled(true);
      setRemoteStreams({});

      console.log('🧹 재초기화용 정리 완료');
    } catch (error) {
      console.log('재초기화용 정리 중 오류:', error);
    }
  };

  // 완전 정리
  const cleanup = async () => {
    try {
      setIsDisposed(true);
      console.log('🔚 WebRTC 정리 시작');

      // 서버에 연결 종료 알림
      if (socketRef.current && socketRef.current.connected) {
        try {
          console.log('📤 서버에 연결 종료 알림 전송');
          socketRef.current.emit('leaveRoom', {
            room: room,
            userId: socketRef.current.id
          });

          socketRef.current.emit('userLeaving', {
            room: room,
            userId: socketRef.current.id
          });

          await new Promise(resolve => setTimeout(resolve, 300));
          console.log('✅ 서버 종료 알림 전송 완료');
        } catch (error) {
          console.log('❌ 서버 종료 알림 전송 오류:', error);
        }
      }

      await cleanupWithoutDisposing();
      console.log('WebRTC 정리 완료');
    } catch (error) {
      console.log('정리 중 오류:', error);
    }
  };

  // 강의 종료
  const handleHangup = async () => {
    await cleanup();
    router.push(`/professor/lecture/${lectureId}/complete`);
  };

  // 채팅 메시지 전송
  const handleSendMessage = () => {
    if (messageInput.trim() && socketRef.current) {
      const messageData = {
        room: room,
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

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    initialize();

    // 강의 시간 타이머
    const timer = setInterval(() => {
      setLectureTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      cleanup();
    };
  }, [lectureId]);

  // 채팅 메시지 수신
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('chatMessage', (data) => {
        setChatMessages(prev => [...prev, data]);
      });
    }
  }, [socketRef.current]);

  // 학생 목록 생성
  const students = [];
  
  // 실제 연결된 학생들
  Object.entries(remoteStreams).forEach(([userId, stream], index) => {
    if (stream) {
      students.push({
        id: userId,
        name: `학생 ${index + 1}`,
        isConnected: true,
        stream: stream
      });
    }
  });
  
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

        {/* 상태 표시 */}
        {state === WebRTCState.INITIALIZING && (
          <div className={styles.statusMessage}>
            {statusMessage}
          </div>
        )}
        
        {state === WebRTCState.ERROR && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

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
                      console.log(`비디오 요소에 스트림 설정: ${student.id}`);
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
          {localStreamRef.current && isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={styles.professorVideo}
            />
          ) : (
            <div className={styles.professorVideoPlaceholder}>
              <div className={styles.placeholderText}>교수님 화면</div>
            </div>
          )}
        </div>

        {/* 하단 컨트롤 */}
        <div className={styles.controls}>
          <button 
            className={`${styles.controlBtn} ${!isMicEnabled ? styles.disabled : ''}`}
            onClick={toggleMicrophone}
          >
            🎤
          </button>
          <button 
            className={`${styles.controlBtn} ${!isVideoEnabled ? styles.disabled : ''}`}
            onClick={toggleCamera}
          >
            📹
          </button>
          <button className={styles.hangupBtn} onClick={handleHangup}>
            📞
          </button>
        </div>
      </div>

      {/* 우측: 채팅 */}
      <div className={styles.right}>
        <div className={styles.chatHeader}>
          <span>채팅</span>
          <span className={styles.userCount}>참여자 {userCount}명</span>
        </div>
        
        <div className={styles.chatMessages}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={styles.chatMessage}>
              <div className={styles.chatSender}>{msg.sender}</div>
              <div className={styles.chatText}>{msg.message}</div>
              <div className={styles.chatTime}>{msg.timestamp}</div>
            </div>
          ))}
        </div>
        
        <div className={styles.chatInput}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={handleSendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
}