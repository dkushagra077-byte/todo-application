const assert = require('assert');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/jwt');
const { validateRegister, validateLogin, validateCreateTodo } = require('../middleware/validateMiddleware');

console.log('🧪 Starting Core Backend Verification Tests...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  // 1. Password Hashing with Bcrypt
  await asyncTest('Bcrypt correctly hashes passwords with salt', async () => {
    const plain = 'SecretPassword123';
    const hash = await bcrypt.hash(plain, 10);
    assert.notStrictEqual(plain, hash);
    assert.strictEqual(hash.startsWith('$2'), true);

    const match = await bcrypt.compare(plain, hash);
    assert.strictEqual(match, true);

    const wrongMatch = await bcrypt.compare('WrongPassword', hash);
    assert.strictEqual(wrongMatch, false);
  });

  // 2. JWT Generation and Verification
  test('JWT generates and verifies correctly', () => {
    const payload = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      name: 'Test User'
    };
    const token = generateToken(payload);
    assert.strictEqual(typeof token, 'string');
    assert.strictEqual(token.split('.').length, 3);

    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.email, payload.email);
    assert.strictEqual(decoded.name, payload.name);
  });

  // 3. Validation Middleware: Register Validation
  test('validateRegister catches missing or invalid fields', () => {
    // Missing name
    const req1 = { body: { name: 'A', email: 'valid@example.com', password: 'password123' } };
    let errorCalled = false;
    const res1 = {
      status: (code) => {
        assert.strictEqual(code, 400);
        return {
          json: (data) => {
            assert.strictEqual(data.success, false);
            errorCalled = true;
          }
        };
      }
    };
    validateRegister(req1, res1, () => {});
    assert.strictEqual(errorCalled, true);

    // Invalid email
    const req2 = { body: { name: 'Valid Name', email: 'invalid-email', password: 'password123' } };
    errorCalled = false;
    const res2 = {
      status: (code) => {
        assert.strictEqual(code, 400);
        return {
          json: (data) => {
            assert.strictEqual(data.success, false);
            errorCalled = true;
          }
        };
      }
    };
    validateRegister(req2, res2, () => {});
    assert.strictEqual(errorCalled, true);

    // Short password
    const req3 = { body: { name: 'Valid Name', email: 'valid@example.com', password: '123' } };
    errorCalled = false;
    const res3 = {
      status: (code) => {
        assert.strictEqual(code, 400);
        return {
          json: (data) => {
            assert.strictEqual(data.success, false);
            errorCalled = true;
          }
        };
      }
    };
    validateRegister(req3, res3, () => {});
    assert.strictEqual(errorCalled, true);

    // Valid registration
    const req4 = { body: { name: 'Valid Name', email: 'valid@example.com', password: 'password123' } };
    let nextCalled = false;
    validateRegister(req4, {}, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true);
  });

  // 4. Validation Middleware: Todo Validation
  test('validateCreateTodo enforces required title', () => {
    const req1 = { body: { title: '   ', description: 'Some description' } };
    let errorCalled = false;
    const res1 = {
      status: (code) => {
        assert.strictEqual(code, 400);
        return {
          json: (data) => {
            assert.strictEqual(data.success, false);
            errorCalled = true;
          }
        };
      }
    };
    validateCreateTodo(req1, res1, () => {});
    assert.strictEqual(errorCalled, true);

    const req2 = { body: { title: 'Valid Title', description: 'Valid Description' } };
    let nextCalled = false;
    validateCreateTodo(req2, {}, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true);
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
