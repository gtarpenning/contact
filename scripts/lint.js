const { execSync } = require('child_process');
const { existsSync } = require('fs');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

// Check if necessary dependencies are installed
if (
  !existsSync('./node_modules/.bin/eslint') ||
  !existsSync('./node_modules/.bin/prettier')
) {
  console.log('Installing development dependencies...');
  runCommand('npm install --save-dev eslint prettier eslint-config-prettier');
}

// Run ESLint
console.log('Running ESLint...');
runCommand('npx eslint . --fix');

// Run Prettier
console.log('Running Prettier...');
runCommand('npx prettier --write "**/*.{js,jsx,ts,tsx,json,md,css,scss}"');

console.log('Linting complete! ✨');
