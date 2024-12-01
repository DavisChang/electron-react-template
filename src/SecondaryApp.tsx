import { useEffect, useState, useRef } from "react";
import { Note } from "./shared/types";
import { formatDateFromMs } from "./utils/formatDate";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
} from "@mdxeditor/editor";
import html2pdf from "html2pdf.js";

const SecondaryApp = () => {
  const [data, setData] = useState<Note | null>(null);

  // Ref to the content you want to convert to PDF
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define the listener function
    const handleSecondaryMessage = (
      _event: Electron.IpcRendererEvent,
      note: Note
    ) => {
      setData(note);
    };

    // Add the listener
    window.ipcRenderer.on("secondary-process-message", handleSecondaryMessage);

    // Cleanup the listener when the component unmounts
    return () => {
      window.ipcRenderer.off(
        "secondary-process-message",
        handleSecondaryMessage
      );
    };
  }, []);

  const onClickDownloadPDF = () => {
    if (!contentRef.current) {
      console.error("Content ref is null");
      return;
    }

    // Configure html2pdf options
    const options = {
      margin: 10,
      filename: `${data?.title || "document"}.pdf`,
      html2canvas: {
        scale: 2, // Higher scale for better resolution
      },
      image: { type: "jpeg", quality: 0.98 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Generate the PDF from the content
    html2pdf().set(options).from(contentRef.current).save();
  };

  return (
    <>
      {data && (
        <>
          <h1>{data.title}</h1>
          <p>Update time: {formatDateFromMs(data.lastEditTime)}</p>
          <button
            className="mx-4 my-4 bg-black dark:bg-white/5"
            onClick={onClickDownloadPDF}
          >
            Download PDF
          </button>
          <hr />
          <div ref={contentRef}>
            <MDXEditor
              markdown={data.content}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
              ]}
              contentEditableClassName="outline-none min-h-screen max-w-none text-lg px-8 py-5 caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-['['] prose-code:after:content-[']']"
            />
          </div>
        </>
      )}
    </>
  );
};

export default SecondaryApp;
