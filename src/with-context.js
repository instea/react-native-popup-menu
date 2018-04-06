import React from "react";

export function withContext(Context, propName = "context") {
  return function wrap(Component) {
    class EnhanceContext extends React.Component {
      render() {
        const { forwardedRef, ...rest } = this.props;

        return (
          <Context.Consumer>
            {value => {
              const custom = {
                [propName]: value,
                ref: forwardedRef
              };
              return <Component {...custom} {...rest} />;
            }}
          </Context.Consumer>
        );
      }
    }

    const name = Component.displayName || Component.name || "Component";
    const consumerName =
      Context.Consumer.displayName ||
      Context.Consumer.name ||
      "Context.Consumer";

    function enhanceForwardRef(props, ref) {
      return <EnhanceContext {...props} forwardedRef={ref} />;
    }

    enhanceForwardRef.displayName = `enhanceContext-${consumerName}(${name})`;

    enhanceForwardRef.defaultProps = Component.defaultProps;
    enhanceForwardRef.propTypes = Component.propTypes;

    return React.forwardRef(enhanceForwardRef);
  };
}
