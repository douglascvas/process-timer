# Process monitor

Monitors the time some process runs in the computer.

A use case is for example to monitor how much time you spend waiting for package managers (like gradle) to finish it's tasks.

The application generates a csv report file, where it records each execution of the target process, with the time when it started and stopped, as well as time of execution and total time spent among all executions.

In case you stop the script and start again, it will load the last result from the report file and continue from it. In case you want to generate a new report, either specify a new report file name, or use the `-n` parameter.  

## How to install

```
npm install -g process-timer
```

## How to use

```
process-timer <args>
```

Example:
```
process-timer -n node -r ~/node_report.csv
```

Available arguments:
* `-n` (optional) if set, creates a new report file. If a report file already exists, it will be renamed, adding the current timestamp to the file name.
* `-r <report file name>` (optional) path to the report file (including the file name).
* `-m <module name>` (optional) process-timer module to use. 
* `-n <process name>` (optional when `module` param is given) name of the process to find. 
* `-u <unique identifier>` (optional) regex to check against the process arguments, to better identify the desired process. 
 
## Modules

process-timer comes with some integrated modules, that allows the application to be used without having to know how to uniquely identify a process.
Feel free to contribute with more modules.

Available modules:
* `gradle`

Example
```
process-timer -m gradle
```
