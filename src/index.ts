import fs from 'fs-extra';
import path from 'path';
import meow from 'meow';
import enquirer from 'enquirer';
import execa, { ExecaError } from 'execa';
import ora from 'ora';
import { UserError } from './utils';
import c from 'chalk';
import terminalLink from 'terminal-link';

const starterDir = path.normalize(`${__dirname}/../core-app-template`);

const cli = meow(
    `
Usage
  $ create-core-aspects-app [directory]
`
);

type Args = {
    directory: string;
};

const versionInfo = () => {
    process.stdout.write('\n');
    console.log(`✨ You're about to generate a project using ${c.bold(
        'Core Framework'
    )} packages.
`);
};

async function normalizeArgs(): Promise<Args> {
    let directory = cli.input[0];
    if (!directory) {
        ({ directory } = await enquirer.prompt({
            type: 'input',
            name: 'directory',
            message:
                'What directory should create-core-aspects-app generate your app into?',
            validate: (x) => !!x,
        }));
        process.stdout.write('\n');
    }
    return {
        directory: path.resolve(directory),
    };
}

const installDeps = async (cwd: string): Promise<'yarn' | 'npm'> => {
    const spinner = ora(
        'Installing dependencies with yarn. This may take a few minutes.'
    ).start();
    try {
        await execa('yarn', ['install'], { cwd });
        spinner.succeed('Installed dependencies with yarn.');
        return 'yarn';
    } catch (_err: any) {
        let err: ExecaError = _err;
        if (err.failed) {
            process.stdout.write('\n');
            spinner.warn('Failed to install with yarn.');
            spinner.start(
                'Installing dependencies with npm. This may take a few minutes.'
            );
            try {
                await execa('npm', ['install'], { cwd });
                spinner.succeed('Installed dependencies with npm.');
            } catch (npmErr) {
                spinner.fail('Failed to install with npm.');
                throw npmErr;
            }
            process.stdout.write('\n');
            return 'npm';
        }
        throw err;
    }
};

(async () => {
    versionInfo();
    
    const normalizedArgs = await normalizeArgs();

    fs.copySync(starterDir, normalizedArgs.directory, { overwrite: true })

    const packageManager = await installDeps(normalizedArgs.directory);
    const relativeProjectDir = path.relative(
        process.cwd(),
        normalizedArgs.directory
    );
    process.stdout.write('\n');
    console.log(`🎉  Core Aspects created a starter project in: ${c.bold(
        relativeProjectDir
    )}
  ${c.bold('To launch your app, run:')}
  - cd ${relativeProjectDir}
  - ${packageManager === 'yarn' ? 'yarn' : 'npm run'} dev
  ${c.bold('Next steps:')}
  - Read ${c.bold(
        `${relativeProjectDir}${path.sep}README.md`
    )} for additional getting started details.
  - ${terminalLink('Open the Admin UI', 'http://localhost:3000')}
  - ${terminalLink('Open the API Docs', 'http://localhost:3001/_docs')}
  - ${terminalLink('Access the API', 'http://localhost:3001')}
`);
})().catch((err) => {
    if (err instanceof UserError) {
        console.error(err.message);
    } else {
        console.error(err);
    }
    process.exit(1);
});
