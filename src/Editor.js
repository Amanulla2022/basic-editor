import React, { useEffect, useState } from "react";
import Split from "react-split";
import { nanoid } from "nanoid";
import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const Editor = () => {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  );

  const [selectedTab, setSelectedTab] = useState("write");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote = {
      id: nanoid(),
      body: "# Enter title here \n\n",
    };
    setNotes([newNote, ...notes]);
    setCurrentNoteId(newNote.id);
  };

  const updateNote = (text) => {
    setNotes(
      notes.map((note) =>
        note.id === currentNoteId ? { ...note, body: text } : note
      )
    );
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const findCurrentNote = () =>
    notes.find((note) => note.id === currentNoteId) || notes[0];

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <div className="flex w-full">
      {notes.length > 0 ? (
        <Split
          sizes={[20, 80]}
          direction="horizontal"
          className="split flex w-full"
        >
          <section className="w-1/5 bg-gray-50 flex flex-col  items-center">
            <div className=" p-8 flex gap-4 item-center justify-center">
              <h1 className="text-black text-xl font-serif uppercase">Notes</h1>
              <button
                className="w-6 h-6 flex justify-center items-center bg-blue-500 p-2 text-white rounded-full text-xl"
                onClick={createNote}
              >
                +
              </button>
            </div>
            <ul className="flex flex-col items-center">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className={`title ${
                    note.id === currentNoteId ? "selected-note" : ""
                  }`}
                  onClick={() => setCurrentNoteId(note.id)}
                >
                  <div className="flex gap-4">
                    <span className="font-semibold">
                      {note.body.split("\n")[0]}
                    </span>
                    <button
                      className=" bg-transparent border-none cursor-pointer text-red-500"
                      onClick={() => deleteNote(note.id)}
                    >
                      (X)
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <div className="w-4/5">
            <ReactMde
              value={findCurrentNote().body}
              onChange={updateNote}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(converter.makeHtml(markdown))
              }
              minPreviewHeight={80}
              minEditorHeight={80}
              heightUnits="vh"
            />
          </div>
        </Split>
      ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl uppercase underline">You have no notes</h1>
          <button
            className="text-white uppercase bg-blue-500 text-lg font-bold border-none rounded-full py-4 px-12 cursor-pointer hover:opacity-80 hover:text-blue-500 hover:bg-white"
            onClick={createNote}
          >
            Create one now
          </button>
        </div>
      )}
    </div>
  );
};

export default Editor;
