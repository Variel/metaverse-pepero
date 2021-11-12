/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useEffect, useState } from "react";

const checkBoxStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;

  .check-box {
    background: transparent;
    border: 1px solid var(--foreground);
    margin-right: 8px;
    color: var(--foreground);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    border-radius: 4px;
  }

  label {
    margin-bottom: 0;
  }
`;

export function CheckBox({ initialValue, onChange, children }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <div css={checkBoxStyle}>
      <div className="check-box" onClick={(e) => setValue((v) => !v)}>{value && <i className='fal fa-check'></i>}</div>
      <label htmlFor="" onClick={(e) => setValue((v) => !v)}>{children}</label>
    </div>
  );
}
