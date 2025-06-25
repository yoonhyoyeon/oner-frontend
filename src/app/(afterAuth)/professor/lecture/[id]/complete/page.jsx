import ProfessorLectureComplete from '@/container/ProfessorLectureComplete';

export const metadata = {
    title: '강의 종료',
    description: '강의 종료 페이지',
};

const ProfessorLectureCompletePage = ({params}) => {
    return <ProfessorLectureComplete lectureId={params.id} />;
};

export default ProfessorLectureCompletePage;
