import { execSync } from 'child_process';

describe('CLI', () => {
  it('should show help when no arguments provided', () => {
    expect(() => {
      execSync('node bin/statsim --help', { stdio: 'pipe' });
    }).not.toThrow();
  });

  it('should show version', () => {
    const output = execSync('node bin/statsim --version', {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    expect(output.trim()).toBe('1.0.0');
  });
});
