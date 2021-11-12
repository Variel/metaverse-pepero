/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React, { Component } from "react";
import { Route, useHistory, useParams } from "react-router";
import { mobile } from '../helpers/media-query';

const peperoStyle = css`
  flex-basis: auto;
  width: 20%;
  padding: 16px;

  text-align: center;

  ${mobile} {
    width: 25%;
    padding: 8px;
  }

  .pepero-package {
    max-width: 100%;
    width: 150px;
    aspect-ratio: 1;
    margin: 0 auto;
    display: block;
  }

  .giver-name {
    margin: 8px auto 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
  }
`;

export function PeperoItem({ receiverId, item }) {
  const history = useHistory();

  return (
    <div className="list-item" css={peperoStyle} onClick={() => history.push(`/users/${receiverId}/peperos/${item.id}`)} >
      <img className="pepero-package" src={item.packageImage} alt="pepero" />
      <div className="giver-name text-subduded">{item.giverName}</div>
    </div>
  );
}
