var TimeUtils = require('./timeUtils');

/**
 * @param value {String} Comma separated value
 */
function loadFromData(value) {
    var report = new Report();
    if (!value) {
        return report;
    }
    let fields = value.split(',');
    report.startTime = TimeUtils.fromDateTimeString(fields[0]).toDate().getTime();
    report.stopTime = TimeUtils.fromDateTimeString(fields[1]).toDate().getTime();
    report.executionTime = TimeUtils.fromTimeString(fields[2]);
    report.totalExecutionTime = TimeUtils.fromTimeString(fields[3]);
    return report;
}

class Report {
    constructor() {
        this.totalExecutionTime = 0;
        this.reset();
    }

    start() {
        this.startTime = this.startTime || Date.now();
    }

    stop() {
        this.stopTime = Date.now();
        this.executionTime = this.stopTime - this.startTime;
        this.totalExecutionTime += this.executionTime;
    }

    isStarted() {
        return this.startTime !== 0;
    }

    reset() {
        this.startTime = 0;
        this.stopTime = 0;
        this.executionTime = 0;
    }

    /**
     * Initialize the report from a comma separated string.
     * @param value {String} Comma separated value containing the fields to be set
     */
    static fromString(value) {
        return loadFromData(value);
    }

    toString() {
        return [
                TimeUtils.toDateTimeString(this.startTime),
                TimeUtils.toDateTimeString(this.stopTime),
                TimeUtils.toTimeString(this.executionTime),
                TimeUtils.toTimeString(this.totalExecutionTime)
            ].join(',') + '\n';
    }

}

module.exports = Report;
