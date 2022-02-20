const path = require("path"),
  _ = require("lodash");

/**
 * Put double quotes around path
 *
 * @param {string|string[]} _path
 * @returns {string|string[]}
 */
function qualify(_path) {
  const quote = (p) => `"${p}"`;
  if (Array.isArray(_path)) return _path.map(quote);
  return quote(_path);
}

/**
 * Convert path to windows path
 *
 * @param {string|string[]} _path
 * @returns {string|string[]}
 */
function toWindowsPath(_path) {
  const clean = (p) => {
    p = p.replace(/\//g, "\\").trim();
    if (p.substr(-1) === "\\") p = p.substr(0, p.length - 1);
    return p;
  };

  if (Array.isArray(_path)) return _path.map(clean);
  return clean(_path);
}

/**
 * Convert to absolute path
 *
 * @param {string|string[]} relativePath
 * @param {(string|string[])?} base
 * @returns {string|string[]}
 */
function toAbsolutePath(relativePath, base) {
  const toAbsolute = (p) =>
    p.startsWith("\\\\") || p.includes(":")
      ? p
      : base
      ? path.join(base, p)
      : path.resolve(p);

  if (Array.isArray(relativePath)) return relativePath.map(toAbsolute);
  return toAbsolute(relativePath);
}

/**
 *
 * @param {object} options
 * @param {string | array} options.source Specifies the path to the source directory.
 * @param {string | array} options.destination Specifies the destination path(s).
 * @param {boolean?} options.serial Indicates if multiple destinations should be copied serialy. By default multiple destinations are copied in parallel.
 * @param {string[]?} options.files Specifies the file or files to be copied. You can use wildcard characters (* or ?), if you want. If the File parameter is not specified, *.* is used as the default value.
 * @param {object?} options.copy Copy options
 * @param {boolean?} options.copy.subdirs Copies subdirectories. Note that this option excludes empty directories. [/s]
 * @param {boolean?} options.copy.emptySubdirs Copies subdirectories. Note that this option includes empty directories. [/e]
 * @param {number?} options.copy.levels Copies only the top N levels of the source directory tree. [/lev:<N>]
 * @param {boolean?} options.copy.restartMode Copies files in Restart mode. [/z]
 * @param {boolean?} options.copy.backupMode Copies files in Backup mode. [/b]
 * @param {boolean?} options.copy.restartThenBackupMode Uses Restart mode. If access is denied, this option uses Backup mode. [/zb]
 * @param {boolean?} options.copy.efsRawMode Copies all encrypted files in EFS RAW mode. [/efsraw]
 * @param {string?} options.copy.info
 * @param {boolean?} options.copy.dirTimestamps Copies directory time stamps. [/dcopy:T]
 * @param {boolean?} options.copy.securityInfo Copies files with security (equivalent to copy.flags: 'DAT'). [/sec]
 * @param {boolean?} options.copy.allInfo Copies all file information (equivalent to copy.flags: 'DATSOU'). [/copyall]
 * @param {boolean?} options.copy.noInfo Copies no file information (useful with copy.purge). [/nocopy]
 * @param {boolean?} options.copy.fixSecurity
 * @param {boolean?} options.copy.fixTimes Fixes file times on all files, even skipped ones. [/timfix]
 * @param {boolean?} options.copy.purge Deletes destination files and directories that no longer exist in the source. [/purge]
 * @param {boolean?} options.copy.mirror Mirrors a directory tree (equivalent to copy.emptySubdirs plus copy.purge). [/mir]
 * @param {boolean?} options.copy.moveFiles Moves files, and deletes them from the source after they are copied. [/mov]
 * @param {boolean?} options.copy.moveFilesAndDirs Moves files and directories, and deletes them from the source after they are copied. [/move]
 * @param {string?} options.copy.addAttributes Adds the specified attributes to copied files. [/a+:[RASHCNET]]
 * @param {string?} options.copy.removeAttributes Removes the specified attributes from copied files. [/a-:[RASHCNET]]
 * @param {boolean?} options.copy.createDirsAndEmptyFiles Creates a directory tree and zero-length files only. [/create]
 * @param {boolean?} options.copy.fatFilenames Creates destination files by using 8.3 character-length FAT file names only. [/fat]
 * @param {boolean?} options.copy.disableLongPaths Turns off support for very long paths (longer than 256 characters). [/256]
 * @param {number?} options.copy.monitorCountTrigger Monitors the source, and runs again when more than N changes are detected. [/mon:<N>]
 * @param {number?} options.copy.monitorTimeTrigger Monitors source, and runs again in M minutes if changes are detected. [/mot:<M>]
 * @param {(boolean|number)?} options.copy.multiThreaded
 * @param {object?} options.copy.runTimes Specifies run times when new copies may be started. [/rh:hhmm-hhmm]
 * @param {string?} options.copy.runTimes.start
 * @param {string?} options.copy.runTimes.end
 * @param {boolean?} options.copy.runTimes.checkPerFile Checks run times on a per-file (not per-pass) basis. [/pf]
 * @param {number?} options.copy.interPacketGap Specifies the inter-packet gap to free bandwidth on slow lines. [/ipg:n]
 * @param {boolean?} options.copy.symbolicLink Copies the symbolic link instead of the target. [/sl]
 * @param {object?} options.file File options
 * @param {boolean?} options.file.copyArchived Copies only files for which the Archive attribute is set. [/a]
 * @param {boolean?} options.file.copyArchivedAndReset Copies only files for which the Archive attribute is set, and resets the Archive attribute. [/m]
 * @param {string?} options.file.includeAttributes Includes only files for which any of the specified attributes are set. [/ia:[RASHCNETO]]
 * @param {string?} options.file.excludeAttributes Excludes files for which any of the specified attributes are set. [/xa:[RASHCNETO]]
 * @param {string[]?} options.file.excludeFiles Excludes files that match the specified names or paths. Note that FileName can include wildcard characters (* and ?). [/xf <FileName>[ ...]]
 * @param {string[]?} options.file.excludeDirs Excludes directories that match the specified names and paths. [/xd <Directory>[ ...]]
 * @param {boolean?} options.file.excludeDirsRelative Leaves excluded directories as relative paths. Converts to absolute paths by default.
 * @param {boolean?} options.file.excludeChangedFiles Excludes changed files. [/xct]
 * @param {boolean?} options.file.excludeNewerFiles Excludes newer files. [/xn]
 * @param {boolean?} options.file.excludeOlderFiles Excludes older files. [/xo]
 * @param {boolean?} options.file.excludeExtraFilesAndDirs Excludes extra files and directories. [/xx]
 * @param {boolean?} options.file.excludeLonelyFilesAndDirs Excludes "lonely" files and directories. [/xl]
 * @param {boolean?} options.file.includeSameFiles Includes the same files. [/is]
 * @param {boolean?} options.file.includeTweakedFiles Includes "tweaked" files. [/it]
 * @param {number?} options.file.maximumSize Specifies the maximum file size (to exclude files bigger than N bytes). [/max:<N>]
 * @param {number?} options.file.minimumSize Specifies the minimum file size (to exclude files smaller than N bytes). [/min:<N>]
 * @param {(number|string)?} options.file.maximumAge Specifies the maximum file age (exclude files older than N days or date) [/maxage:<N>]
 * @param {(number|string)?} options.file.minimumAge Specifies the minimum file age (exclude files newer than N days or date) [/minage:<N>]
 * @param {(number|string)?} options.file.maximumLastAccess Specifies the maximum last access date (excludes files unused since N) [/maxlad:<N>]
 * @param {(number|string)?} options.file.minimumLastAccess Specifies the minimum last access date (excludes files used since N) [/minlad:<N>]
 * @param {boolean?} options.file.fatFileTimes Assumes FAT file times (two-second precision). [/fft]
 * @param {boolean?} options.file.compensateForDst Compensates for one-hour DST time differences. [/dst]
 * @param {boolean?} options.file.excludeJunctions Excludes junction points, which are normally included by default. [/xj]
 * @param {boolean?} options.file.excludeDirectoryJunctions Excludes junction points for directories. [/xjd]
 * @param {boolean?} options.file.excludeFileJunctions Excludes junction points for files. [/xjf]
 * @param {object?} options.retry Retry options
 * @param {number?} options.retry.count Specifies the number of retries on failed copies. The default value of N is 1,000,000 (one million retries). [/r:<N>]
 * @param {number?} options.retry.wait Specifies the wait time between retries, in seconds. The default value of N is 30 (wait time 30 seconds). [/w:<N>]
 * @param {boolean?} options.retry.saveAsDefault Saves the values specified in the retry.count and retry.wait options as default settings in the registry. [/reg]
 * @param {boolean?} options.retry.waitForShareNames Specifies that the system will wait for share names to be defined (retry error 67). [/tbd]
 * @param {object?} options.logging Logging options
 * @param {boolean?} options.logging.listOnly Specifies that files are to be listed only (and not copied, deleted, or time stamped). [/l]
 * @param {boolean?} options.logging.includeExtraFiles Reports all extra files, not just those that are selected. [/x]
 * @param {boolean?} options.logging.verbose Produces verbose output, and shows all skipped files. [/v]
 * @param {boolean?} options.logging.includeSourceTimestamps Includes source file time stamps in the output. [/ts]
 * @param {boolean?} options.logging.includeFullPaths Includes the full path names of the files in the output. [/fp]
 * @param {boolean?} options.logging.sizesAsBytes Prints sizes, as bytes. [/bytes]
 * @param {boolean?} options.logging.excludeFileSizes Specifies that file sizes are not to be logged. [/ns]
 * @param {boolean?} options.logging.excludeFileClasses Specifies that file classes are not to be logged. [/nc]
 * @param {boolean?} options.logging.excludeFilenames Specifies that file names are not to be logged. [/nfl]
 * @param {boolean?} options.logging.excludeDirectoryNames Specifies that directory names are not to be logged. [/ndl]
 * @param {boolean?} options.logging.hideProgress Specifies that the progress of the copying operation (the number of files or directories copied so far) will not be displayed. [/np]
 * @param {boolean?} options.logging.showEta Shows the estimated time of arrival (ETA) of the copied files. [/eta]
 * @param {object?} options.logging.output Writes the status output to the log file. [/log+:<LogFile>, /log:<LogFile>, /unilog:<LogFile>, /unilog+:<LogFile>]
 * @param {string?} options.logging.output.file
 * @param {boolean?} options.logging.output.overwrite
 * @param {boolean?} options.logging.output.unicode
 * @param {boolean?} options.logging.showUnicode Displays the status output as Unicode text. [/unicode]
 * @param {boolean?} options.logging.showAndLog Writes the status output to the console window, as well as to the log file. [/tee]
 * @param {boolean?} options.logging.noJobHeader Specifies that there is no job header. [/njh]
 * @param {boolean?} options.logging.noJobSummary Specifies that there is no job summary. [/njs]
 * @param {object?} options.job Job options
 * @param {string?} options.job.deriveParameters Specifies that parameters are to be derived from the named job file. [/job:<JobName>]
 * @param {string?} options.job.saveParameters Specifies that parameters are to be saved to the named job file. [/save:<JobName>]
 * @param {boolean?} options.job.quiteAfterProcessing Quits after processing command line (to view parameters). [/quit]
 * @param {boolean?} options.job.noSourceDir Indicates that no source directory is specified. [/nosd]
 * @param {boolean?} options.job.noDestinationDir Indicates that no destination directory is specified. [/nodd]
 * @param {boolean?} options.job.includesFiles  Includes the specified files. [/if]
 * @returns {{ path: "robocopy", args: string[] }}
 */
function buildCommand(options) {
  /** @type {string[]} */
  let args = [];

  const source = toAbsolutePath(options.source);
  const destination = toAbsolutePath(options.destination);

  args.push(qualify(toWindowsPath(source)));
  args.push(qualify(toWindowsPath(destination)));
  if (options.files) args = args.concat(qualify(toWindowsPath(options.files)));

  if (options.copy) {
    const copy = options.copy;
    if (copy.subdirs) args.push("/s");
    if (copy.emptySubdirs) args.push("/e");
    if (copy.levels) args.push("/lev:" + copy.levels);
    if (copy.restartMode) args.push("/z");
    if (copy.backupMode) args.push("/b");
    if (copy.restartThenBackupMode) args.push("/zb");
    if (copy.efsRawMode) args.push("/efsraw");
    if (copy.info) args.push("/copy:" + copy.info);
    if (copy.dirTimestamps) args.push("/dcopy:T");
    if (copy.securityInfo) args.push("/sec");
    if (copy.allInfo) args.push("/copyall");
    if (copy.noInfo) args.push("/nocopy");
    if (copy.fixSecurity) args.push("/secfix");
    if (copy.fixTimes) args.push("/timfix");
    if (copy.purge) args.push("/purge");
    if (copy.mirror) args.push("/mir");
    if (copy.moveFiles) args.push("/mov");
    if (copy.moveFilesAndDirs) args.push("/move");
    if (copy.addAttributes) args.push("/a+:" + copy.addAttributes);
    if (copy.removeAttributes) args.push("/a-:" + copy.removeAttributes);
    if (copy.createDirsAndEmptyFiles) args.push("/create");
    if (copy.fatFilenames) args.push("/fat");
    if (copy.disableLongPaths) args.push("/256");
    if (copy.monitorCountTrigger) args.push("/mon:" + copy.monitorCountTrigger);
    if (copy.monitorTimeTrigger) args.push("/mot:" + copy.monitorTimeTrigger);
    if (copy.multiThreaded)
      args.push(
        "/MT" +
          (copy.multiThreaded !== true && copy.multiThreaded > 0
            ? ":" + copy.multiThreaded
            : "")
      );

    if (copy.runTimes) {
      args.push(
        "/rh:" +
          copy.runTimes.start.replace(/\:/g, "") +
          "-" +
          copy.runTimes.end.replace(/\:/g, "")
      );
      if (copy.runTimes.checkPerFile) args.push("/pf");
    }

    if (copy.interPacketGap) args.push("/ipg:" + copy.interPacketGap);
    if (copy.symbolicLink) args.push("/sl");
  }

  if (options.file) {
    const file = options.file;
    if (file.copyArchived) args.push("/a");
    if (file.copyArchivedAndReset) args.push("/m");
    if (file.includeAttributes) args.push("/ia:" + file.includeAttributes);
    if (file.excludeAttributes) args.push("/xa:" + file.excludeAttributes);

    if (file.excludeFiles && file.excludeFiles.length > 0) {
      args.push("/xf");
      args = args.concat(qualify(toWindowsPath(file.excludeFiles)));
    }

    if (file.excludeDirs && file.excludeDirs.length > 0) {
      args.push("/xd");
      let excludeDirs;
      if (file.excludeDirsRelative) {
        excludeDirs = qualify(toWindowsPath(file.excludeDirs));
      } else {
        excludeDirs = _.chain(
          toAbsolutePath(file.excludeDirs, source).concat(
            toAbsolutePath(file.excludeDirs, destination)
          )
        )
          .uniq()
          .map(toWindowsPath)
          .map(qualify)
          .value();
      }
      args = args.concat(excludeDirs);
    }

    if (file.excludeChangedFiles) args.push("/xct");
    if (file.excludeNewerFiles) args.push("/xn");
    if (file.excludeOlderFiles) args.push("/xo");
    if (file.excludeExtraFilesAndDirs) args.push("/xx");
    if (file.excludeLonelyFilesAndDirs) args.push("/xl");
    if (file.includeSameFiles) args.push("/is");
    if (file.includeTweakedFiles) args.push("/it");
    if (file.maximumSize) args.push("/max:" + file.maximumSize);
    if (file.minimumSize) args.push("/min:" + file.minimumSize);
    if (file.maximumAge) args.push("/maxage:" + file.maximumAge);
    if (file.minimumAge) args.push("/minage:" + file.minimumAge);
    if (file.maximumLastAccess) args.push("/maxlad:" + file.maximumLastAccess);
    if (file.minimumLastAccess) args.push("/minlad:" + file.minimumLastAccess);
    if (file.fatFileTimes) args.push("/fft");
    if (file.compensateForDst) args.push("/dst");
    if (file.excludeJunctions) args.push("/xj");
    if (file.excludeDirectoryJunctions) args.push("/xjd");
    if (file.excludeFileJunctions) args.push("/xjf");
  }

  if (options.retry) {
    const retry = options.retry;
    if (retry.count) args.push("/r:" + retry.count);
    if (retry.wait) args.push("/w:" + retry.wait);
    if (retry.saveAsDefault) args.push("/reg");
    if (retry.waitForShareNames) args.push("/tbd");
  }

  if (options.logging) {
    const logging = options.logging;
    if (logging.listOnly) args.push("/l");
    if (logging.includeExtraFiles) args.push("/x");
    if (logging.verbose) args.push("/v");
    if (logging.includeSourceTimestamps) args.push("/ts");
    if (logging.includeFullPaths) args.push("/fp");
    if (logging.sizesAsBytes) args.push("/bytes");
    if (logging.excludeFileSizes) args.push("/ns");
    if (logging.excludeFileClasses) args.push("/nc");
    if (logging.excludeFilenames) args.push("/nfl");
    if (logging.excludeDirectoryNames) args.push("/ndl");
    if (logging.hideProgress) args.push("/np");
    if (logging.showEta) args.push("/eta");
    if (logging.output)
      args.push(
        "/" +
          (logging.output.unicode ? "uni" : "") +
          "log" +
          (logging.output.overwrite ? "" : "+") +
          ":" +
          qualify(toWindowsPath(logging.output.file))
      );
    if (logging.showUnicode) args.push("/unicode");
    if (logging.showAndLog) args.push("/tee");
    if (logging.noJobHeader) args.push("/njh");
    if (logging.noJobSummary) args.push("/njs");
  }

  if (options.job) {
    const job = options.job;
    if (job.deriveParameters)
      args.push("/job:" + qualify(job.deriveParameters));
    if (job.saveParameters) args.push("/save:" + qualify(job.saveParameters));
    if (job.quiteAfterProcessing) args.push("/quit");
    if (job.noSourceDir) args.push("/nosd");
    if (job.noDestinationDir) args.push("/nodd");
    if (job.includesFiles) args.push("/if");
  }

  return {
    path: "robocopy",
    args: args,
  };
}

module.exports = function (options) {
  return _.chain(
    _.isArray(options.destination) ? options.destination : [options.destination]
  )
    .map(function (destination) {
      return buildCommand(_.defaults({ destination: destination }, options));
    })
    .value();
};
