/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useState } from "react";

const selectorStyle = css`
  display: flex;
  max-width: 200px;
  margin: 0 auto;

  font-size: 20px;
  font-weight: 300;

  border: 1px solid var(--foreground);
  border-radius: 20px;
  
  text-align: center;

  .to-left,
  .to-right {
    width: 20%;
    flex-basis: auto;
  }
  .to-left {
    border-right: 1px solid var(--foreground);
  }
  .to-right {
    border-left: 1px solid var(--foreground);
  }
  .current {
    flex-grow: 1;
  }
`;

export function SpinSelector({ min, max, init, onChange }) {
  const [number, setNumber] = useState(init);

  const changeNumber = useCallback(
    (n) => {
      if (n > max) {
        n = min;
      }
      if (n < min) {
        n = max;
      }
      setNumber(n);

      if (onChange) {
        onChange(n);
      }
    },
    [max, min, setNumber, onChange]
  );

  return (
    <div css={selectorStyle}>
      <div className="to-left" onClick={() => changeNumber(number - 1)}>
        <i className="fal fa-angle-left"></i>
      </div>
      <div className="current">{number}</div>
      <div className="to-right" onClick={() => changeNumber(number + 1)}>
        <i className="fal fa-angle-right"></i>
      </div>
    </div>
  );
}
