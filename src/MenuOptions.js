import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withCtx } from './MenuProvider';

export class MenuOptions extends React.Component {

  updateCustomStyles(_props) {
    const { customStyles } = _props
    const menu = this.props.ctx.menuActions._getOpenedMenu()
    // FIXME react 16.3 workaround for ControlledExample!
    if (!menu) return
    const menuName = menu.instance.getName()
    this.props.ctx.menuRegistry.setOptionsCustomStyles(menuName, customStyles)
  }

  componentDidMount() {
    this.updateCustomStyles(this.props)
  }

  componentDidUpdate() {
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

export default withCtx(MenuOptions);
