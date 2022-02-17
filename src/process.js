const process = require("child_process"),
  Q = require("q"),
  parser = require("./parser"),
  readline = require("readline");

module.exports = function (command) {
  console.log();
  console.log(command.path + " " + command.args.join(" "));
  console.log();

  const robocopy = process.spawn(command.path, command.args, {
    windowsVerbatimArguments: true,
  });

  const log = function (message) {
    message = message.toString("utf8");
    console.log(message);
    return message;
  };

  let stdout = "";
  let stderr = "";

  const readlines = function (input, listener) {
    readline
      .createInterface({
        input: input,
      })
      .on("line", listener);
  };

  readlines(robocopy.stdout, function (line) {
    stdout += log(line);
  });
  readlines(robocopy.stderr, function (line) {
    stderr += log(line);
  });

  const deferred = Q.defer();

  robocopy.on("exit", function (code) {
    if (code > 8) {
      const errors = parser(stdout);
      const message =
        "Robocopy failed (" +
        code +
        ")" +
        (errors || stderr ? ": \r\n" + (errors || stderr) : ".");
      deferred.reject(new Error(message));
    } else deferred.resolve(stdout);
  });

  return deferred.promise;
};
