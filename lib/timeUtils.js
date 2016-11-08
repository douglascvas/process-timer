const moment = require('moment');
const dateTimeFormat = 'DD.MM.YYYY HH:mm:ss.SSS';
const simpleDateTimeFormat = 'DD.MM.YYYY-HH:mm:ss';
const timeFormat = 'HH:mm:ss.SSS';

class TimeUtils {
    static toTimeString(value) {
        return moment(value).utcOffset(0).format(timeFormat);
    }

    static fromTimeString(value) {
        return moment(value, timeFormat);
    }

    static toDateTimeString(value) {
        return moment(value).utcOffset(0).format(dateTimeFormat);
    }

    static fromDateTimeString(value) {
        return moment(value, dateTimeFormat);
    }
}

module.exports = TimeUtils;