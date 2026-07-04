import Protected from "@/features/auth/components/Protected";
import DashBoard from "@/features/resume/pages/DashBoard";

export default function Home() {
  return (
    <><Protected><DashBoard/></Protected></>
  );
}
