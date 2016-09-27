'use strict';
let cli = require('heroku-cli-util');
let co  = require('co');
var spawn = require('child_process').spawn;


module.exports = {
  topic: 'loco',
  command: 'run',
  description: 'Runs the command line using the apps environment',
  help: `Runs the command line using the apps environment
Example:
  $ heroku loco:run echo $DATABASE_URL
  postgresql://user@example.com/sakdlrtuaio`,
  needsAuth: true,
  needsApp: true,
  variableArgs: true,
  run: cli.command(co.wrap(function* (context, heroku) {
    // Get the config vars for the app
    let config = yield heroku.apps(context.app).configVars().info();

    for (var attrname in config) { process.env[attrname] = config[attrname]; }

    // launch the command
    var command = spawn(context.args[0], context.args.slice(1), { env: process.env, cwd: context.cwd });
    command.stdout.on('data', function(data) {
      process.stdout.write(data);
    });
    command.stderr.on('data', function(data) {
      process.stderr.write(data);
    });
    command.on('error', function(err) {
      process.stderr.write(String(err) + '\n');
      process.exitCode = 99;
    });
    command.on('exit', function(err) {
      process.exitCode = err;
    });
  }))
};
