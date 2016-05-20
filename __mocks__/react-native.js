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
  Value: class {},
  View: View
};

ReactNative.View = View;
ReactNative.ScrollView = View;
ReactNative.ListView = ListView;
ReactNative.Text = View;
ReactNative.TouchableOpacity = View;
ReactNative.TouchableHighlight = View;
ReactNative.TouchableWithoutFeedback = View;
ReactNative.ToolbarAndroid = View;
ReactNative.Image = View;
ReactNative.AppRegistry = AppRegistry;
ReactNative.Animated = Animated;

module.exports = ReactNative;
