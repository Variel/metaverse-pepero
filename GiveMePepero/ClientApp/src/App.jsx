import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { RecoilRoot } from "recoil";

import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { GivePage } from "./pages/GivePage";

import { Auth } from "./Auth";

import "./custom.css";
import { LogoutPage } from "./pages/LogoutPage";
import { JoinPage } from "./pages/JoinPage";

export default function App() {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>로딩 중</div>}>
        <Auth />
        <Route exact path="/" component={HomePage} />
        <Switch>
          <Route path="/users/:userId/give" component={GivePage} exact />
          <Route path="/users/:userId" component={ProfilePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/join" component={JoinPage} />
          <Route exact path="/logout" component={LogoutPage} />
        </Switch>
      </React.Suspense>
    </RecoilRoot>
  );
}
