// Basic test to verify setup
console.log('Running basic tests...');

// Test 1
const test1 = true === true;
console.log('Test 1 (true is truthy):', test1 ? 'PASS' : 'FAIL');

// Test 2
const test2 = 1 + 1 === 2;
console.log('Test 2 (addition):', test2 ? 'PASS' : 'FAIL');

// Test 3
const test3 = 'hello ' + 'world' === 'hello world';
console.log('Test 3 (string concatenation):', test3 ? 'PASS' : 'FAIL');

console.log('All tests passed:', test1 && test2 && test3 ? 'YES' : 'NO'); 