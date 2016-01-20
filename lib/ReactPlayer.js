'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('array.prototype.find');

var _props = require('./props');

var _players = require('./players');

var _players2 = _interopRequireDefault(_players);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PROGRESS_FREQUENCY = 500;

var ReactPlayer = function (_Component) {
  _inherits(ReactPlayer, _Component);

  function ReactPlayer() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactPlayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ReactPlayer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.seekTo = function (fraction) {
      var player = _this.refs.player;
      if (player) {
        player.seekTo(fraction);
      }
    }, _this.progress = function () {
      if (_this.props.url && _this.refs.player) {
        var progress = {};
        var loaded = _this.refs.player.getFractionLoaded();
        var played = _this.refs.player.getFractionPlayed();
        if (loaded !== null && loaded !== _this.prevLoaded) {
          progress.loaded = _this.prevLoaded = loaded;
        }
        if (played !== null && played !== _this.prevPlayed) {
          progress.played = _this.prevPlayed = played;
        }
        if (progress.loaded || progress.played) {
          _this.props.onProgress(progress);
        }
      }
      _this.progressTimeout = setTimeout(_this.progress, PROGRESS_FREQUENCY);
    }, _this.renderPlayer = function (Player) {
      var active = Player.canPlay(_this.props.url);
      var _this$props = _this.props;
      var youtubeConfig = _this$props.youtubeConfig;
      var soundcloudConfig = _this$props.soundcloudConfig;
      var vimeoConfig = _this$props.vimeoConfig;

      var activeProps = _objectWithoutProperties(_this$props, ['youtubeConfig', 'soundcloudConfig', 'vimeoConfig']);

      var props = active ? _extends({}, activeProps, { ref: 'player' }) : {};
      return _react2.default.createElement(Player, _extends({
        key: Player.displayName,
        youtubeConfig: youtubeConfig,
        soundcloudConfig: soundcloudConfig,
        vimeoConfig: vimeoConfig
      }, props));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.progress();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.progressTimeout);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.url !== nextProps.url || this.props.playing !== nextProps.playing || this.props.volume !== nextProps.volume;
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        width: this.props.width,
        height: this.props.height
      };
      return _react2.default.createElement(
        'div',
        { style: style, className: this.props.className },
        _players2.default.map(this.renderPlayer)
      );
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(url) {
      return _players2.default.some(function (player) {
        return player.canPlay(url);
      });
    }
  }]);

  return ReactPlayer;
}(_react.Component);

ReactPlayer.displayName = 'ReactPlayer';
ReactPlayer.propTypes = _props.propTypes;
ReactPlayer.defaultProps = _props.defaultProps;
exports.default = ReactPlayer;