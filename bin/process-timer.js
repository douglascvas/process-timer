#!/usr/bin/env node

const program = require('commander');
program
    .option('-n, --new [boolean]', '(optional) Starts a new report')
    .option('-r, --report [string]', '(optional) Path (including file name) for the report file')
    .option('-m, --module [string]', '(optional) process-timer module to use (see the documentation)')
    .option('-u, --unique [string]', '(optional) regex to match on the application arguments, to help identifying the process')
    .option('-n, --name [string]', '(optional) name of the process to find')
    .parse(process.argv);

if (program.module) {
    var module = require('../lib/modules/' + program.module);
    if (module && typeof module === 'function') {
        return module(!!program.new, program.report);
    } else {
        throw new Error('Invalid module:' + program.module);
    }
}

const ProcessTimer = require('../lib/processTimer');

const options = {
    reportPath: program.report,
    uniqueProcessIdentifierRegex: program.unique,
    processName: program.processName
};
const processTimer = new ProcessTimer(options);
processTimer.start(program.new);