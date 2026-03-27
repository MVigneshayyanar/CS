const test = require("node:test");
const assert = require("node:assert/strict");
const { buildGeneratedPassword } = require("../services/godService");

test("generated password utility works as fallback", () => {
  const password = buildGeneratedPassword();
  assert.equal(password.length, 12);
  assert.ok(typeof password === "string");
});

test("generated password changes between calls", () => {
  const first = buildGeneratedPassword();
  const second = buildGeneratedPassword();
  assert.notEqual(first, second);
});

