const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getAllowedRolesByPortal,
  getAllowedRolesByLoginType,
} = require("../services/authService");

test("portal role mapping is correct", () => {
  assert.deepEqual(getAllowedRolesByPortal("God"), ["God"]);
  assert.deepEqual(getAllowedRolesByPortal("Student"), ["Student"]);
  assert.deepEqual(getAllowedRolesByPortal("Staff"), ["Faculty", "Admin", "SuperAdmin", "God"]);
  assert.deepEqual(getAllowedRolesByPortal("Unknown"), []);
});

test("role login mapping is correct", () => {
  assert.deepEqual(getAllowedRolesByLoginType("God"), ["God"]);
  assert.deepEqual(getAllowedRolesByLoginType("SuperAdmin"), ["SuperAdmin"]);
  assert.deepEqual(getAllowedRolesByLoginType("Admin"), ["Admin"]);
  assert.deepEqual(getAllowedRolesByLoginType("Faculty"), ["Faculty"]);
  assert.deepEqual(getAllowedRolesByLoginType("Student"), ["Student"]);
  assert.deepEqual(getAllowedRolesByLoginType("Unknown"), []);
});
