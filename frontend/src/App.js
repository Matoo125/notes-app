import './App.css';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Alert,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';

function fetchRemoteNotes() {
  // TODO: Implement API call
  return fetch('https://698ca6e221a248a273623a71.mockapi.io/api/note').then((response) => response.json());
}

function saveRemoteNote(note) {
  // TODO: Implement API call
  return fetch('https://698ca6e221a248a273623a71.mockapi.io/api/note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  }).then((response) => response.json());
}

function updateRemoteNote(note) {
  // TODO: Implement API call
  return fetch(`https://698ca6e221a248a273623a71.mockapi.io/api/note/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  }).then((response) => response.json());
}

function deleteRemoteNote(id) {
  // TODO: Implement API call
  return fetch(`https://698ca6e221a248a273623a71.mockapi.io/api/note/${id}`, {
    method: 'DELETE',
  }).then((response) => response.json());
}


const categories = ['Personal', 'Work', 'Other'];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load notes from API on component mount
  useEffect(() => {
    fetchRemoteNotes()
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setLoading(false);
      });
  }, []);
  
  function handleSubmit(e) {
    e.preventDefault();
    console.log(title, description, category);
    
    // Reset errors
    setTitleError('');
    setDescriptionError('');
    
    // validation title maxlength
    if (title.length > 100) {
      setTitleError('Title must be less than 100 characters');
      return;
    }
    // validation description maxlength
    if (description.length > 500) {
      setDescriptionError('Description must be less than 500 characters');
      return;
    }

    if (editingNote !== null) {
      // Update existing note
      const updatedNote = { title, description, category };
      updateRemoteNote({ ...notes[editingNote], ...updatedNote })
        .then(data => {
          setNotes((prevNotes) => {
            const newNotes = [...prevNotes];
            newNotes[editingNote] = data;
            return newNotes;
          });
          setEditingNote(null);
          setTitle('');
          setDescription('');
        })
        .catch(error => {
          console.error('Error updating note:', error);
        });
    } else {
      // Create new note
      saveRemoteNote({ title, description, category })
        .then(data => {
          setNotes([...notes, data]);
          setTitle('');
          setDescription('');
        })
        .catch(error => {
          console.error('Error saving note:', error);
        });
    }
    
  }

  function handleEdit(note) {
    console.log(note);
    const index = notes.findIndex((n) => n.id === note.id);
    setEditingNote(index);
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category);
  }

  function handleDelete(noteId) {
    deleteRemoteNote(noteId)
      .then(() => {
        setNotes(notes.filter((n) => n.id !== noteId));
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Notes App
      </Typography>
      
      <Box component="form" sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {editingNote !== null ? 'Edit note' : 'Create a note'}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!titleError}
              helperText={titleError}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!descriptionError}
              helperText={descriptionError}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit}
                type="submit"
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Notes
        </Typography>
        
        <FormControl sx={{ mb: 3, minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Filter by Category"
          >
            <MenuItem value="All">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">Loading notes...</Typography>
            </Grid>
          ) : (
            notes.filter((note) => categoryFilter === 'All' || note.category === categoryFilter).reverse().map((note, index) => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {note.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {note.description}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {note.category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(note.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(note)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
    </ThemeProvider>
  );
}

export default App;
