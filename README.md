# ON:ER (ONline attendance Recognition) 🎓

> CV 기반 실시간 온라인 강의 부정 출결 감지 및 출결 자동화 시스템

## 🏆 수상 내역
**2025 세종대학교 AI/SW 해커톤 금상(2위)** - CV기반 실시간 온라인 강의 부정 출결 감지 및 출결 자동화 시스템(ON:ER) (2025.06.26)

## 📋 프로젝트 개요

ON:ER은 **Computer Vision 기술을 활용한 실시간 온라인 강의 출결 관리 시스템**입니다. 기존 온라인 강의의 출결 관리 문제점을 해결하기 위해 얼굴 인식, 생체 활동성 감지, 주의집중도 분석 등 다양한 AI 기술을 통합하여 정확하고 공정한 출결 관리를 제공합니다.

### 🎯 주요 기능

#### 🔍 **실시간 CV 기반 출결 감지**
- **얼굴 검출 및 인식**: 실시간 얼굴 검출을 통한 본인 확인
- **생체 활동성 감지**: 사진이나 영상 대신 실제 사람인지 확인
- **주의집중도 분석**: 시선 추적 및 집중도 측정
- **머리 자세 분석**: 수업 참여도 및 집중 상태 모니터링

#### 👨‍🏫 **교수 기능**
- **강의 개설 및 관리**: 강의 생성, 학생 등록, 시간표 관리
- **실시간 강의 진행**: WebRTC 기반 실시간 화상 강의
- **가중치 및 임계값 설정**: CV 분석 요소별 가중치 조정 가능
- **출결 현황 모니터링**: 실시간 학생 출결 상태 확인
- **돌발 퀴즈 기능**: 수업 중 랜덤 퀴즈를 통한 참여도 확인

#### 🎓 **학생 기능**
- **강의 참여**: 실시간 화상 강의 참여
- **출결 현황 확인**: 개인 출결 기록 및 통계 조회
- **강의 결과 분석**: 수업별 CV 분석 결과 그래프 확인
- **이의신청**: 출결 결과에 대한 이의신청 기능

#### 📊 **데이터 분석 및 시각화**
- **Recharts 기반 차트**: 얼굴 검출, 집중도, 생체 활동성 데이터 시각화
- **실시간 진도율 표시**: 원형 프로그레스바로 학습 진도 확인
- **출결 통계**: 개인별, 강의별 출결 현황 분석

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: JavaScript
- **UI Library**: React 19.0.0
- **Styling**: CSS Modules, Pretendard Font
- **State Management**: Zustand 5.0.5
- **Charts**: Recharts 3.0.0
- **Real-time**: Socket.io-client 4.8.1
- **Media Streaming**: WebRTC (Browser Native API)
- **Animation**: React-countup, React-circular-progressbar

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Next.js with Turbopack

## 🏗 프로젝트 구조

```
oner-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (beforeAuth)/       # 인증 전 페이지 (로그인, 회원가입)
│   │   └── (afterAuth)/        # 인증 후 페이지
│   │       ├── student/        # 학생 관련 페이지
│   │       └── professor/      # 교수 관련 페이지
│   │           ├── student/    # 학생 관련 페이지
│   │           └── professor/  # 교수 관련 페이지
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── NavigationBar/      # 네비게이션 바
│   │   ├── CircularProgressBar/ # 원형 진도율 표시
│   │   ├── StudentLectureResult/ # 강의 결과 차트
│   │   ├── AddCoursePopup/     # 강의 개설 팝업
│   │   └── LectureValueEditPopup/ # 가중치 설정 팝업
│   ├── container/              # 페이지 컨테이너 컴포넌트
│   │   ├── SignIn/             # 로그인 페이지
│   │   ├── SignUp/             # 회원가입 페이지
│   │   ├── StudentCheck/       # 학생 출결 현황
│   │   ├── ProfessorCourses/   # 교수 강의 목록
│   │   ├── ProfessorLecture/   # 교수 강의 진행
│   │   └── StudentLecture/     # 학생 강의 참여
│   ├── store/                  # Zustand 상태 관리
│   ├── utils/                  # 유틸리티 함수
│   └── styles/                 # 전역 스타일
├── public/                     # 정적 파일
│   ├── images/                 # 이미지 리소스
│   └── fonts/                  # 폰트 파일
└── package.json
```

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 요구사항

- Node.js 18.0.0 이상
- 웹캠 및 마이크 접근 권한
- 최신 브라우저 (Chrome, Firefox, Safari, Edge)

## 🎨 주요 UI/UX 특징

### 디자인 시스템
- **컬러 팔레트**: 보라색 계열 (#615BF7) 브랜드 컬러
- **타이포그래피**: Pretendard 폰트 사용
- **모던 UI**: 깔끔한 카드 디자인과 그림자 효과

### 사용자 경험
- **직관적인 네비게이션**: 역할별 맞춤형 사이드바
- **실시간 피드백**: 즉시 반영되는 상태 변화
- **시각적 데이터**: 차트와 그래프를 통한 정보 전달
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🔧 핵심 기능 구현

### 1. CV 기반 출결 감지
```javascript
// 가중치 설정 예시
const weights = {
    faceDetection: 0.2,    // 얼굴 검출
    faceRecognition: 0.2,  // 얼굴 인식
    bioActivity: 0.2,      // 생체 활동성
    attention: 0.2,        // 주의집중도
    headPose: 0.2,         // 머리 자세
};
```

### 2. 실시간 통신
- **WebRTC**: P2P 화상 통신
- **Socket.io**: 실시간 메시징 및 상태 동기화
- **미디어 스트림**: 카메라/마이크 제어

### 3. 상태 관리
- **Zustand**: 경량 상태 관리 라이브러리
- **전역 상태**: 사용자 인증, 미디어 스트림 상태
- **로컬 상태**: 컴포넌트별 UI 상태

## 📈 성능 최적화

- **Next.js App Router**: 최신 라우팅 시스템
- **Turbopack**: 빠른 개발 빌드
- **코드 스플리팅**: 페이지별 번들 분리
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **CSS Modules**: 스타일 격리 및 최적화

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---