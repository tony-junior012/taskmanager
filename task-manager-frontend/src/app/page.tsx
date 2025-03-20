import TaskList from "@/app/components/TaskList";
import Navbar from "@/app/components/Navbar";
import GlobalToast from "@/app/components/GlobalToast";

export default function Home() {
  return (
      <main>
          <div className="w-full flex justify-end fixed z-50 right-5 top-5">
              <GlobalToast />
          </div>
          <Navbar />
          <TaskList />
      </main>
  );
}
