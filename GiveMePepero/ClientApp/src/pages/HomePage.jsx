import React, { Component } from "react";
import { Route, useHistory } from "react-router";
import { useRecoilValue } from "recoil";
import { userState } from "../authState";
import { Container } from "../components/Container";

export function HomePage() {
  const history = useHistory();
  const me = useRecoilValue(userState);

  if (me) {
    history.push(`/users/${me.id}`);
  } else {
    history.push('/login');
  }

  return null;
}
