/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { authState } from "../authState";


export function LogoutPage() {
  const history = useHistory();

  const [, setAuthState] = useRecoilState(authState);

  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  setAuthState(null);

  history.push('/login');

  return null;
}