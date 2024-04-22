import { _ as _asyncToGenerator, a as _regeneratorRuntime, c as chalk, o as ora, e as execa, z, C as Command, i as installDependencies, g as getNearestPackageJson, b as getPackageManager } from './installDependencies-B80Fk2Wp.js';
import { existsSync } from 'fs';
import path from 'path';
import 'events';
import 'child_process';
import 'process';
import 'node:process';
import 'assert';
import 'node:fs';
import 'node:path';
import 'node:buffer';
import 'node:child_process';
import 'node:url';
import 'node:os';
import 'node:timers/promises';
import 'stream';
import 'node:util';
import 'os';
import 'tty';
import 'readline';
import 'fs/promises';

var runInitPandacss = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(packageJsonPath, packageManager, cwd) {
    var styledSystemPath, initSpinner;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          styledSystemPath = path.join(path.dirname(packageJsonPath), "styled-system");
          if (!existsSync(styledSystemPath)) {
            _context.next = 6;
            break;
          }
          console.log("".concat(chalk.green("Success!"), " Project initialization completed. You may now add components."));
          process.exit(1);
          _context.next = 19;
          break;
        case 6:
          console.log("You need to run 'panda init' to use this command");
          initSpinner = ora("Running panda init...").start();
          _context.prev = 8;
          _context.next = 11;
          return execa(packageManager, ["panda", "init"], {
            cwd: cwd
          });
        case 11:
          initSpinner.succeed("panda init runned successfully.\n");
          console.log("".concat(chalk.green("Success!"), " Project initialization completed. You may now add components."));
          process.exit(1);
          _context.next = 19;
          break;
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](8);
          console.error("Error running panda init", _context.t0);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[8, 16]]);
  }));
  return function runInitPandacss(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var initOptionSchema = z.object({
  cwd: z.string(),
  path: z.string()
});
var program = new Command();
var init = program.name("init").description("initialize your project and install dependencies").option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd()).option("-p, --path <path>", "the path to add the component to.", process.cwd()).action( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(opts) {
    var options, cwd, packageJsonPath, packageManager, pandaCssPath, installSpinner;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          options = initOptionSchema.parse(opts);
          cwd = path.resolve(options.cwd);
          if (!existsSync(options.path) || !existsSync(cwd)) {
            console.error("The path does not exist. Please try again.");
            process.exit(1);
          }
          packageJsonPath = getNearestPackageJson(options.path);
          if (!packageJsonPath) {
            _context2.next = 12;
            break;
          }
          _context2.next = 7;
          return getPackageManager(cwd);
        case 7:
          packageManager = _context2.sent;
          pandaCssPath = path.join(path.dirname(packageJsonPath), "node_modules", "@pandacss", "dev", "package.json");
          if (!existsSync(pandaCssPath)) {
            console.log("You need to install '@pandacss/dev' to use this command");
            installSpinner = ora("Installing... @pandacss/dev\n").start();
            installDependencies(packageManager, ["@pandacss/dev"], options.path, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    installSpinner.succeed("@pandacss/dev installed successfully.\n");
                    runInitPandacss(packageJsonPath, packageManager, options.path);
                  case 2:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            })));
          } else {
            runInitPandacss(packageJsonPath, packageManager, options.path);
          }
          _context2.next = 13;
          break;
        case 12:
          console.error("node_modules or package.json not found in the current directory or its parent directories");
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
program.parse();

export { init };
