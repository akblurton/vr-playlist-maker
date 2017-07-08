'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromPath = exports.list = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Network Mounts
// Get-WmiObject Win32_LogicalDisk | where -property DriveType -eq 4 | convertto-json

// Local Volumes
// get-volume | convertto-json

var list = exports.list = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$local = _ref2.local,
        local = _ref2$local === undefined ? true : _ref2$local,
        _ref2$network = _ref2.network,
        network = _ref2$network === undefined ? true : _ref2$network;

    var isWin, results, obj, discsLocal, _obj, discsNetwork;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isWin = /^win/.test(process.platform);
            results = [];

            if (!isWin) {
              _context.next = 16;
              break;
            }

            if (!local) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return getLocalMounts();

          case 6:
            obj = _context.sent;
            discsLocal = parseLocalResults(obj);


            results = [].concat((0, _toConsumableArray3.default)(results), (0, _toConsumableArray3.default)(discsLocal));

          case 9:
            if (!network) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return getNetworkMounts();

          case 12:
            _obj = _context.sent;
            discsNetwork = parseNetworkResults(_obj);


            results = [].concat((0, _toConsumableArray3.default)(results), (0, _toConsumableArray3.default)(discsNetwork));

          case 15:
            return _context.abrupt('return', results);

          case 16:
            return _context.abrupt('return', Promise.resolve([]));

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function list() {
    return _ref.apply(this, arguments);
  };
}();

var fromPath = exports.fromPath = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(path) {
    var isWin;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isWin = /^win/.test(process.platform);
            return _context2.abrupt('return', Promise.resolve([]));

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function fromPath(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _mountvol = require('./mountvol');

var _mountvol2 = _interopRequireDefault(_mountvol);

var _windowsPowershell = require('windows-powershell');

var _windowsPowershell2 = _interopRequireDefault(_windowsPowershell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getNetworkMounts() {
  var cmd = _windowsPowershell2.default.pipe('Get-WmiObject Win32_LogicalDisk', 'where -property DriveType -eq 4');

  return _windowsPowershell2.default.shell(_windowsPowershell2.default.toJson(cmd));
}

function getLocalMounts() {
  var cmd = _windowsPowershell2.default.pipe('get-volume', 'where -property DriveType -ne 9999');

  return _windowsPowershell2.default.shell(_windowsPowershell2.default.toJson(cmd));
}

function getUUIDFromQualifiers(qualifiers) {
  return trimTrailingSlash(qualifiers.filter(function (q) {
    return q.Name === 'UUID';
  })[0].Value);
}

function getUUIDFromPath(path) {
  return path.split('\\')[3].slice(7, -2);
}

function getHost(path) {
  return path.split('\\')[2];
}

function parseNetworkResults(obj) {
  if (!('json' in obj)) return []; // No network volumes mounts

  if (!('0' in obj.json)) obj.json = { '0': obj.json };

  return Object.entries(obj.json).map(function (_ref4) {
    var _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
        key = _ref5[0],
        val = _ref5[1];

    return {
      host: getHost(val.providerName),
      size: val.size,
      unc: val.providerName,
      letter: val.name[0],
      free: val.freeSpace,
      fs: val.fileSystem,
      uuid: getUUIDFromQualifiers(val.qualifiers),
      type: 'network'
    };
  });
}

function parseLocalResults(obj) {
  if (!('0' in obj.json)) obj.json = { '0': obj.json };

  var discs = Object.entries(obj.json).map(function (_ref6) {
    var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
        key = _ref7[0],
        val = _ref7[1];

    return val;
  }).filter(filterReserved);

  return discs.map(function (val) {
    return {
      size: val.size,
      unc: val.uniqueId.slice(0, -1),
      letter: val.driveLetter,
      free: val.sizeRemaining,
      fs: val.fileSystem,
      host: val.cimSystemProperties.serverName.toLowerCase(),
      uuid: getUUIDFromPath(val.uniqueId),
      type: val.driveType.toLowerCase(val.uniqueId)
    };
  });
}

function trimTrailingSlash(path) {
  return path.slice(0, -1).slice(1);
}

function filterReserved(disc) {
  return disc.fileSystemLabel !== 'System Reserved';
}
//# sourceMappingURL=discoid.js.map