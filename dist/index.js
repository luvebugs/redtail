'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = exports.connect = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapGetters = _vuex2.default.mapGetters,
    mapActions = _vuex2.default.mapActions,
    mapState = _vuex2.default.mapState,
    Store = _vuex2.default.Store;
var connect = exports.connect = function connect(states) {
    // console.log('connect>>>>>>>>>>>>>>>>>>>>>>>.');
    var getters = mapGetters(states);
    return function (component) {
        component.computed = (0, _extends3.default)({}, component.computed, getters);
        return component;
    };
};

function compose(model, namespace) {
    // console.log('compose>>>>>>>>>>>>>>>>>>>>>>>.');
    var state = model.state;

    var actions = {};

    var _loop = function _loop(key) {
        if (typeof model[key] === 'function') {
            actions[key] = function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(action, payload) {
                    var commit;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    commit = function commit(type, state) {
                                        if (arguments.length === 1) {
                                            state = type;
                                            type = false;
                                        }
                                        action.commit(type ? type : namespace, state, { root: true });
                                    };

                                    ;
                                    _context.next = 4;
                                    return model[key].apply(this, [{ commit: commit, state: action.state }, payload]);

                                case 4:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }();
        }
    };

    for (var key in model) {
        _loop(key);
    }
    var getters = {};
    var mutations = {};

    var _loop2 = function _loop2(key) {
        mutations[key] = function (key) {
            return function (state, payload) {
                return state[key] = (0, _extends3.default)({}, state[key], payload);
            };
        }(key);
        getters[key] = function (state) {
            return state[key];
        };
    };

    for (var key in state) {
        _loop2(key);
    }
    return (0, _extends3.default)({}, model, {
        actions: actions,
        getters: getters,
        mutations: mutations
    });
};

var init = exports.init = function init(_ref2) {
    var _ref2$actions = _ref2.actions,
        actions = _ref2$actions === undefined ? {} : _ref2$actions,
        _ref2$getters = _ref2.getters,
        getters = _ref2$getters === undefined ? {} : _ref2$getters,
        _ref2$mutations = _ref2.mutations,
        mutations = _ref2$mutations === undefined ? {} : _ref2$mutations,
        modules = _ref2.modules;

    _vue2.default.use(_vuex2.default);
    var res = {};
    (0, _keys2.default)(modules).forEach(function (key) {
        var module = compose(modules[key], key);
        res[key] = module;
        mutations[key] = function (key) {
            return function (state, payload) {
                return state[key] = (0, _extends3.default)({}, state[key], payload);
            };
        }(key);
        getters[key] = function (state) {
            return state[key];
        };
    });
    // console.log(res);
    var store = new _vuex2.default.Store({
        actions: actions,
        getters: getters,
        mutations: mutations,
        modules: res
    });
    return store;
};