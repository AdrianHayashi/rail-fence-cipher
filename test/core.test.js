import { test } from 'node:test';
import assert from 'node:assert/strict';

import { encode, decode } from '../src/index.js';

test('encode with one rail returns original message', () => {
  assert.equal(encode('HELLO', 1), 'HELLO');
});

test('encode with three rails matches the classic example', () => {
  assert.equal(encode('WEAREDISCOVEREDFLEEATONCE', 3), 'WECRLTEERDSOEEFEAOCAIVDEN');
});

test('encode empty message returns empty string', () => {
  assert.equal(encode('', 4), '');
});

test('decode reverses encode for a short message', () => {
  const plaintext = 'SECRETMESSAGE';
  const ciphertext = encode(plaintext, 3);
  assert.equal(decode(ciphertext, 3), plaintext);
});

test('encode handles message shorter than rail count', () => {
  assert.equal(encode('AB', 5), 'AB');
  assert.equal(decode('AB', 5), 'AB');
});

test('decode with one rail returns original message', () => {
  assert.equal(decode('ANYTHING', 1), 'ANYTHING');
});

test('encode with rails larger than message length is reversible', () => {
  const plaintext = 'ZEBRA';
  const ciphertext = encode(plaintext, 10);
  assert.equal(decode(ciphertext, 10), plaintext);
});

test('encode and decode preserve spaces and punctuation', () => {
  const plaintext = 'Attack at dawn! 123';
  const ciphertext = encode(plaintext, 4);
  assert.equal(decode(ciphertext, 4), plaintext);
});

test('encode with two rails alternates characters', () => {
  assert.equal(encode('ABCDE', 2), 'ACEBD');
});

test('decode with two rails reverses alternation', () => {
  assert.equal(decode('ACEBD', 2), 'ABCDE');
});

test('non-integer rail count throws RangeError', () => {
  assert.throws(() => encode('HELLO', 2.5), RangeError);
  assert.throws(() => decode('HELLO', 2.5), RangeError);
});

test('rail count less than one throws RangeError', () => {
  assert.throws(() => encode('HELLO', 0), RangeError);
  assert.throws(() => decode('HELLO', 0), RangeError);
  assert.throws(() => encode('HELLO', -2), RangeError);
  assert.throws(() => decode('HELLO', -2), RangeError);
});
