import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { updateNoteData } from "../APIs/note";
import { notesState } from "../recoil/atoms";
import { INote } from "../types";

export default function useNoteUpdate() {
  const setNoteData = useSetRecoilState(notesState);
  const timerRef = useRef<NodeJS.Timeout>();

  function updateNote(note: Partial<INote>) {
    let newNotes: INote[] = [];
    let updatedNote: INote = {} as INote;
    setNoteData((prev) => {
      newNotes = prev.notes.map((n) => {
        if (n.id === note?.id) {
          updatedNote = {
            ...n,
            ...note,
          };
          return updatedNote;
        }
        return n;
      });
      return {
        ...prev,
        notes: newNotes,
      };
    });
    window.localStorage.setItem("notes", JSON.stringify(newNotes));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateNoteData(updatedNote.id, updatedNote);
    }, 5000);
  }

  return updateNote;
}
