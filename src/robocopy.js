const command = require("./command"),
  process = require("./process"),
  Q = require("q");

function runSerial(commands) {
  commands = commands.map(function (_command) {
    return function () {
      return process(_command);
    };
  });
  const deferred = Q.defer();
  const initial = commands.shift();
  const output = [];
  commands
    .reduce(function (promise, item) {
      return promise.then(function (stdout) {
        output.push(stdout);
        return item();
      });
    }, initial())
    .done(function (stdout) {
      deferred.resolve(output.concat(stdout));
    });
  return deferred.promise;
}

function runParallel(commands) {
  return Q.all(
    commands.map(function (_command) {
      return process(_command);
    })
  );
}

module.exports = function (options) {
  return (options.serial ? runSerial : runParallel)(command(options));
};
