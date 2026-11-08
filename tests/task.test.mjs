import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addTask, toggleTask, deleteTask, selectTasks } from '../docs/logic.js';
test('adds a trimmed task without changing original', () => { const before=[]; const after=addTask(before,' Купить блокнот ','one'); assert.deepEqual(after,[{id:'one',title:'Купить блокнот',completed:false}]); assert.equal(before.length,0); });
test('rejects an empty or whitespace title', () => { const before=[]; assert.equal(addTask(before,'','one'),before); assert.equal(addTask(before,'   ','two'),before); });
test('toggles only the requested task and can toggle back', () => { const before=addTask(addTask([],'One','one'),'Two','two'); const after=toggleTask(before,'one'); assert.equal(after[0].completed,true); assert.equal(after[1].completed,false); assert.equal(before[0].completed,false); assert.equal(toggleTask(after,'one')[0].completed,false); });
test('deletes only the requested id', () => { const before=addTask(addTask([],'One','one'),'Two','two'); assert.deepEqual(deleteTask(before,'two'),[before[0]]); assert.equal(before.length,2); });

const sample = [{id:'book',title:'Купить книгу',completed:true},{id:'plan',title:'Написать план',completed:false}];
test('search ignores Cyrillic case', () => assert.deepEqual(selectTasks(sample,'КНИГУ'),[sample[0]]));
test('empty search returns all tasks', () => {assert.deepEqual(selectTasks(sample,''),sample);assert.deepEqual(selectTasks(sample,'   '),sample);});
test('status selects the right tasks', () => {assert.deepEqual(selectTasks(sample,'','active'),[sample[1]]);assert.deepEqual(selectTasks(sample,'','completed'),[sample[0]]);});
test('search and status apply together without changing data', () => {assert.deepEqual(selectTasks(sample,'КНИГУ','active'),[]);assert.deepEqual(selectTasks(sample,'КНИГУ','completed'),[sample[0]]);assert.equal(sample.length,2);});
