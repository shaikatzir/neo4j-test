var forever = require('forever'),
    child = new(forever.Monitor)('app.js', {
        'silent': false,
        'pidFile': '/var/run/app.pid',
        'watch': false,
	'options': ['remote'],  // Additional arguments to pass to the script,
	'sourceDir': '.', // Directory that the source script is in
        'watchIgnoreDotFiles': '.foreverignore', // Dot files we should read to ignore ('.foreverignore', etc).
        'watchIgnorePatterns': null, // Ignore patterns to use when watching files.
        'watchDirectory': '.',     // Top-level directory to watch from.
        'logFile': 'logs/forever.log', // Path to log output from forever process (when daemonized)
        'outFile': 'logs/forever.out', // Path to log output from child stdout
        'errFile': 'logs/forever.err'
    });
child.start();
forever.startServer(child);
