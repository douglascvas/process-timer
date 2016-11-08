const ProcessTimer = require('../processTimer');

module.exports = function (startNew, reportPath) {
    const options = {
        reportPath: reportPath || 'gradle-report.csv',
        processName: 'java',
        uniqueProcessIdentifierRegex: /-Dorg\.gradle\.appname=gradle/
    };

    const gradleTimer = new ProcessTimer(options);
    gradleTimer.start(startNew).catch(err => {
        console.log(err);
    });
};