/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useState } from "react";
import { Route, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useApi } from "../api";
import { authState } from "../authState";
import { Container } from "../components/Container";
import { mobile } from "../helpers/media-query";

const loginPageStyle = css`
  margin-top: 48px;
  margin-bottom: 16px;

  h1 {
    max-width: 360px;
    overflow: hidden;

    margin: 0 auto 8px 0;

    font-size: 32px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .login-form {
    width: 100%;
    max-width: 270px;

    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      margin-bottom: 4px;
    }

    input[type="text"],
    input[type="password"] {
      width: 100%;
      padding: 8px;
      border-radius: 8px;

      background: transparent;
      border: 1px solid var(--foreground);

      color: var(--foreground);
    }
  }

  .btn-login {
    flex-shrink: 0;

    color: white;
    border-color: #c869ff;
    background: #c869ff;
    border-width: 2px;
    border-style: solid;
    padding: 6px 12px;

    border-radius: 18px;
    font-size: 14px;
  }
`;

export function LoginPage() {
  const [, setAuthState] = useRecoilState(authState);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const api = useApi();
  const history = useHistory();

  const onLogin = useCallback((e) => {
    e && e.preventDefault();

    (async () => {
      setErrorMessage('');

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: id,
          password: pw,
        }),
      });

      if (response.status === 401) {
        setErrorMessage('로그인 정보가 올바르지 않습니다');
        return;
      }

      const {accessToken, refreshToken} = await response.json();

      const me = await api.get('/api/users/me', accessToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setAuthState({
        accessToken,
        refreshToken,
        user: me
      });

      history.push(`/users/${me.id}`);
    })();

    return false;
  }, [api, history, id, pw, setAuthState]);

  return (
    <div css={loginPageStyle}>
      <Container>
        <h1>로그인</h1>
        <p className="text-muted">로그인 하고 마음을 전하세요</p>

        <form onSubmit={onLogin} className="login-form">
          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              placeholder="ID"
              onChange={(e) => setId(e.target.value)}
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPw(e.target.value)}
              maxLength={100}
            />
            <p className="text-danger mt-2">{errorMessage}</p>
          </div>
          <div className="form-group">
            <div className="d-flex align-items-center mt-4">
              <Link to="/join">계정 만들기</Link>
              <button type="submit" className="btn-login ml-auto" onClick={onLogin}>
                <i className="fad fa-heart mr-1"></i> 로그인
              </button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
