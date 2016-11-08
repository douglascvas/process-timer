#!/usr/bin/env node

const program = require('commander');
program
    .option('-n, --new [boolean]', 'Starts a new report')
    .option('-r, --report [string]', 'Path (including file name) for the report file')
    .option('-m, --module [string]', 'process-timer module to use (see the documentation)')
    .parse(process.argv);

if (program.module) {
    var module = require('../lib/modules/' + program.module);
    if (module && typeof module === 'function') {
        return module(program.new, program.report);
    } else {
        throw new Error('Invalid module:' + program.module);
    }
}

const ProcessTimer = require('../lib/processTimer');

const options = {
    reportPath: program.report
};
const processTimer = new ProcessTimer(options);
processTimer.start(program.new);