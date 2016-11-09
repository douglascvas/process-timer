var exec = require('child_process').exec;
var IS_WIN = process.platform === 'win32';

function processExistsOnWindows(processName, commandMatcher) {
    let command = `WMIC PROCESS where "name like'%${processName}%'" get Commandline /FORMAT:CSV`;
    return new Promise((succeed, fail)=> {
        exec(command, function (err, stdout, stderr) {
            if (err || stderr) {
                return succeed(false);
            }
            const exists = stdout
                    .split('\n')
                    .filter(l => !commandMatcher || l.match(new RegExp(commandMatcher)))
                    .length > 0;
            succeed(exists);
        });
    });
}

function processExistsOnLinux(processName, commandMatcher) {
    let command = `ps -A -o etime,pid,user,args| grep ${processName}` + (commandMatcher ? ` | grep ${commandMatcher}` : '');
    return new Promise((succeed, fail)=> {
        exec(command, function (err, stdout, stderr) {
            if (err || stderr) {
                return succeed(false);
            }
            succeed(!!stdout.trim());
        });
    });
}

class ProcessFinder {
    static processExists(processName, commandMatcher) {
        if (IS_WIN) {
            return processExistsOnWindows(processName, commandMatcher);
        }
        return processExistsOnLinux(processName, commandMatcher);
    }
}

module.exports = ProcessFinder;