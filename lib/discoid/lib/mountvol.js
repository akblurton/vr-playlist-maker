'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Initializes the mountvol constructor.
 * @constructor
 * @param {string} listing - Provive command results manually (ex: testing)
 */
var mountvol = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(listing) {
        var results;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        results = void 0;

                        if (listing) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 4;
                        return exec();

                    case 4:
                        listing = _context.sent;

                    case 5:
                        return _context.abrupt('return', parse(listing));

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function mountvol(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * Execute the mountvol application.
 * @constructor
 */
var exec = function exec() {
    var exec = require('child_process').exec;
    var command = "mountvol";

    return new Promise(function (res, rej) {
        exec(command, function (error, stdout, stderr) {
            if (error) rej(error);else res(stdout);
        });
    });
};

/**
 * Parses the results of the mountvol command.
 * @constructor
 * @param {string} results - The mountvol results to be parsed
 */
var parse = function parse(results) {
    // TODO: Convert this to a stream

    var i = 0;
    var volumes = [];
    var results = results.toString().split("\n");

    while (i < results.length) {
        var line = results[i].trim();
        var nextLine = results[i + 1];
        var isPath = (0, _lodash2.default)(line).startsWith('\\');

        if (isPath) {
            var obj = buildVolObject(line, nextLine);
            volumes.push(obj);
        }

        i++;
    }

    return volumes;
};

/**
 * Build a volume object based on a given UNC path
 * @constructor
 * @param {string} uncPath - Full UNC path of a volume
 * @param {string} firstMount - raw string of the first mount
 */
var buildVolObject = function buildVolObject(uncPath, firstMount) {
    var obj = {};
    var guid = parseGuid(uncPath);
    var unc = buildUnc(guid);
    var mount = parseMount(firstMount);

    if (guid) obj.guid = guid;
    if (unc) obj.unc = unc;
    if (mount) obj.mounts = [mount];

    return obj;
};

/**
 * Build a UNC path from a guid.
 * @constructor
 * @param {string} guid - The GUID for a given volume
 */
var buildUnc = function buildUnc(guid) {
    return _util2.default.format('\\\\?\\Volume{%s}\\', guid);
};

/**
 * Obtain the raw guid from the given path.
 * @constructor
 * @param {string} path - path containing the guid
 */
var parseGuid = function parseGuid(path) {
    return path.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/i)[0];
};

/**
 * Obtain the mount point of a volume.
 * @constructor
 * @param {string} mount - possible mount point
 */
var parseMount = function parseMount(mount) {
    var mount = mount.trim();
    var matches = mount.match(/[a-zA-Z]:\\/);

    if (matches === null) return null;else return matches[0];
};

module.exports = mountvol;
//# sourceMappingURL=mountvol.js.map