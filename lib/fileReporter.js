const Report = require('./report');
const fs = require('fs');
const readline = require('readline');
var TimeUtils = require('./timeUtils');

class FileReporter {
    constructor(options) {
        options = options || {};
        this._logger = options.logger || console;
        this._reportPath = options.reportPath || 'report.csv';
    }

    loadFromLastReport() {
        let self = this;
        return new Promise((succeed, fail) => {
            let lastLine = '';
            const fileExists = fs.existsSync(self._reportPath);

            if (!fileExists) {
                return fail();
            }

            self._logger.log('Loading last report...');

            var lineReader = readline.createInterface({
                input: fs.createReadStream(self._reportPath)
            });

            lineReader
                .on('line', function (line) {
                    lastLine = line;
                })
                .on('close', () => {
                    var report = Report.fromString(lastLine);
                    report.reset();
                    self._logger.log('Loaded from last report:', TimeUtils.toTimeString(report.totalExecutionTime));
                    return succeed(report);
                });
        });
    }

    _sanitize(value) {
        return (value || '').replace(/[.: ]+?/g, '.');
    }

    reset() {
        let self = this;
        return new Promise((succeed, fail) => {
            if (fs.existsSync(self._reportPath)) {
                let name;
                let now = self._sanitize(TimeUtils.toDateTimeString(Date.now()));
                let nameBlocks = self._reportPath.split('.');
                if (nameBlocks.length > 1) {
                    name = nameBlocks.slice(0, nameBlocks.length - 1).join('.') + '-' + now + '.' + nameBlocks[nameBlocks.length - 1];
                } else {
                    name = nameBlocks[0] + '-' + now;
                }
                fs.renameSync(self._reportPath, name);
            }

            fs.writeFile(self._reportPath, '', function (err) {
                if (err) {
                    return fail(err);
                }
                self._logger.log('New report started');
                return succeed();
            });
        });
    }

    save(report) {
        let self = this;
        return new Promise((succeed, fail)=> {
            fs.appendFile(self._reportPath, report.toString(), function (err) {
                if (err) {
                    self._logger.log('Error writting report.', err);
                    return fail(err);
                }
                return succeed();
            });
        });
    }
}

module.exports = FileReporter;