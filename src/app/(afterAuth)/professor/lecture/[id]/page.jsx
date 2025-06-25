import ProfessorLecture from '@/container/ProfessorLecture';

export const metadata = {
    title: '강의 페이지',
    description: '강의 페이지',
};

export default function ProfessorLecturePage({params}) {
    return <ProfessorLecture lectureId={params.id} />;
}