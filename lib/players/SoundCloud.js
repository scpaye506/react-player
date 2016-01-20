'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _loadScript = require('load-script');

var _loadScript2 = _interopRequireDefault(_loadScript);

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SDK_URL = '//connect.soundcloud.com/sdk-2.0.0.js';
var SDK_GLOBAL = 'SC';
var RESOLVE_URL = '//api.soundcloud.com/resolve.json';
var MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-]+\/[a-z0-9-]+)$/;

var SoundCloud = function (_Base) {
  _inherits(SoundCloud, _Base);

  function SoundCloud() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, SoundCloud);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SoundCloud)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
      image: null
    }, _this.onStateChange = function (state) {
      if (state === 'playing') _this.onPlay();
      if (state === 'paused') _this.props.onPause();
      if (state === 'loading') _this.props.onBuffer();
      if (state === 'ended') _this.props.onEnded();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SoundCloud, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return _get(Object.getPrototypeOf(SoundCloud.prototype), 'shouldComponentUpdate', this).call(this, nextProps, nextState) || this.state.image !== nextState.image;
    }
  }, {
    key: 'getSDK',
    value: function getSDK() {
      var _this2 = this;

      if (window[SDK_GLOBAL]) {
        return Promise.resolve(window[SDK_GLOBAL]);
      }
      return new Promise(function (resolve, reject) {
        (0, _loadScript2.default)(SDK_URL, function (err) {
          if (err) {
            reject(err);
          } else {
            window[SDK_GLOBAL].initialize({ client_id: _this2.props.soundcloudConfig.clientId });
            resolve(window[SDK_GLOBAL]);
          }
        });
      });
    }
  }, {
    key: 'getSongData',
    value: function getSongData(url) {
      return fetch(RESOLVE_URL + '?url=' + url + '&client_id=' + this.props.soundcloudConfig.clientId).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: 'load',
    value: function load(url) {
      var _this3 = this;

      this.stop();
      this.getSDK().then(function (SC) {
        _this3.getSongData(url).then(function (data) {
          if (url !== _this3.props.url) return; // Abort if url changes during async requests
          var image = data.artwork_url || data.user.avatar_url;
          if (image) {
            _this3.setState({ image: image.replace('-large', '-t500x500') });
          }
          SC.stream(data.uri, function (player) {
            _this3.player = player;
            player._player.on('stateChange', _this3.onStateChange);
            _this3.onReady();
          });
        });
      });
    }
  }, {
    key: 'play',
    value: function play() {
      if (!this.isReady) return;
      this.player.play();
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (!this.isReady) return;
      this.player.pause();
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!this.isReady) return;
      this.player._player.off('stateChange', this.onStateChange);
      this.player.stop();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(fraction) {
      _get(Object.getPrototypeOf(SoundCloud.prototype), 'seekTo', this).call(this, fraction);
      if (!this.isReady) return;
      this.player.seek(this.getDuration(true) * fraction);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(fraction) {
      if (!this.isReady) return;
      this.player.setVolume(fraction);
    }
  }, {
    key: 'getDuration',
    value: function getDuration(ms) {
      if (!this.isReady) return null;
      if (ms) return this.player.getDuration();
      return this.player.getDuration() / 1000;
    }
  }, {
    key: 'getFractionPlayed',
    value: function getFractionPlayed() {
      if (!this.isReady) return null;
      return this.player.getCurrentPosition() / this.getDuration(true);
    }
  }, {
    key: 'getFractionLoaded',
    value: function getFractionLoaded() {
      if (!this.isReady) return null;
      return this.player.getLoadedPosition() / this.getDuration(true);
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        display: this.props.url ? 'block' : 'none',
        height: '100%',
        backgroundImage: this.state.image ? 'url(' + this.state.image + ')' : null,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
      return _react2.default.createElement('div', { style: style });
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(url) {
      return MATCH_URL.test(url);
    }
  }]);

  return SoundCloud;
}(_Base3.default);

SoundCloud.displayName = 'SoundCloud';
exports.default = SoundCloud;