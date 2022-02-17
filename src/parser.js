module.exports = function (stdout) {
  const error = stdout.match(
    /[\s\S]*----[\s\S]*(ERROR\s*:?\s*[\s\S]*?)(Simple Usage|$)/
  );
  return error ? error[1].trim() : null;
};
