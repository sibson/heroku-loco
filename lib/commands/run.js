var Heroku = require('heroku-client');
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
  run: function (context) {
    // Get an authenticated API object
    var heroku = new Heroku({token: context.auth.password});

    // Get the config vars for the app
    heroku.apps(context.app).configVars().info(function (err, config) {
      if (err) { throw err; }

      for (var attrname in config) { process.env[attrname] = config[attrname]; }

      // launch the command
      var command = spawn(context.args[0], context.args.slice(1,-2), { env: process.env, cwd: context.cwd });
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
    });
  }
};
