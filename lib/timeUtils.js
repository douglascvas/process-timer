const moment = require('moment');
const dateTimeFormat = 'DD.MM.YYYY HH:mm:ss.SSS';

function daysToMs(value) {
    return value * 24 * 60 * 60 * 1000
}

function hoursToMs(value) {
    return value * 60 * 60 * 1000
}

function minutesToMs(value) {
    return value * 60 * 1000
}

function secondsToMs(value) {
    return value * 1000
}

class TimeUtils {
    static toTimeString(value) {
        let ms = value % 1000;
        value = (value - ms) / 1000;
        let s = value % 60;
        value = (value - s) / 60;
        let m = value % 60;
        value = (value - m) / 60;
        let h = value % 24;
        value = (value - h) / 24;
        let result = value ? value + (value > 1 ? 'days' : 'day') : '';
        result += `${h}:${m}:${s}.${ms}`;
        return result;
    }

    static fromTimeString(value) {
        let blocks = (value || '').split(/[ .:]/);
        let ms = 0;
        if (blocks.length > 4) {
            ms += daysToMs(parseInt(blocks[0])); // day
            blocks = blocks.splice(0, 2);
        }
        ms += hoursToMs(parseInt(blocks[0]));
        ms += minutesToMs(parseInt(blocks[1]));
        ms += secondsToMs(parseInt(blocks[2]));
        ms += parseInt(blocks[3]);

        return ms;
    }

    static toDateTimeString(value) {
        return moment(value).utcOffset(0).format(dateTimeFormat);
    }

    static fromDateTimeString(value) {
        return moment(value, dateTimeFormat);
    }
}

module.exports = TimeUtils;