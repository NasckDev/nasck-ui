import { act, renderHook } from '@testing-library/react';
import { cx } from './cx';
import { getFocusableElements } from './focusable';
import { useControllableState } from './useControllableState';

describe('cx', () => {
  it('joins only truthy class names', () => {
    expect(cx('a', false, undefined, 'b', null, '')).toBe('a b');
  });
});

describe('getFocusableElements', () => {
  it('ignores disabled, hidden and negative tabindex elements', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button>ok</button>
      <button disabled>no</button>
      <input type="hidden" />
      <a href="#x">link</a>
      <div tabindex="-1">no</div>
      <div tabindex="0" aria-hidden="true">no</div>`;
    expect(getFocusableElements(root).map((el) => el.tagName)).toEqual(['BUTTON', 'A']);
  });
});

describe('useControllableState', () => {
  it('manages internal state when uncontrolled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue: 1, onChange }),
    );
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('reflects the controlled value and only notifies', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 5, defaultValue: 1, onChange }),
    );
    act(() => result.current[1](9));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(9);
  });
});
