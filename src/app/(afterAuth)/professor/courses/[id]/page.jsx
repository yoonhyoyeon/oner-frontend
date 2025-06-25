import ProfessorCcourseDetail from '@/container/ProfessorCcourseDetail';

export const metadata = {
    title: '과목 상세 페이지',
    description: '과목 상세 페이지',
};

const ProfessorCcourseDetailPage = ({params}) => {
    return <ProfessorCcourseDetail courseId={params.id} />;
};

export default ProfessorCcourseDetailPage;