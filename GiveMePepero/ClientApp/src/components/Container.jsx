/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React, { Component } from 'react';

const containerStyle = css`
  max-width: 720px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
`;

export function Container({children}) {
  return <div css={containerStyle}>{children}</div>;
}