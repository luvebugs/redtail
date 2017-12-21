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

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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


function toGetter(value) {
    return 'get' + value.charAt(0).toUpperCase() + value.slice(1);
}
function toSetter(value) {
    return 'set' + value.charAt(0).toUpperCase() + value.slice(1);
}
var connect = exports.connect = function connect(states) {
    var getters = mapGetters(states.map(function (state) {
        return toGetter(state);
    }));
    var actions = mapActions(states.map(function (state) {
        return toSetter(state);
    }));

    var watch = {};
    var _data = {};
    states.forEach(function (state) {
        watch[toGetter(state)] = {
            handler: function handler(value) {
                this[state] = (0, _extends3.default)({}, value);
            },

            deep: true,
            immediate: true
        };
        watch[state] = {
            handler: function handler(value) {
                this[toSetter(state)](value);
            },

            deep: true,
            immediate: true
        };
        _data[state] = {};
    });

    var mixin = {
        data: function data() {
            return _data;
        },
        watch: watch,
        computed: (0, _extends3.default)({}, getters),
        methods: (0, _extends3.default)({}, actions)
    };
    return function (component) {
        component.mixins = [mixin];
        return component;
    };
};

function getMutation(key) {
    return function (key) {
        return function (state, payload) {
            if ((typeof payload === 'undefined' ? 'undefined' : (0, _typeof3.default)(payload)) === 'object' && !payload.length) {
                for (var index in payload) {
                    if (payload.hasOwnProperty(index)) {
                        var element = payload[index];
                        state[key][index] = element;
                    }
                }
            } else {
                state[key] = payload;
            }
        };
    }(key);
}

function getGetter(key) {
    return function (state) {
        return state[key];
    };
}

function compose(model, namespace) {
    var state = model.state;

    var actions = {};

    var _loop = function _loop(key) {
        if (typeof model[key] === 'function') {
            actions[key] = function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(handler, payload) {
                    var commit, dispatch;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    dispatch = function dispatch() {
                                        if (arguments.length === 1) {
                                            var _state3 = arguments[0];
                                            return _state3.type ? handler.dispatch(_state3) : handler.dispatch(namespace, _state3, { root: true });
                                        } else {
                                            var type = arguments[0];
                                            var _state4 = arguments[1];
                                            return handler.dispatch(type, _state4, { root: true });
                                        }
                                    };

                                    commit = function commit() {
                                        if (arguments.length === 1) {
                                            var _state = arguments[0];
                                            return _state.type ? handler.commit(_state) : handler.commit(namespace, _state, { root: true });
                                        } else {
                                            var type = arguments[0];
                                            var _state2 = arguments[1];
                                            return handler.commit(type, _state2, { root: true });
                                        }
                                    };

                                    ;
                                    ;
                                    _context.next = 6;
                                    return model[key].apply(this, [(0, _extends3.default)({}, handler, { commit: commit, dispatch: dispatch }), payload]);

                                case 6:
                                    return _context.abrupt('return', _context.sent);

                                case 7:
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
    for (var key in state) {
        mutations[key] = getMutation(key);
        getters[toGetter(key)] = getGetter(key);
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
        modules = _ref2.modules,
        plugins = _ref2.plugins;

    _vue2.default.use(_vuex2.default);
    var res = {};
    (0, _keys2.default)(modules).forEach(function (key) {
        var module = compose(modules[key], key);
        res[key] = module;
        mutations[key] = getMutation(key);
        getters[toGetter(key)] = getGetter(key);
        actions[toSetter(key)] = function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref4, payload) {
                var commit = _ref4.commit;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt('return', commit(key, payload));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            return function (_x3, _x4) {
                return _ref3.apply(this, arguments);
            };
        }();
    });
    var store = new _vuex2.default.Store({
        actions: actions,
        getters: getters,
        mutations: mutations,
        modules: res,
        strict: true,
        plugins: plugins
    });
    return store;
};