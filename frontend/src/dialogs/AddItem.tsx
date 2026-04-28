import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import type { Task } from '../hooks/useApi';

interface AddItemProps {
  isOpen: boolean
  onClose: () => void
  createTask: (title: string) => Promise<Task>
}

const AddItem = ({ isOpen, onClose, createTask }: AddItemProps) => {
  const [title, setTitle] = useState('');
  const handleAdd = () => {
    createTask(title);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add new task</DialogTitle>
      <DialogContent>
        <TextField
          label="Task name"
          fullWidth
          value={title}
          onChange={(e) => setTitle(() => e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItem;
