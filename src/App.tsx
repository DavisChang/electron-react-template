import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import Btn from "components/Btn.tsx";
import { RootLayout, Sidebar, Content } from "@/components/AppLayout";
import { formatDateFromMs } from "@/utils/formatDate";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { FloatingNoteTitle } from "./components/FloatingNoteTitle";
import { PreviewList } from "./components/SideBar/PreviewList";

function App() {
  const [count, setCount] = useState(0);

  return (
    <RootLayout>
      <Sidebar className="p-2">
        <PreviewList className="mt-3 space-y-1" />
      </Sidebar>
      <Content className="border-l bg-zinc-900/50 border-l-white/20 ">
        <FloatingNoteTitle />
        <div>
          <div className="flex justify-center m-4">
            <a href="https://electron-vite.github.io" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>

          <h1 className="text-3xl font-bold underline">
            Electron with Vite + React {formatDateFromMs(Date.now())}
          </h1>
          <div>
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
            <Btn />
          </div>
          <p>Click on the Vite and React logos to learn more</p>

          <div>
            <MarkdownEditor />
          </div>
        </div>
      </Content>
    </RootLayout>
  );
}

export default App;
