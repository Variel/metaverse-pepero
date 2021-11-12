/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useState } from "react";
import { Route, useHistory, useParams } from "react-router";
import { CSSTransition } from "react-transition-group";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { userState } from "../authState";
import { useFetcher } from "../fetcher";
import { humanizeDate } from "../helpers/humanize-date";
import { Present } from "./Present";

const contentStyle = css`
  max-width: 480px;
  width: 100%;

  text-align: center;

  .help-text {
    margin-top: 8px;
    font-size: 11px;
  }

  .message {
    margin-top: 16px;
    font-size: 14px;
    white-space: pre-line;

    max-height: 200px;
    overflow-y: auto;
  }

  .give-info {
    display: flex;
    margin-top: 16px;
    align-items: center;
    justify-content: center;

    .giver-name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-weight: 300;
      font-size: 14px;
    }

    .give-time {
      margin-left: 4px;
      flex-shrink: 0;
      font-size: 12px;
    }
  }

  .btn-close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px auto 0;
  }
`;

export function PeperoPopup({ userId }) {
  const history = useHistory();
  const fetcher = useFetcher();
  const { peperoId } = useParams();
  const { data: peperos } = useSWR(`/api/users/${userId}/peperos`, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000,
  });

  const me = useRecoilValue(userState);

  const [savedPeperoId] = useState(peperoId);

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const onClickBackground = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const pepero = peperos?.find((p) => p.id === savedPeperoId) ?? null;

  return (
    pepero && (
      <div className="popup" onClick={onClickBackground}>
        <div className="popup-content" css={contentStyle}>
          <Present
            item={pepero}
            canOpen={!(pepero.isPrivate && me?.id !== userId)}
          />
          {pepero.isPrivate && me?.id !== userId ? (
            <div className="help-text text-subduded">
              비공개 선물은 받은 사람만 볼 수 있습니다
            </div>
          ) : (
            <>
              <div className="help-text text-subduded">
                (탭 해서 선물 포장을 뜯으세요)
              </div>
              <div className="message">{pepero.message}</div>
            </>
          )}
          <div className="give-info">
            <div className="giver-name">{pepero.giverName}</div>
            <div className="give-time text-subduded">
              {humanizeDate(pepero.createdAt)}
            </div>
          </div>
          <div className="btn-close" onClick={onClose}>
            <span className="fa-stack">
              <i className="fal fa-circle fa-stack-2x"></i>
              <i className="fal fa-times fa-stack-1x"></i>
            </span>
          </div>
        </div>
      </div>
    )
  );
}
