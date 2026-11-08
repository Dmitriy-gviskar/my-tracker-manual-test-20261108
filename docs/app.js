import { addTask, toggleTask, deleteTask, selectTasks } from './logic.js';
const KEY = 'my-tracker:v1';
const list = document.querySelector('#tasks');
const input = document.querySelector('#new-task');
const message = document.querySelector('#message');
let tasks = [];
let query = '';
let status = 'all';
try {
  const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  if (!Array.isArray(saved) || saved.some(t => !t || typeof t.id !== 'string' || typeof t.title !== 'string' || typeof t.completed !== 'boolean')) throw new Error('Invalid task data');
  tasks = saved;
} catch { message.textContent = 'Не удалось прочитать сохранённые задачи. Исходные данные не изменены.'; }
function update(next) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { message.textContent = 'Не удалось сохранить задачи. Проверь доступность хранилища браузера.'; return; }
  tasks = next;
  message.textContent = '';
  render();
}
function render() {
  list.replaceChildren();
  const visible = selectTasks(tasks, query, status);
  document.querySelector('#visible-count').textContent = `Видимых: ${visible.length}`;
  for (const task of visible) {
    const row = document.createElement('li');
    row.className = `task${task.completed ? ' done' : ''}`;
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox'; check.checked = task.completed;
    check.addEventListener('change', () => update(toggleTask(tasks, task.id)));
    const text = document.createElement('span'); text.textContent = task.title;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Удалить';
    remove.setAttribute('aria-label', `Удалить ${task.title}`);
    remove.addEventListener('click', () => update(deleteTask(tasks, task.id)));
    label.append(check, text); row.append(label, remove); list.append(row);
  }
  document.querySelector('#counter').textContent = `Всего: ${tasks.length} · Активных: ${tasks.filter(t => !t.completed).length} · Выполненных: ${tasks.filter(t => t.completed).length}`;
  document.querySelector('#empty').hidden = visible.length > 0;
  document.querySelector('#empty').textContent = tasks.length ? 'По этому запросу ничего не найдено.' : 'Пока задач нет. Добавь первую.';
}
document.querySelector('#add-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!input.value.trim()) { message.textContent = 'Введи название задачи.'; return; }
  update(addTask(tasks, input.value)); input.value = ''; input.focus();
});
document.querySelector('#search').addEventListener('input', event => { query = event.target.value; render(); });
for (const button of document.querySelectorAll('[data-status]')) {
  button.addEventListener('click', () => {
    status = button.dataset.status;
    for (const item of document.querySelectorAll('[data-status]')) item.setAttribute('aria-pressed', String(item === button));
    render();
  });
}
render();
