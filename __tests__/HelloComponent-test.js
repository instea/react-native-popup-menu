import React from 'react';
import { View } from 'react-native';
import utils from 'react-addons-test-utils';

jest.dontMock('./HelloComponent');
const HelloComponent = require('./HelloComponent').default;

describe('HelloComponent', () => {

  it('should render hello world', () => {
    const renderer = utils.createRenderer();
    renderer.render(
      <HelloComponent />
    );
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children.props.children).toBe("Hello world!");
  });

});
