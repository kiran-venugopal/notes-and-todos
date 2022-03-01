import { ChangeEvent, Fragment, useState } from "react";
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as CopyIcon } from "../../icons/copy.svg";
import { ReactComponent as DoneIcon } from "../../icons/done.svg";
import "./navbar.css";
import { useRecoilState } from "recoil";
import { notesState } from "../../recoil/atoms";
import useNoteUpdate from "../../hooks/useNoteUpdate";

function Navbar() {
  const [isCopied, setIsCopied] = useState(false);
  const [noteData, setNoteData] = useRecoilState(notesState);
  const [editMode, setEditMode] = useState(false);
  const updateNote = useNoteUpdate();
  const { activeNote, notes } = noteData;
  const note = notes.find((note) => note._id === activeNote);

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(note?.content || "");
    setTimeout(() => setIsCopied(false), 4000);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateNote({ _id: note?._id, name: value });
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Logo width={25} height={25} />
      </div>
      {note?._id && (
        <div className="file-name" onClick={() => setEditMode(true)}>
          {editMode ? (
            <input
              type="text"
              value={note?.name}
              autoFocus
              onFocus={(e) => e.target.select()}
              onBlur={() => setEditMode(false)}
              onChange={handleNameChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          ) : (
            <Fragment>{note?.name}.md</Fragment>
          )}
        </div>
      )}
      <button onClick={handleCopy} className="primary">
        {isCopied ? (
          <Fragment>
            <div className="icon">
              <DoneIcon width={15} height={15} />
            </div>
            Copied
          </Fragment>
        ) : (
          <Fragment>
            <div className="icon">
              <CopyIcon width={11} height={11} />
            </div>
            Copy Markdown
          </Fragment>
        )}
      </button>
    </div>
  );
}

export default Navbar;
