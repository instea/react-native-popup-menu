/* globals jest, test, expect */
import 'react-native';
import React from 'react';

jest.mock('react-native-popup-menu', () => ({
  Menu: 'Menu',
  MenuProvider: 'MenuProvider',
  MenuOptions: 'MenuOptions',
  MenuOption: 'MenuOption',
  MenuTrigger: 'MenuTrigger',
}));

import BasicExample from '../BasicExample';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <BasicExample />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
