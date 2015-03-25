
exports.topics = [{
  name: 'loco',
  description: 'Runs foreman using an applications environment'
}];

exports.commands = [
  require('./lib/commands/run')
];
