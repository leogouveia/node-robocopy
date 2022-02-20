const process = require("child_process"),
  parser = require("./parser"),
  readline = require("readline");

module.exports = function (command) {
  console.log();
  console.log(command.path + " " + command.args.join(" "));
  console.log();

  const robocopy = process.spawn(command.path, command.args, {
    windowsVerbatimArguments: true,
  });

  const log = (message) => {
    message = message.toString("utf8");
    console.log(message);
    return message;
  };

  let stdout = "";
  let stderr = "";

  const readlines = (input, listener) => {
    readline
      .createInterface({
        input: input,
      })
      .on("line", listener);
  };

  readlines(robocopy.stdout, (line) => {
    stdout += log(line);
  });
  readlines(robocopy.stderr, (line) => {
    stderr += log(line);
  });

  return new Promise((resolve, reject) => {
    robocopy.on("exit", (code) => {
      if (code > 8) {
        const errors = parser(stdout);
        const message =
          "Robocopy failed (" +
          code +
          ")" +
          (errors || stderr ? ": \r\n" + (errors || stderr) : ".");
        reject(new Error(message));
      } else resolve(stdout);
    });
  });
};
