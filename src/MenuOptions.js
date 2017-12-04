import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

class MenuOptions extends React.Component {

  updateCustomStyles(_props) {
    const { customStyles } = _props
    const menu = this.context.menuActions._getOpenedMenu()
    const menuName = menu.instance.getName()
    console.log('=== set styles', menuName, customStyles)
    this.context.menuRegistry.setOptionsCustomStyles(menuName, customStyles)
  }

  componentWillReceiveProps(nextProps) {
    this.updateCustomStyles(nextProps)
  }

  componentDidMount() {
    this.updateCustomStyles(this.props)
  }

  render() {
    const { customStyles, style, children } = this.props
    return (
      <View style={[customStyles.optionsWrapper, style]}>
        {children}
      </View>
    )
  }
}

MenuOptions.propTypes = {
  customStyles: PropTypes.object,
  renderOptionsContainer: PropTypes.func,
  optionsContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

MenuOptions.defaultProps = {
  customStyles: {},
};

MenuOptions.contextTypes = {
  menuRegistry: PropTypes.object,
  menuActions: PropTypes.object,
};

export default MenuOptions;
