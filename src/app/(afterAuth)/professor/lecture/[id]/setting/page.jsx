import ProfessorLectureSetting from '@/container/ProfessorLectureSetting';

export const metadata = {
    title: '강의 설정',
    description: '강의 설정 페이지',
};

const ProfessorLectureSettingPage = ({params}) => {
    return <ProfessorLectureSetting lectureId={params.id} />;
};

export default ProfessorLectureSettingPage;