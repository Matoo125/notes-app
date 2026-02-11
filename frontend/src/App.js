import './App.css';
import { useState } from 'react';

const categories = ['Personal', 'Work', 'Other'];

const initialNotes = [
  {
    'title': 'Note 1',
    'description': 'Description 1',
    'category': 'Personal'
  },
  {
    'title': 'Note 2',
    'description': 'Description 2',
    'category': 'Work'
  },
  {
    'title': 'Note 3',
    'description': 'Description 3',
    'category': 'Other'
  }
];


function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [notes, setNotes] = useState(initialNotes);
  const [editingNote, setEditingNote] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  function handleSubmit(e) {
    e.preventDefault();
    console.log(title, description, category);
    // validation title maxlength
    if (title.length > 100) {
      alert('Title must be less than 100 characters');
      return;
    }
    // validation description maxlength
    if (description.length > 500) {
      alert('Description must be less than 500 characters');
      return;
    }

    if (editingNote !== null) {
      // Update existing note
      setNotes((prevNotes) => {
        const newNotes = [...prevNotes];
        newNotes[editingNote] = { title, description, category };
        return newNotes;
      });
      setEditingNote(null);
    } else {
      setNotes([...notes, { title, description, category }]);
    }
    setTitle('');
    setDescription('');
    
  }

  function handleEdit(note) {
    console.log(note);
    const index = notes.findIndex((n) => n.title === note.title);
    setEditingNote(index);
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category);
  }

  return (
    <div className="App">
      <header className="App-header">
         Notes App
      </header>
      <div>
        <form>
          {editingNote !== null ? <h2>Edit note</h2> : <h2>Create a note</h2>}
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /> <br/>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /> <br/>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <br />
          <button onClick={handleSubmit} type="submit">Save</button>
          <button onClick={() => setEditingNote(null)}>Cancel</button>
        </form>
      </div>

      <div>
        <h2>Notes</h2>
        <hr></hr>
        {/* category filter */}
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {notes.filter((note) => categoryFilter === 'All' || note.category === categoryFilter).reverse().map((note) => (
          <div key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <p>{note.category}</p>
            <button onClick={() => setNotes(notes.filter((n) => n.title !== note.title))}>Delete</button>
            <button onClick={() => handleEdit(note)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
