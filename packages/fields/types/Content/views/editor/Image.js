/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useLayoutEffect } from 'react';
import { Popper } from 'react-popper';
import { useStateWithEqualityCheck } from './hooks';

let Render = ({ children }) => children();

let popperModifiers = { preventOverflow: { enabled: false }, flip: { enabled: false } };

let Image = ({ alignment, attributes, isFocused, src, onAlignmentChange, ...props }) => {
  let [referenceElement, setReferenceElement] = useStateWithEqualityCheck(null);

  return (
    <div>
      <img
        {...props}
        {...attributes}
        data-focused={isFocused}
        selected={isFocused}
        src={src}
        ref={setReferenceElement}
        css={{
          width: '100%',
          outline: isFocused ? 'auto' : null,
        }}
      />
      <Popper modifiers={popperModifiers} placement="top" referenceElement={referenceElement}>
        {({ style, ref, scheduleUpdate }) => {
          return (
            <Render>
              {() => {
                useLayoutEffect(scheduleUpdate, [alignment]);
                return (
                  <div
                    ref={ref}
                    css={{
                      display: isFocused ? 'block' : 'none',
                      backgroundColor: 'black',
                      padding: 8,
                    }}
                    style={style}
                  >
                    {['left', 'center', 'right'].map(align => {
                      return (
                        <button
                          type="button"
                          key={align}
                          onMouseDown={event => {
                            // so that the image block doesn't get deselected
                            event.preventDefault();
                          }}
                          onClick={() => {
                            onAlignmentChange(align);
                          }}
                        >
                          {align}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            </Render>
          );
        }}
      </Popper>
    </div>
  );
};

export default Image;
