const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ tasks: [] }).write();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/tasks', (req, res) => {
  const tasks = db.get('tasks').value();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = { 
    id: Date.now(), 
    title: req.body.title,
    priority: req.body.priority || 'medium',
    dueDate: req.body.dueDate || null,
    dueTime: req.body.dueTime || null,
    completed: false,
    alarmTriggered: false
  };
  db.get('tasks').push(newTask).write();
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  db.get('tasks')
    .find({ id: taskId })
    .assign(req.body)
    .write();

  res.json({ message: 'Task updated' });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  db.get('tasks').remove({ id: taskId }).write();
  res.json({ message: 'Task deleted' });
});

app.delete('/api/tasks-clear-completed', (req, res) => {
  db.get('tasks').remove({ completed: true }).write();
  res.json({ message: 'Completed tasks cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});