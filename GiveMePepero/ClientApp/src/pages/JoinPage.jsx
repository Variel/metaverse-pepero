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

export function JoinPage() {
  const [, setAuthState] = useRecoilState(authState);

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const api = useApi();
  const history = useHistory();

  const onTypeId = useCallback((val) => {
    setId(val.replace(/[^a-z^\d^_]/g, ''));
  }, []);

  const onJoin = useCallback((e) => {
    e && e.preventDefault();

    (async () => {
      if (name.replace(/\s/g, '').length === 0) {
        setErrorMessage('닉네임을 적어주세요');
        return;
      }
      if (id.replace(/\s/g, '').length === 0) {
        setErrorMessage('아이디를 적어주세요');
        return;
      }
      if (pw.length < 6) {
        setErrorMessage('비밀번호는 6자 이상으로 해주세요');
        return;
      }

      setErrorMessage('');

      let response = await fetch("/api/auth/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          login: id,
          password: pw,
        }),
      });

      if (response.status === 409) {
        setErrorMessage('이미 존재하는 아이디입니다');
        return;
      }

      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: id,
          password: pw,
        }),
      });

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
  }, [api, history, id, name, pw, setAuthState]);

  return (
    <div css={loginPageStyle}>
      <Container>
        <h1>등록하기</h1>
        <p className="text-muted">등록하고 친구들에게 마음을 받으세요</p>

        <form onSubmit={onJoin} className="login-form">
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              placeholder="빼로롱"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => onTypeId(e.target.value)}
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              maxLength={100}
            />
            <p className="text-danger mt-2">{errorMessage}</p>
          </div>
          <div className="form-group">
            <div className="d-flex align-items-center mt-4">
              <Link to="/login">이미 계정이 있어요</Link>
              <button type="submit" className="btn-login ml-auto" onClick={onJoin}>
                <i className="fad fa-heart mr-1"></i> 가입
              </button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
