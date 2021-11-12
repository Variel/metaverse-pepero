/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useEffect, useState } from "react";
import { Route, useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useSWR from "swr";
import { useFetcher } from "../fetcher";
import { Container } from "../components/Container";
import { PeperoList } from "../components/PeperoList";
import { PeperoPopup } from "../components/PeperoPopup";
import { dark, mobile } from "../helpers/media-query";
import { userState } from "../authState";
import { useRecoilValue } from "recoil";

const profileStyle = css`
  .btn-start {
    margin-top: 16px;
    margin-bottom: -16px;

    color: var(--foreground);
    border-style: solid;
    border-color: var(--foreground);
    border-width: 2px;

    padding: 6px 12px;

    background: transparent;

    border-radius: 18px;
    font-size: 14px;
  }

  .header-items {
    display: flex;
    align-items: flex-end;

    margin-top: 48px;
    margin-bottom: 16px;

    ${mobile} {
      display: block;
    }

    h1 {
      max-width: 360px;
      overflow: hidden;

      margin: 0 auto 0 0;

      font-size: 32px;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-present {
      flex-shrink: 0;

      color: white;
      border-color: #c869ff;
      background: #c869ff;
      border-width: 2px;

      border-radius: 18px;
      font-size: 14px;

      ${mobile} {
        margin-top: 16px;
        margin-bottom: 8px;
        margin-left: -4px;
      }
    }
  }
`;

const copyLink = () => {
  const el = document.createElement("textarea");
  el.value = window.location.href;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export function ProfilePage() {
  const fetcher = useFetcher();
  const { userId } = useParams();
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher);
  const me = useRecoilValue(userState);
  const history = useHistory();

  const [linkCopied, setLinkCopied] = useState(false);

  const onCopyLink = useCallback(() => {
    copyLink();
    setLinkCopied(true);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (linkCopied) {
        setLinkCopied(false);
      }
    }, 3000);
    return () => {
      clearTimeout(timerId);
    };
  }, [linkCopied]);

  const onMeToo = useCallback(() => {
    if (me) {
      history.push(`/users/${me.id}`);
    } else {
      history.push("/login");
    }
  }, [history, me]);

  const onLogout = useCallback(
    () => {
      history.push('/logout');
    },
    [history],
  )

  if (!user) {
    return <Container>Loading ...</Container>;
  }

  return (
    <div css={profileStyle}>
      <Container>
        <div className="header-items">
          <h1>{user.name}</h1>
          {me?.id !== user.id ? (
            <Link className="btn btn-present" to={`/users/${userId}/give`}>
              <i className="fad fa-gift mr-1"></i> 빼빼로 선물하기
            </Link>
          ) : (
            <button
              className="btn btn-present"
              to={`/users/${userId}/give`}
              onClick={onCopyLink}
            >
              {linkCopied ? (
                <>
                  <i className="fal fa-check mr-1"></i> 복사 되었습니다!
                </>
              ) : (
                <>
                  <i className="fal fa-link mr-1"></i> 링크 복사하기
                </>
              )}
            </button>
          )}
        </div>
        <PeperoList userId={userId} />
        {me?.id !== user.id ? (
          <button className="btn btn-start d-block mx-auto" onClick={onMeToo}>
            <i className="fad fa-hands-heart mr-1"></i> 나도 선물 받기
          </button>
        ) : (
          <button className="btn btn-start d-block mx-auto" onClick={onLogout}>
            <i className="fal fa-sign-out mr-1"></i> 로그아웃
          </button>
        )}
      </Container>
      <Route exact path={`/users/${userId}/peperos/:peperoId`}>
        {({ match }) => (
          <CSSTransition
            in={match != null}
            classNames="popup"
            timeout={500}
            unmountOnExit
          >
            <PeperoPopup userId={userId} />
          </CSSTransition>
        )}
      </Route>
    </div>
  );
}
