describe('Basic Tests', () => {
  test('true should be truthy', () => {
    expect(true).toBeTruthy();
  });

  test('addition works correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });
}); 