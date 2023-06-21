const noteTitle = document.getElementById("noteTitle");
const noteArea = document.getElementById("noteArea");
const form = document.querySelector("form");
const userNote = document.getElementById("notes");

window.addEventListener("DOMContentLoaded", loadNotes);

form.addEventListener("submit", addNote);

function addNote(e) {
  e.preventDefault();
  const titleHandler = noteTitle.value;
  const areaHandler = noteArea.value;
  const noteID = Date.now();
  const deleteButton = `<button class="deleteButton" id="deleteButton-${noteID}">Delete</button>`;

  const lines = areaHandler.split("\n");

  const notesHTMLTemplate = lines.map((line) => {
    return `<p>${line}</p>`;
  });

  const noteHTML = `
    <div class="notes" data-noteid="${noteID}">
      <h3>${titleHandler}</h3>
      ${notesHTMLTemplate.join("")} 
      ${deleteButton}
    </div>
  `;

  userNote.insertAdjacentHTML("beforeend", noteHTML);

  const deleteButtonElement = document.getElementById(`deleteButton-${noteID}`);
  deleteButtonElement.addEventListener("click", deleteNote);

  saveNoteToLocalStorage(noteID, titleHandler, areaHandler);

  noteTitle.value = "";
  noteArea.value = "";
}

function deleteNote() {
  const noteElement = this.parentNode;
  const noteID = noteElement.getAttribute("data-noteid");
  noteElement.remove();

  deleteNoteFromLocalStorage(noteID);
}

function saveNoteToLocalStorage(noteID, title, content) {
  let notes = localStorage.getItem("notes");

  if (notes === null) {
    notes = [];
  } else {
    notes = JSON.parse(notes);
  }

  const note = {
    id: noteID,
    title: title,
    content: content,
  };

  notes.push(note);

  localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNoteFromLocalStorage(noteID) {
  let notes = localStorage.getItem("notes");

  if (notes === null) {
    return;
  }

  notes = JSON.parse(notes);

  notes = notes.filter((note) => note.id != noteID);

  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  let notes = localStorage.getItem("notes");

  if (notes === null) {
    return;
  }

  notes = JSON.parse(notes);

  notes.forEach((note) => {
    const deleteButton = `<button class="deleteButton" id="deleteButton-${note.id}">Delete</button>`;

    const lines = note.content.split("\n");

    const notesHTMLTemplate = lines.map((line) => {
      return `<p>${line}</p>`;
    });

    const noteHTML = `
      <div class="notes" data-noteid="${note.id}">
        <h3>${note.title}</h3>
        ${notesHTMLTemplate.join("")} 
        ${deleteButton}
      </div>
    `;

    userNote.insertAdjacentHTML("beforeend", noteHTML);

    const deleteButtonElement = document.getElementById(
      `deleteButton-${note.id}`
    );
    deleteButtonElement.addEventListener("click", deleteNote);
  });
}
