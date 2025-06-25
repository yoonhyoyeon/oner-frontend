import ProfessorLectureInfo from '@/container/ProfessorLectureInfo';

const ProfessorLectureInfoPage = ({params}) => {
    return <ProfessorLectureInfo lectureId={params.id} />;
};

export default ProfessorLectureInfoPage;