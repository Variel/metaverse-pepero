/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useState } from "react";
import { CSSTransition } from "react-transition-group";

const presentStyle = css`
  @keyframes floating {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-16px);
    }
  }

  animation: floating 1s ease-in-out alternate infinite;
  position: relative;

  width: 180px;
  max-width: 75%;

  margin: 8px auto 0;

  &:before {
    content: " ";
    display: block;
    padding-top: 100%;
  }

  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;

    &.fade-enter {
      opacity: 0;
    }

    &.fade-enter-active {
      opacity: 1;
      transition: opacity 1s;
    }

    &.fade-exit {
      opacity: 1;
    }

    &.fade-exit-active {
      opacity: 0;
      transition: opacity 1s;
    }
  }
`;

export function Present({ item, canOpen }) {
  const [revealed, setRevealed] = useState();

  return (
    <div css={presentStyle}>
      <CSSTransition
        in={!revealed}
        classNames="fade"
        timeout={1000}
        unmountOnExit
      >
        <img
          src={item.packageImage}
          className="package"
          alt="package"
          onClick={() => canOpen && setRevealed(true)}
        />
      </CSSTransition>

      <CSSTransition
        in={revealed}
        classNames="fade"
        timeout={1000}
        unmountOnExit
      >
        <img
          src={item.peperoImage}
          className="pepero"
          alt="pepero"
          onClick={() => canOpen && setRevealed(false)}
        />
      </CSSTransition>
    </div>
  );
}
