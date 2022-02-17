const assert = require("chai").assert,
  expect = require("chai").expect,
  command = require("../src/command.js");

describe("command", function () {
  function buildOptions(destination) {
    return {
      source: "c:/source/path",
      destination: destination,
      files: ["*.html", "*.js", "/bin/*.*"],
      copy: {
        subdirs: true,
        emptySubdirs: true,
        levels: 1,
        restartMode: true,
        backupMode: true,
        restartThenBackupMode: true,
        efsRawMode: true,
        info: "DAT",
        dirTimestamps: true,
        securityInfo: true,
        allInfo: true,
        noInfo: true,
        fixSecurity: true,
        fixTimes: true,
        purge: true,
        mirror: true,
        moveFiles: true,
        moveFilesAndDirs: true,
        addAttributes: "RASH",
        removeAttributes: "CNET",
        createDirsAndEmptyFiles: true,
        fatFilenames: true,
        disableLongPaths: true,
        monitorCountTrigger: 2,
        monitorTimeTrigger: 3,
        multiThreaded: 4,
        runTimes: {
          start: "10:30",
          end: "11:30",
          checkPerFile: true,
        },
        interPacketGap: 5,
        symbolicLink: true,
      },
      file: {
        copyArchived: true,
        copyArchivedAndReset: true,
        includeAttributes: "RASHC",
        excludeAttributes: "NETO",
        excludeFiles: ["~*.*", "*.tmp"],
        excludeDirs: ["tmp", "obj"],
        excludeChangedFiles: true,
        excludeNewerFiles: true,
        excludeOlderFiles: true,
        excludeExtraFilesAndDirs: true,
        excludeLonelyFilesAndDirs: true,
        includeSameFiles: true,
        includeTweakedFiles: true,
        maximumSize: 6,
        minimumSize: 7,
        maximumAge: 8,
        minimumAge: 9,
        maximumLastAccess: 10,
        minimumLastAccess: 11,
        fatFileTimes: true,
        compensateForDst: true,
        excludeJunctions: true,
        excludeDirectoryJunctions: true,
        excludeFileJunctions: true,
      },
      retry: {
        count: 12,
        wait: 13,
        saveAsDefault: true,
        waitForShareNames: true,
      },
      logging: {
        listOnly: true,
        includeExtraFiles: true,
        verbose: true,
        includeSourceTimestamps: true,
        includeFullPaths: true,
        sizesAsBytes: true,
        excludeFileSizes: true,
        excludeFileClasses: true,
        excludeFilenames: true,
        excludeDirectoryNames: true,
        hideProgress: true,
        showEta: true,
        output: {
          file: "copy.log",
          overwrite: true,
          unicode: true,
        },
        showUnicode: true,
        showAndLog: true,
        noJobHeader: true,
        noJobSummary: true,
      },
      job: {
        deriveParameters: "Derive Job Name",
        saveParameters: "Save Job Name",
        quiteAfterProcessing: true,
        noSourceDir: true,
        noDestinationDir: true,
        includesFiles: true,
      },
    };
  }

  it("should build all options for a single destination", function () {
    var options = buildOptions("c:/destination/path");

    var result = command(options);

    assert.lengthOf(result, 1);

    expect(result[0].path).to.be.string("robocopy");

    args_should_equal(result[0].args, "c:\\destination\\path");
  });

  it("should build all options for multiple destinations", function () {
    var options = buildOptions([
      "c:/destination/path1",
      "c:/destination/path2",
    ]);

    var result = command(options);

    expect(result).to.have.length(2);

    expect(result[0].path).to.be.equal("robocopy");
    args_should_equal(result[0].args, "c:\\destination\\path1");

    expect(result[1].path).to.be.equal("robocopy");
    args_should_equal(result[1].args, "c:\\destination\\path2");
  });

  function args_should_equal(args, destination) {
    expect(args[0]).to.be.equal('"c:\\source\\path"');
    expect(args[1]).to.be.equal('"' + destination + '"');
    expect(args[2]).to.be.equal('"*.html"');
    expect(args[3]).to.be.equal('"*.js"');
    expect(args[4]).to.be.equal('"\\bin\\*.*"');
    expect(args[5]).to.be.equal("/s");
    expect(args[6]).to.be.equal("/e");
    expect(args[7]).to.be.equal("/lev:1");
    expect(args[8]).to.be.equal("/z");
    expect(args[9]).to.be.equal("/b");
    expect(args[10]).to.be.equal("/zb");
    expect(args[11]).to.be.equal("/efsraw");
    expect(args[12]).to.be.equal("/copy:DAT");
    expect(args[13]).to.be.equal("/dcopy:T");
    expect(args[14]).to.be.equal("/sec");
    expect(args[15]).to.be.equal("/copyall");
    expect(args[16]).to.be.equal("/nocopy");
    expect(args[17]).to.be.equal("/secfix");
    expect(args[18]).to.be.equal("/timfix");
    expect(args[19]).to.be.equal("/purge");
    expect(args[20]).to.be.equal("/mir");
    expect(args[21]).to.be.equal("/mov");
    expect(args[22]).to.be.equal("/move");
    expect(args[23]).to.be.equal("/a+:RASH");
    expect(args[24]).to.be.equal("/a-:CNET");
    expect(args[25]).to.be.equal("/create");
    expect(args[26]).to.be.equal("/fat");
    expect(args[27]).to.be.equal("/256");
    expect(args[28]).to.be.equal("/mon:2");
    expect(args[29]).to.be.equal("/mot:3");
    expect(args[30]).to.be.equal("/MT:4");
    expect(args[31]).to.be.equal("/rh:1030-1130");
    expect(args[32]).to.be.equal("/pf");
    expect(args[33]).to.be.equal("/ipg:5");
    expect(args[34]).to.be.equal("/sl");
    expect(args[35]).to.be.equal("/a");
    expect(args[36]).to.be.equal("/m");
    expect(args[37]).to.be.equal("/ia:RASHC");
    expect(args[38]).to.be.equal("/xa:NETO");
    expect(args[39]).to.be.equal("/xf");
    expect(args[40]).to.be.equal('"~*.*"');
    expect(args[41]).to.be.equal('"*.tmp"');
    expect(args[42]).to.be.equal("/xd");
    expect(args[43]).to.be.equal('"c:\\source\\path\\tmp"');
    expect(args[44]).to.be.equal('"c:\\source\\path\\obj"');
    expect(args[45]).to.be.equal('"' + destination + '\\tmp"');
    expect(args[46]).to.be.equal('"' + destination + '\\obj"');
    expect(args[47]).to.be.equal("/xct");
    expect(args[48]).to.be.equal("/xn");
    expect(args[49]).to.be.equal("/xo");
    expect(args[50]).to.be.equal("/xx");
    expect(args[51]).to.be.equal("/xl");
    expect(args[52]).to.be.equal("/is");
    expect(args[53]).to.be.equal("/it");
    expect(args[54]).to.be.equal("/max:6");
    expect(args[55]).to.be.equal("/min:7");
    expect(args[56]).to.be.equal("/maxage:8");
    expect(args[57]).to.be.equal("/minage:9");
    expect(args[58]).to.be.equal("/maxlad:10");
    expect(args[59]).to.be.equal("/minlad:11");
    expect(args[60]).to.be.equal("/fft");
    expect(args[61]).to.be.equal("/dst");
    expect(args[62]).to.be.equal("/xj");
    expect(args[63]).to.be.equal("/xjd");
    expect(args[64]).to.be.equal("/xjf");
    expect(args[65]).to.be.equal("/r:12");
    expect(args[66]).to.be.equal("/w:13");
    expect(args[67]).to.be.equal("/reg");
    expect(args[68]).to.be.equal("/tbd");
    expect(args[69]).to.be.equal("/l");
    expect(args[70]).to.be.equal("/x");
    expect(args[71]).to.be.equal("/v");
    expect(args[72]).to.be.equal("/ts");
    expect(args[73]).to.be.equal("/fp");
    expect(args[74]).to.be.equal("/bytes");
    expect(args[75]).to.be.equal("/ns");
    expect(args[76]).to.be.equal("/nc");
    expect(args[77]).to.be.equal("/nfl");
    expect(args[78]).to.be.equal("/ndl");
    expect(args[79]).to.be.equal("/np");
    expect(args[80]).to.be.equal("/eta");
    expect(args[81]).to.be.equal('/unilog:"copy.log"');
    expect(args[82]).to.be.equal("/unicode");
    expect(args[83]).to.be.equal("/tee");
    expect(args[84]).to.be.equal("/njh");
    expect(args[85]).to.be.equal("/njs");
    expect(args[86]).to.be.equal('/job:"Derive Job Name"');
    expect(args[87]).to.be.equal('/save:"Save Job Name"');
    expect(args[88]).to.be.equal("/quit");
    expect(args[89]).to.be.equal("/nosd");
    expect(args[90]).to.be.equal("/nodd");
    expect(args[91]).to.be.equal("/if");
  }

  it("should not set thread count if a bool", function () {
    var options = {
      source: "",
      destination: "",
      files: [],
      copy: {
        multiThreaded: true,
      },
    };

    var args = command(options)[0].args;

    expect(args[2]).to.be.string("/MT");
  });

  it("should set non unicode output log", function () {
    var options = {
      source: "",
      destination: "",
      files: [],
      logging: {
        output: {
          file: "copy.log",
          overwrite: true,
        },
      },
    };

    var args = command(options)[0].args;

    expect(args[2]).to.be.string('/log:"copy.log"');
  });

  it("should set appending output log", function () {
    var options = {
      source: "",
      destination: "",
      files: [],
      logging: {
        output: {
          file: "copy.log",
        },
      },
    };

    var args = command(options)[0].args;

    expect(args[2]).to.be.equal('/log+:"copy.log"');
  });

  it("should convert relative paths to absolute", function () {
    var options = {
      source: "c:/source/path/",
      destination: "c:/destination/path/",
      files: [],
      file: {
        excludeDirs: [
          "tmp/",
          "obj/",
          "../yada",
          "c:\\yada",
          "\\\\someserver\\yada",
        ],
      },
    };

    var result = command(options);

    expect(result[0].path).to.be.equal("robocopy");

    var args = result[0].args;

    expect(args.length).to.be.equal(11);

    expect(args[0]).to.be.equal('"c:\\source\\path"');
    expect(args[1]).to.be.equal('"c:\\destination\\path"');
    expect(args[2]).to.be.equal("/xd");
    expect(args[3]).to.be.equal('"c:\\source\\path\\tmp"');
    expect(args[4]).to.be.equal('"c:\\source\\path\\obj"');
    expect(args[5]).to.be.equal('"c:\\source\\yada"');
    expect(args[6]).to.be.equal('"c:\\yada"');
    expect(args[7]).to.be.equal('"\\\\someserver\\yada"');
    expect(args[8]).to.be.equal('"c:\\destination\\path\\tmp"');
    expect(args[9]).to.be.equal('"c:\\destination\\path\\obj"');
    expect(args[10]).to.be.equal('"c:\\destination\\yada"');
  });

  it("should leave paths relative when configured", function () {
    var options = {
      source: "c:/source/path/",
      destination: "c:/destination/path/",
      files: [],
      file: {
        excludeDirs: [
          "tmp/",
          "obj/",
          "../yada",
          "c:\\yada",
          "\\\\someserver\\yada",
        ],
        excludeDirsRelative: true,
      },
    };

    var result = command(options);

    expect(result[0].path).to.be.equal("robocopy");

    var args = result[0].args;

    expect(args.length).to.be.equal(8);

    expect(args[0]).to.be.equal('"c:\\source\\path"');
    expect(args[1]).to.be.equal('"c:\\destination\\path"');
    expect(args[2]).to.be.equal("/xd");
    expect(args[3]).to.be.equal('"tmp"');
    expect(args[4]).to.be.equal('"obj"');
    expect(args[5]).to.be.equal('"..\\yada"');
    expect(args[6]).to.be.equal('"c:\\yada"');
    expect(args[7]).to.be.equal('"\\\\someserver\\yada"');
  });
});
