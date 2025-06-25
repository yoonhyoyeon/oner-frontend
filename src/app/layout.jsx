import "@/styles/globals.css";
import "@/styles/variables.css";

export const metadata = {
  title: {
    template: "%s | ON:ER",
    default: "Loadnig..."
  },
  description: '온라인 강의 출결관리 시스템',
}
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
