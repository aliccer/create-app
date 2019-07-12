import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Button from './Button';

const setup = (propOverrides) => {
  const props = Object.assign({
    active: false,
    children: 'All',
    setFilter: jest.fn(),
  }, propOverrides);

  const renderer = createRenderer();
  renderer.render(<Button {...props} />);
  const output = renderer.getRenderOutput();

  return {
    props,
    output,
  };
};

describe('component', () => {
  describe('Button', () => {
    it('should render correctly', () => {
      const { output } = setup();
      expect(output.type).toBe('a');
      expect(output.props.style.cursor).toBe('pointer');
      expect(output.props.children).toBe('All');
    });

    it('should have class selected if active', () => {
      const { output } = setup({ active: true });
      expect(output.props.className).toBe('selected');
    });

    it('should call setFilter on click', () => {
      const { output, props } = setup();
      output.props.onClick();
      expect(props.setFilter).toBeCalled();
    });
  });
});
