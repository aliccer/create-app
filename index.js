/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const validateProjectName = require('validate-npm-package-name');
const path = require('path');
const spawn = require('cross-spawn');
const commander = require('commander');
const fs = require('fs-extra');
const envinfo = require('envinfo');
const chalk = require('chalk');
const { execSync } = require('child_process');

const { printError } = require('./utils');
const dependencyInjection = require('./dependency-injection');
const packageJson = require('./package.json');

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 8) {
  console.error(
    chalk.red(
      `You are running Node ${currentNodeVersion}.\n${packageJson.name} requires Node 8 or higher.\nPlease update your version of Node.`,
    ),
  );
  process.exit(1);
}

// These files should be allowed to remain on a failed install,
// but then silently removed during the next create.
const errorLogFilePatterns = [
  'npm-debug.log',
  'yarn-error.log',
  'yarn-debug.log',
];

let projectName;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   USER INTERACTION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => {
    projectName = name;
  })
  .option('-c, --omit-client', 'do not install client-side')
  .option('-s, --omit-server', 'do not install server-side')
  .option('-e, --examples', 'add examples')
  .option('-m, --mongodb', 'add MongoDb')
  .option('-r, --redux', 'add Redux')
  .option('--use-npm', 'use npm')
  .option('-i, --info', 'print environment debug info');

program.parse(process.argv);

const USER_OPTIONS = {
  examples: program.examples,
  mongodb: program.mongodb,
  redux: program.redux,
  client: !program.omitClient,
  server: !program.omitServer,
  useNpm: program.useNpm,
};

if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'));
  return envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmPackages: ['react', 'react-dom', 'react-scripts'],
        npmGlobalPackages: ['create-react-app'],
      },
      {
        clipboard: false,
        duplicates: true,
        showNotFound: true,
      },
    )
    .then(console.log);
}

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(packageJson.name)} ${chalk.green('<project-directory>')}`,
  );
  console.log();
  console.log('For example:');
  console.log(`${chalk.cyan(packageJson.name)} ${chalk.green('my-app')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${packageJson.name} --help`)} to see all options.`,
  );
  process.exit(1);
}

if (projectName && !USER_OPTIONS.client && !USER_OPTIONS.server) {
  printError(
    `There is nothing to install, you omitted server and client sides. Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
    true,
  );
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   HELPERS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function checkThatNpmCanReadCwd() {
  const cwd = process.cwd();
  let childOutput = null;
  try {
    // Note: intentionally using spawn over exec since
    // the problem doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
  } catch (err) {
    // Something went wrong spawning node.
    // Not great, but it means we can't do this check.
    // We might fail later on, but let's continue.
    return true;
  }
  if (typeof childOutput !== 'string') {
    return true;
  }
  const lines = childOutput.split('\n');
  // `npm config list` output includes the following line:
  // "; cwd = C:\path\to\current\dir" (unquoted)
  // I couldn't find an easier way to get it.
  const prefix = '; cwd = ';
  const line = lines.find(l => l.indexOf(prefix) === 0);
  if (typeof line !== 'string') {
    // Fail gracefully. They could remove it.
    return true;
  }
  const npmCWD = line.substring(prefix.length);
  if (npmCWD === cwd) {
    return true;
  }
  console.error(
    chalk.red(
      'Could not start an npm process in the right directory.\n\n'
        + `The current directory is: ${chalk.bold(cwd)}\n`
        + `However, a newly started npm process runs in: ${chalk.bold(
          npmCWD,
        )}\n\n`
        + 'This is probably caused by a misconfigured system terminal shell.',
    ),
  );
  if (process.platform === 'win32') {
    console.error(
      `${chalk.red('On Windows, this can usually be fixed by running:\n\n')
      }  ${chalk.cyan(
        'reg',
      )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n`
        + `  ${chalk.cyan(
          'reg',
        )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n${
          chalk.red('Try to run the above two lines in the terminal.\n')
        }${chalk.red(
          'To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/',
        )}`,
    );
  }
  return false;
}

function checkNpmVersion() {
  let hasMinNpm = false;
  let npmVersion = null;
  try {
    npmVersion = execSync('npm --version')
      .toString()
      .trim();
    hasMinNpm = semver.gte(npmVersion, '3.0.0');
  } catch (err) {
    // ignore
  }
  return {
    hasMinNpm,
    npmVersion,
  };
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);

  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`,
      )} because of npm naming restrictions:`,
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
}

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach((error) => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

// If project only contains files generated by GH, it’s safe.
// Also, if project contains remnant error logs from a previous
// installation, lets remove them now.
// We also special case IJ-based products .idea because it integrates with CRA:
function isSafeToCreateProjectIn(root, name) {
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    '.hg',
    '.hgignore',
    '.hgcheck',
    '.npmignore',
    'mkdocs.yml',
    'docs',
    '.travis.yml',
    '.gitlab-ci.yml',
    '.gitattributes',
  ];
  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validFiles.includes(file))
    // IntelliJ IDEA creates module files before CRA is launched
    .filter(file => !/\.iml$/.test(file))
    // Don't treat log files from previous installation as conflicts
    .filter(
      file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0),
    );

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`,
    );
    console.log();
    conflicts.forEach((f) => {
      console.log(`  ${f}`);
    });
    console.log();
    console.log(
      'Either try using a new directory name, or remove the files listed above.',
    );

    return false;
  }

  // Remove any remnant files from a previous installation
  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach((file) => {
    errorLogFilePatterns.forEach((errorLogFilePattern) => {
      // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(root, file));
      }
    });
  });
  return true;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   APP CREATION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createReactApp(name, useYarn) {
  try {
    execSync(`npx create-react-app ${name} ${useYarn ? '' : '--use-npm'}`, { stdio: 'inherit' });
    return true;
  } catch (err) {
    process.exit(1);
    return false;
  }
}

function installDependencies(useYarn, appDir) {
  return new Promise((resolve, reject) => {
    const args = ['install'];
    let command;

    if (useYarn) {
      command = 'yarn';

      // Explicitly set cwd() to work around issues like
      // https://github.com/facebook/create-react-app/issues/3326.
      // Unfortunately we can only do this for Yarn because npm support for
      // equivalent --prefix flag doesn't help with this issue.
      // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
      args.push('--cwd');
      args.push(appDir);
    } else {
      command = 'npm';
    }

    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      const rejection = { command: `${command} ${args.join(' ')}` };
      if (code !== 0) {
        reject(rejection);
      } else {
        resolve();
      }
    });
  });
}

function createApp(name) {
  checkAppName(name);
  const originalDirectory = process.cwd();
  const appDir = path.resolve(name);
  const appName = path.basename(appDir);

  const useYarn = USER_OPTIONS.useNpm ? false : shouldUseYarn();

  if (!useYarn) {
    const npmInfo = checkNpmVersion();
    if (!npmInfo.hasMinNpm) {
      if (npmInfo.npmVersion) {
        console.log(
          chalk.yellow(
            `You are using npm ${npmInfo.npmVersion}
             Please update to npm 3 or higher for a better, fully supported experience.\n`,
          ),
        );
        process.exit(1);
      }
    }
  }

  if (USER_OPTIONS.client) {
    createReactApp(appName, useYarn);
  } else {
    // if user omitted client side
    // than we have to create folder manually
    // as "create-react-app" did it for us
    fs.ensureDirSync(name);
    if (!isSafeToCreateProjectIn(appDir, name)) {
      process.exit(1);
    }
  }

  dependencyInjection({
    appDir,
    appName,
    originalDirectory,
    userOptions: USER_OPTIONS,
  });

  // copy static files
  fs.copySync(
    path.resolve(__dirname, './templates/static'),
    appDir,
    { overwrite: true },
  );

  process.chdir(appDir);

  if (!useYarn && !checkThatNpmCanReadCwd()) {
    process.exit(1);
  }

  installDependencies(useYarn, appDir);
}


// RUN SCRIPT
createApp(projectName);
