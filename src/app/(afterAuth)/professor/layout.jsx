import { ProfessorNavigationBar } from "@/components/NavigationBar";

export default function ProfessorLayout({ children }) {
  return (
    <>
        <ProfessorNavigationBar />
        <div style={{ flex: 1 }}>
            {children}
        </div>
    </>
  );
}
