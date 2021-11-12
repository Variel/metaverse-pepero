/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component, useCallback, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { useApi } from "../api";
import { userState } from "../authState";
import { BoxMaker } from "../components/BoxMaker";
import { CheckBox } from "../components/CheckBox";

import { Container } from "../components/Container";
import { PeperoMaker } from "../components/PeperoMaker";

import { useFetcher } from "../fetcher";
import { dark, mobile } from "../helpers/media-query";

const givePageStyle = css`
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
  }

  .btn-go-back,
  .btn-next,
  .btn-prev {
    flex-shrink: 0;

    color: var(--foreground);
    border-style: solid;
    border-color: var(--foreground);
    border-width: 2px;

    padding: 6px 12px;

    background: transparent;

    border-radius: 18px;
    font-size: 14px;

    ${mobile} {
      margin-top: 16px;
      margin-left: -4px;
      margin-bottom: 8px;
    }
  }

  .btn-present {
    flex-shrink: 0;

    color: white;
    border-color: #c869ff;
    background: #c869ff;
    border-width: 2px;
    border-style: solid;
    padding: 6px 12px;

    border-radius: 18px;
    font-size: 14px;

    ${mobile} {
      margin-top: 16px;
      margin-bottom: 8px;
      margin-left: -4px;
    }
  }

  h2 {
    font-size: 18px;
    text-align: center;
  }

  .message-writer {
    text-align: center;

    .message-input-wrap {
      width: 100%;
      max-width: 480px;
      margin: 0 auto 16px auto;

      h2 {
        margin-bottom: 8px;
      }

      textarea {
        width: 100%;

        background: transparent;
        border: 1px solid var(--foreground);
        color: var(--foreground);
        padding: 8px;
        border-radius: 8px;
      }
    }

    input {
      width: 100%;

      background: transparent;
      border: 1px solid var(--foreground);
      color: var(--foreground);
      padding: 8px;
      border-radius: 8px;
    }
  }

  .button-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }

  .section-wrap {
    position: relative;

    .maker-section {
      position: absolute;
      width: 100%;

      text-align: center;

      padding-bottom: 40px;
    }

    .message-section {
      position: absolute;
      width: 100%;

      padding-bottom: 40px;
    }
  }

  .slide-exit {
    transform: translateX(0);
    opacity: 1;
  }

  .slide-exit-active {
    transform: translateX(-100%);
    opacity: 0;
    transition: all ease 0.5s;
  }

  .slide-enter {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-enter-active {
    transform: translateX(0);
    opacity: 1;
    transition: all ease 0.5s;
  }

  .backslide-exit {
    transform: translateX(0);
    opacity: 1;
  }

  .backslide-exit-active {
    transform: translateX(100%);
    opacity: 0;
    transition: all ease 0.5s;
  }

  .backslide-enter {
    transform: translateX(-100%);
    opacity: 0;
  }

  .backslide-enter-active {
    transform: translateX(0);
    opacity: 1;
    transition: all ease 0.5s;
  }
`;

export function GivePage() {
  const fetcher = useFetcher();
  const { userId } = useParams();
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher);
  const me = useRecoilValue(userState);

  const api = useApi();
  const history = useHistory();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [imageDataUrl, setImageDataUrl] = useState("");
  const [wrapDataUrl, setWrapDataUrl] = useState("");
  const [peperoParams, setPeperoParams] = useState({
    base: 0,
    source: 0,
    topping: 0,
  });
  const [boxParams, setBoxParams] = useState({
    wrap: 0,
    ribbon: 0,
  });
  const [message, setMessage] = useState("");
  const [giverName, setGiverName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const peperoChanged = useCallback(
    (dataUrl, params) => {
      setImageDataUrl(dataUrl);
      setPeperoParams(params);
    },
    [setImageDataUrl, setPeperoParams]
  );

  const boxChanged = useCallback(
    (dataUrl, params) => {
      setWrapDataUrl(dataUrl);
      setBoxParams(params);
    },
    [setWrapDataUrl, setBoxParams]
  );

  const privateChanged = useCallback(
    (value) => {
      setIsPrivate(value);
    },
    [setIsPrivate]
  );

  const postGift = useCallback(() => {
    (async () => {
      if (isBusy) {
        return;
      }

      setIsBusy(true);

      await api.post(`/api/users/${userId}/peperos`, {
        giverName,
        message,
        isPrivate,
        peperoImage: imageDataUrl,
        packageImage: wrapDataUrl,
      });

      setIsBusy(false);
      setStep(3);
      setDirection(1);
    })();
  }, [api, giverName, imageDataUrl, isBusy, isPrivate, message, userId, wrapDataUrl]);

  const toReceiveGift = useCallback(
    () => {
      if (me) {
        history.push(`/users/${me.id}`);
      } else {
        history.push('/login');
      }
    },
    [history, me],
  )

  if (!user) {
    return null;
  }

  return (
    <div css={givePageStyle}>
      <Container>
        <div className="header-items">
          <h1>{user.name}</h1>
          <Link className="btn btn-go-back" to={`/users/${userId}`}>
            <i className="fal fa-arrow-left mr-1"></i> 빼빼로 목록으로
          </Link>
        </div>
        <div className="section-wrap">
          <CSSTransition
            in={step === 0}
            classNames={direction === 1 ? "slide" : "backslide"}
            timeout={500}
            unmountOnExit
          >
            <div className="maker-section">
              <h2>빼빼로를 만들어 선물하세요</h2>
              <PeperoMaker
                initialPeperoParams={peperoParams}
                onChange={peperoChanged}
              />
              <div className="mt-4">
                <button
                  className="btn-next"
                  onClick={() => {
                    setStep(1);
                    setDirection(1);
                  }}
                >
                  다 만들었어요 <i className="fal fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={step === 1}
            classNames={direction === 1 ? "slide" : "backslide"}
            timeout={500}
            unmountOnExit
          >
            <div className="message-section">
              <div className="message-writer">
                <h2>따뜻한 메시지를 남겨주세요</h2>
                <div className="message-input-wrap">
                  <textarea
                    rows="8"
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="예) 너는 할 수 있어 힘 내!"
                  ></textarea>
                  <label>누가 남기는 메시지인가요?</label>
                  <div className="message-giver-name">
                    <input
                      onChange={(e) => setGiverName(e.target.value)}
                      placeholder="예) 강소예"
                    />
                  </div>
                </div>
              </div>
              <div className="button-wrap">
                <button
                  className="btn-prev"
                  onClick={() => {
                    setStep(0);
                    setDirection(-1);
                  }}
                >
                  <i className="fal fa-arrow-left mr-1"></i> 다시 만들래요
                </button>
                <button
                  className="btn-prev"
                  onClick={() => {
                    setStep(2);
                    setDirection(1);
                  }}
                >
                  다 적었어요 <i className="fal fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={step === 2}
            classNames={direction === 1 ? "slide" : "backslide"}
            timeout={500}
            unmountOnExit
          >
            <div className="message-section">
              <div className="message-writer">
                <h2>포장을 선택해주세요</h2>
                <BoxMaker initialBoxParams={boxParams} onChange={boxChanged} />
                <CheckBox onChange={(val) => privateChanged(val)}>
                  비공개 메시지
                </CheckBox>
              </div>
              <div className="button-wrap">
                <button
                  className="btn-prev"
                  onClick={() => {
                    setStep(1);
                    setDirection(-1);
                  }}
                >
                  <i className="fal fa-arrow-left mr-1"></i> 다시 적을래요
                </button>
                <button className="btn-present" disabled={isBusy} onClick={() => postGift()}>
                  선물하기 <i className="fal fa-gift ml-1"></i>
                </button>
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={step === 3}
            classNames={direction === 1 ? "slide" : "backslide"}
            timeout={500}
            unmountOnExit
          >
            <div className="message-section">
              <div className="message-writer">
                <h2>선물을 보냈습니다</h2>
                <img src={wrapDataUrl} alt="선물" />
              </div>
              <div className="button-wrap">
                <Link className="btn btn-go-back" to={`/users/${userId}`}>
                  <i className="fad fa-gifts mr-1"></i> 빼빼로 목록으로
                </Link>
                <button className="btn-present" onClick={() => toReceiveGift()}>
                  나도 선물 받기 <i className="fad fa-gift ml-1"></i>
                </button>
              </div>
            </div>
          </CSSTransition>
        </div>
      </Container>
    </div>
  );
}
