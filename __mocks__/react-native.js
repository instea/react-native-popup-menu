const React = require('react');
const ReactNative = React;

ReactNative.StyleSheet = {
  create: function create(styles) {
      return styles;
  }
};

class View extends React.Component {
  render() { return false; }
}

View.propTypes = {
  style: () => null
};

class ListView extends React.Component {
  static DataSource() {
  }
}

class AppRegistry {
  static registerComponent () {
  }
}

const Animated = {
  timing: () => ({ start: () => undefined }),
  Value: () => ({ interpolate: () => false }),
  View: View
};

const Text = () => "Text";
const TouchableHighlight = () => false;
const TouchableWithoutFeedback = () => false;
const TouchableOpacity = () => false;
const ToolbarAndroid = () => false;
const Image = () => false;
const ScrollView = () => false;

ReactNative.View = View;
ReactNative.ScrollView = ScrollView;
ReactNative.ListView = ListView;
ReactNative.Text = Text;
ReactNative.TouchableOpacity = TouchableOpacity;
ReactNative.TouchableHighlight = TouchableHighlight;
ReactNative.TouchableWithoutFeedback = TouchableWithoutFeedback;
ReactNative.ToolbarAndroid = ToolbarAndroid;
ReactNative.Image = Image;
ReactNative.AppRegistry = AppRegistry;
ReactNative.Animated = Animated;

module.exports = ReactNative;
