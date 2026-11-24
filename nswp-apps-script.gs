/**
 * NSWP survey receiver (Google Apps Script, bound to the HG-2026-NSWP-Survey sheet).
 *
 * nswp-survey.html POSTs three kinds of payload to this Web App:
 *   - artist answers   -> "Responses" tab (same columns as before)
 *   - admin answers    -> "Admin responses" tab (created on first use)
 *   - type:"contact"   -> "Community chat contacts" tab (created on first use)
 *
 * Contacts are written to their own tab with no answers attached, so a
 * name/email can't be matched to a survey response.
 *
 * To update: Extensions > Apps Script, replace the code with this file,
 * then Deploy > Manage deployments > Edit > Version: New version > Deploy.
 * Editing the existing deployment keeps the same /exec URL, so the survey
 * page doesn't need to change.
 */

var ARTIST = {
  sheet: 'Responses',
  load: ['income', 'deadlines', 'isolation', 'burnout', 'benefits', 'block', 'critique'],
  tokens: ['dropin', 'oneonone', 'workshops', 'training', 'peers', 'guide']
};

var ADMIN = {
  sheet: 'Admin responses',
  load: ['workload', 'crisis', 'burnout', 'training', 'scope', 'sustain', 'funding'],
  tokens: ['asist', 'mhfa', 'peers', 'coaching', 'counselling', 'crisis', 'burnout', 'rsw', 'wellness', 'navigation']
};

var FORMAT = ['place', 'time', 'group'];
var LOAD_WORDS = ['Not much', 'Some', 'A lot'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (d.type === 'contact') {
      sheetFor(ss, 'Community chat contacts', ['Received', 'Survey', 'Name', 'Email'])
        .appendRow([new Date(), streamName(d.stream), clip(d.name, 120), clip(d.email, 200)]);
    } else if (d.stream === 'admin') {
      writeAnswers(ss, d, ADMIN, true);
    } else {
      writeAnswers(ss, d, ARTIST, false);
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function writeAnswers(ss, d, cfg, isAdmin) {
  var head = ['Received', 'Submitted date', 'Roles', 'Disciplines'];
  if (isAdmin) head.push('Organization size', 'Years in sector');
  head.push('Region', 'Identities');
  cfg.load.forEach(function (k) { head.push('Load: ' + k); });
  head.push('Support history', 'Barriers');
  cfg.tokens.forEach(function (k) { head.push('Tokens: ' + k); });
  FORMAT.forEach(function (k) { head.push('Format: ' + k); });
  head.push('Feeling safe');
  if (isAdmin) head.push('Benefit (1-10)');
  head.push('Note');

  var row = [new Date(), d.submitted_date || '', list(d.roles), list(d.disciplines)];
  if (isAdmin) row.push(d.org_size || '', d.years_in_sector || '');
  row.push(d.region || '', list(d.identities));
  cfg.load.forEach(function (k) { var v = (d.load || {})[k]; row.push(v === undefined ? '' : (LOAD_WORDS[v] || v)); });
  row.push(d.support_history || '', list(d.barriers));
  cfg.tokens.forEach(function (k) { row.push((d.tokens || {})[k] || 0); });
  FORMAT.forEach(function (k) { row.push((d.format || {})[k] || ''); });
  row.push(list(d.safety));
  if (isAdmin) row.push(d.benefit ? Number(d.benefit) : '');
  row.push(clip(d.note, 1200));

  sheetFor(ss, cfg.sheet, head).appendRow(row);
}

function sheetFor(ss, name, head) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(head); sh.setFrozenRows(1); }
  return sh;
}

function list(a) { return Array.isArray(a) ? a.join(', ') : (a || ''); }
function clip(s, n) {
  s = String(s || '').slice(0, n);
  return /^[=+\-@]/.test(s) ? "'" + s : s; // stop text being read as a formula
}
function streamName(s) { return s === 'admin' ? 'Arts administrator' : 'Artist'; }
