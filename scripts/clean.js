// Delete the build folder. Use this script right after checking out a new branch to avoid accidentally running the wrong code
const fs = require('fs-extra');

async function cleanBuildDir() {
    try {
        await fs.remove('./build')
        fs.mkdirSync('./build');
        console.log('Done cleaning.')
    } catch (err) {
        console.error(err)
    }
}

cleanBuildDir();