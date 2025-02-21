const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const currentPath = process.cwd();
const isWindows = process.platform === 'win32';
let hasErrors = false;

const dependencies = [
    'vite'
];

function fixNpmPermissions() {
    if (!isWindows) {
        try {
            const npmCachePath = path.join(os.homedir(), '.npm');
            console.log('Fixing npm permissions...');
            execSync(`sudo chown -R ${process.getuid()}:${process.getgid()} "${npmCachePath}"`, { stdio: 'inherit' });
            console.log('npm permissions fixed successfully');
        } catch (error) {
            hasErrors = true;
            console.error('Failed to fix npm permissions. You might need to run: sudo chown -R $(whoami) ~/.npm');
        }
    }
}

function fixMacOSPermissions() {
    if (!isWindows) {
        try {
            console.log('Setting up ffmpeg and crop permissions...');
            
            execSync('sudo xattr -r -d com.apple.quarantine ffmpeg', { stdio: 'inherit' });
            execSync('sudo chmod +x ffmpeg', { stdio: 'inherit' });
            console.log('ffmpeg permissions fixed successfully');

            execSync('sudo xattr -d com.apple.quarantine ./crop', { stdio: 'inherit' });
            execSync('sudo chmod +x crop', { stdio: 'inherit' });
            console.log('crop permissions fixed successfully');
        } catch (error) {
            hasErrors = true;
            console.error('Failed to set permissions for ffmpeg or crop:', error);
        }
    }
}

function formatPath(pathStr) {
    if (isWindows) {
        return pathStr.replace(/\\/g, '/');
    }
    return pathStr;
}

function createUpdateScript() {
    const formattedPath = formatPath(currentPath);

    const batContent = `cd "${formattedPath}"\nnpx vite`;
    const shContent = `cd "${formattedPath}"\nnpx vite`; 

    try {
        if (isWindows) {
            fs.writeFileSync(
                path.join(currentPath, 'update.bat'),
                batContent,
                'utf8'
            );
            console.log('Updated update.bat');
        } else {
            const shPath = path.join(currentPath, 'update.sh');
            fs.writeFileSync(
                shPath,
                shContent,
                'utf8'
            );
            console.log('Updated update.sh');
            
            try {
                execSync(`sudo xattr -r -d com.apple.quarantine "${shPath}"`, { stdio: 'inherit' });
                console.log('Quarantine removed from update.sh');
            } catch (error) {
                hasErrors = true;
                console.warn('Could not remove quarantine attribute. You might need to do it manually.');
            }
            
            execSync(`chmod +x "${shPath}"`);
            console.log('Made update.sh executable');
        }
    } catch (error) {
        hasErrors = true;
        console.error('Error creating update scripts:', error);
        process.exit(1);
    }
}

function installDependencies() {
    console.log('Installing dependencies...');
    
    try {
        if (!fs.existsSync(path.join(currentPath, 'package.json'))) {
            execSync('npm init -y', { stdio: 'inherit' });
        }

        if (!isWindows) {
            fixNpmPermissions();
        }

        dependencies.forEach(dep => {
            try {
                console.log(`Installing ${dep}...`);
                execSync(`npm install ${dep}`, { stdio: 'inherit' });
            } catch (error) {
                hasErrors = true;
                if (!isWindows) {
                    console.log('Trying with sudo...');
                    try {
                        execSync(`sudo npm install -g ${dep}`, { stdio: 'inherit' });
                    } catch (sudoError) {
                        console.error(`Failed to install ${dep} even with sudo:`, sudoError);
                    }
                } else {
                    console.error(`Failed to install ${dep}:`, error);
                }
            }
        });

        if (!hasErrors) {
            console.log('Dependencies installed successfully');
        }

    } catch (error) {
        hasErrors = true;
        console.error('Error installing dependencies:', error);
        process.exit(1);
    }
}

function main() {
    console.log('Starting setup...');
    console.log(`Current path: ${currentPath}`);
    console.log(`Operating System: ${isWindows ? 'Windows' : 'macOS'}`);

    createUpdateScript();
    installDependencies();
    
    if (!isWindows) {
        fixMacOSPermissions();
    }

    if (!hasErrors) {
        console.log('Setup completed successfully!');
    }
}

main();