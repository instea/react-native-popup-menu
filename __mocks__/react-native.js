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

class ListView extends React.Component {
    static DataSource() {
    }
}

class AppRegistry {
    static registerComponent () {
    }
}

// TODO: use better approach
const dimensions = {
  get: () => ({ width: 400, height: 600 })
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
ReactNative.Dimensions = dimensions;
ReactNative.AppRegistry = AppRegistry;

module.exports = ReactNative;
