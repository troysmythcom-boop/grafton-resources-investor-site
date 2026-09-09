import {test} from 'node:test';
import assert from 'node:assert/strict';
import {retrieve,validateQuestion,validateSubscription} from '../server-utils.mjs';
import {sources} from '../src/content.js';
test('company retrieval stays in the approved corpus and rejects unsupported topics',()=>{assert.deepEqual(retrieve('What is the weather?',sources),[]);assert.equal(retrieve('Who is Campbell?',sources)[0].id,'team');assert.equal(retrieve('公司战略',sources)[0].id,'about');assert.equal(retrieve('estructura de acciones',sources)[0].id,'shares');assert.ok(retrieve('Tell me about Grafton',sources).every(s=>s.url.startsWith('https://www.graftonresources.com/')));});
test('request boundaries enforce input size and explicit subscription consent',()=>{assert.equal(validateQuestion({question:'x'.repeat(1501)}),false);assert.equal(validateQuestion({question:'  '}),false);assert.equal(validateQuestion({question:'Tell me about Grafton'}),true);assert.equal(validateSubscription({email:'a@example.com',consent:true}),true);assert.equal(validateSubscription({email:'bad',consent:true}),false);assert.equal(validateSubscription({email:'a@example.com'}),false);});
