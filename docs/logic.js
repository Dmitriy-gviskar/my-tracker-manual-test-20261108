export function addTask(tasks, title, id = crypto.randomUUID()) {
  const text = title.trim();
  if (!text) return tasks;
  return [...tasks, { id, title: text, completed: false }];
}
export function toggleTask(tasks, id) {
  return tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
}
export function deleteTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

export function selectTasks(tasks, query = '', status = 'all') {
  const text = query.trim().toLocaleLowerCase('ru-RU');
  return tasks.filter(task => task.title.toLocaleLowerCase('ru-RU').includes(text) &&
    (status === 'all' || (status === 'active' && !task.completed) || (status === 'completed' && task.completed)));
}
