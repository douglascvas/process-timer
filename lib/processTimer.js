const findProcess = require('find-process');
const FileReporter = require('./fileReporter');
const Report = require('./report');
const TimeUtils = require('./timeUtils');

class ProcessTimer {
    constructor(options) {
        options = options || {};
        let reportOptions = {
            reportPath: options.reportPath,
            logger: options.logger
        };
        this._logger = options.logger || console;
        this._reporter = options.reporter || new FileReporter(reportOptions);
        this._processName = options.processName || '';
        this._uniqueProcessIdentifierRegex = options.uniqueProcessIdentifierRegex || '';
        this._currentReport = null;
        this._checkInterval = options.checkInterval || 500;

        if (!this._processName) {
            throw new Error('You must inform the name of the process to watch');
        }
    }

    start(startNew) {
        this._logger.log('Monitoring started');
        if (startNew) {
            return this._startNewMonitoring();
        }
        return this._continueMonitoring();
    }

    _startNewMonitoring() {
        this._currentReport = new Report();
        return this._reporter.reset()
            .then(()=> this._startMonitoring());
    }

    _continueMonitoring() {
        let self = this;
        return new Promise((succeed, fail) => {
            return self._reporter.loadFromLastReport()
                .then(report => {
                    self._currentReport = report;
                    succeed();
                })
                .catch(err => {
                    if (err) {
                        self._logger.log('Failed to load last report.', err);
                        return fail();
                    }
                    self._startNewMonitoring();
                });
        }).then(()=> {
            self._startMonitoring();
        });
    }

    _startMonitoring() {
        let self = this;
        setTimeout(() => {
            self._findProcess()
                .then(() => process.nextTick(() => self._startMonitoring()))
                .catch((err) => {
                    if (err) {
                        self._logger.log(err.stack || err);
                    }
                    process.nextTick(() => self._startMonitoring())
                });
        }, self._checkInterval);
    }

    _findProcess() {
        let self = this;
        return findProcess('name', self._processName)
            .then(list => {
                let processes = list.filter(p => !self._uniqueProcessIdentifierRegex || p.cmd.match(self._uniqueProcessIdentifierRegex));
                return processes.length ? self._registerProcessActive() : self._registerProcessInactive();
            });
    }

    _registerProcessActive() {
        let self = this;
        let processStarted = self._currentReport.isStarted();
        if (!processStarted) {
            self._logger.log('Process started at', TimeUtils.toDateTimeString(self._currentReport.startTime));
            self._currentReport.start();
        }
    }

    _registerProcessInactive() {
        let self = this;
        let processStarted = self._currentReport.isStarted();
        if (processStarted) {
            self._currentReport.stop();
            self._logger.log('Process stoped at', TimeUtils.toDateTimeString(self._currentReport.stopTime));
            self._logger.log('Process executed during', TimeUtils.toDateTimeString(self._currentReport.executionTime));
            self._logger.log('Total executed time:', TimeUtils.toDateTimeString(self._currentReport.totalExecutionTime));
            return self._reporter.save(self._currentReport)
                .then(()=> {
                    self._currentReport.reset();
                });
        }
    }

}

module.exports = ProcessTimer;
