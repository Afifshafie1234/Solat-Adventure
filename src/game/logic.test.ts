import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgress,
  isBridgeRepaired,
  validateCP1,
  validateCP2,
  validateCP3,
  validateCP4,
  validateCP5,
  validateCP6,
  isCheckpointUnlocked,
} from './logic';

test('calculateProgress calculates correctly with 0 stars', () => {
  const res = calculateProgress({});
  assert.equal(res.completedCount, 0);
  assert.equal(res.totalStars, 0);
  assert.equal(res.percent, 0);
});

test('calculateProgress calculates partial completion and stars', () => {
  const stars = { 1: 3, 2: 3, 3: 2, 4: 3 };
  const res = calculateProgress(stars);
  assert.equal(res.completedCount, 4);
  assert.equal(res.totalStars, 11);
  assert.equal(res.percent, 50); // 4 out of 8 checkpoints = 50%
});

test('isBridgeRepaired returns true only after checkpoint 4 is completed', () => {
  assert.equal(isBridgeRepaired({ 1: 3, 2: 3, 3: 3 }), false);
  assert.equal(isBridgeRepaired({ 1: 3, 2: 3, 3: 3, 4: 2 }), true);
});

test('validateCP1 validates meaning of solat sentence', () => {
  assert.equal(validateCP1('perbuatan', 'salam'), true);
  assert.equal(validateCP1('  Perbuatan ', ' SALAM '), true);
  assert.equal(validateCP1('perbuatan', 'doa'), false);
  assert.equal(validateCP1('', ''), false);
});

test('validateCP2 validates sorting of solat 5 waktu as WAJIB', () => {
  const correct = {
    'Solat 5 Waktu': 'WAJIB' as const,
    'Solat Rawatib': 'SUNAT' as const,
    'Bermain Basikal': 'HARUS' as const,
  };
  assert.equal(validateCP2(correct).isCorrect, true);

  const wrong = {
    'Solat 5 Waktu': 'SUNAT' as const,
    'Solat Rawatib': 'SUNAT' as const,
    'Bermain Basikal': 'HARUS' as const,
  };
  assert.equal(validateCP2(wrong).isCorrect, false);
});

test('validateCP3 identifies true fardhu prayers and catches trick balloons', () => {
  const allFive = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isya\''];
  const res1 = validateCP3(allFive);
  assert.equal(res1.isCorrect, true);
  assert.equal(res1.missingCount, 0);

  const withTrick = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isya\'', 'Dhuha'];
  const res2 = validateCP3(withTrick);
  assert.equal(res2.isCorrect, false);
  assert.equal(res2.wrongSelected.length, 1);

  const incomplete = ['Subuh', 'Zohor'];
  const res3 = validateCP3(incomplete);
  assert.equal(res3.isCorrect, false);
  assert.equal(res3.missingCount, 3);
});

test('validateCP4 validates rakaat matching', () => {
  const matches = {
    'Subuh': 2,
    'Zohor': 4,
    'Asar': 4,
    'Maghrib': 3,
    'Isya\'': 4,
  };
  assert.equal(validateCP4(matches).isCorrect, true);

  const wrongMatches = {
    'Subuh': 4,
    'Zohor': 4,
    'Asar': 4,
    'Maghrib': 3,
    'Isya\'': 4,
  };
  assert.equal(validateCP4(wrongMatches).isCorrect, false);
});

test('validateCP5 validates daily chronological order of prayers', () => {
  const correct = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isya\''];
  assert.equal(validateCP5(correct), true);

  const wrong = ['Zohor', 'Subuh', 'Asar', 'Maghrib', 'Isya\''];
  assert.equal(validateCP5(wrong), false);
});

test('validateCP6 checks scenario answer', () => {
  assert.equal(validateCP6('solat-segera'), true);
  assert.equal(validateCP6('terus-main'), false);
});

test('isCheckpointUnlocked checks access', () => {
  assert.equal(isCheckpointUnlocked(1, [1]), true);
  assert.equal(isCheckpointUnlocked(2, [1]), false);
  assert.equal(isCheckpointUnlocked(2, [1, 2]), true);
});
