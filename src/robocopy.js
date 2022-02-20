const command = require("./command"),
  process = require("./process");

/**
 * Run in serie
 *
 * @param {string[]} commands
 * @returns {Promise<any>}
 */
function runSerial(commands) {
  return new Promise((resolve) => {
    commands = commands.map((comm) => () => process(comm));
    const initial = commands.shift();
    const output = [];
    commands
      .reduce(
        (prom, item) =>
          prom.then((stdout) => {
            output.push(stdout);
            return item;
          }),
        initial()
      )
      .done((stdout) => {
        resolve(output.concat(stdout));
      });
  });
}

// function runSerial2(commands) {
//   commands = commands.map((_command) => () => process(_command));
//   const deferred = Q.defer();
//   const initial = commands.shift();
//   const output = [];
//   commands
//     .reduce(
//       (_promise, item) =>
//         _promise.then((stdout) => {
//           output.push(stdout);
//           return item();
//         }),
//       initial()
//     )
//     .done((stdout) => {
//       deferred.resolve(output.concat(stdout));
//     });

//   return deferred.promise;
// }

/**
 * Run in parallel
 *
 * @param {string[]} commands
 * @returns
 */
function runParallel(commands) {
  return Promise.all(commands.map((_comm) => process(_comm)));
}

module.exports = function (options) {
  return (options.serial ? runSerial : runParallel)(command(options));
};
