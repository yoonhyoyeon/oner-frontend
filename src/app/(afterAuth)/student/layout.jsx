import { StudentNavigationBar } from "@/components/NavigationBar";

export default function StudentLayout({ children }) {
  return (
    <>
        <StudentNavigationBar />
        <div style={{ flex: 1 }}>
          {children}
        </div>
    </>
  );
}
