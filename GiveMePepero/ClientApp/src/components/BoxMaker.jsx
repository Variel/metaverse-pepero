/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SpinSelector } from "./SpinSelector";

const makerStyle = css`
  label {
    display: block;
    text-align: center;
    margin-bottom: 4px;
  }

  .selector-group {
    margin-bottom: 16px;
  }

  .box-preview {
    position: relative;
    width: 300px;
    max-width: 80%;

    margin: 0 auto 16px;

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
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
    }
  }

  canvas {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
`;

const images = {
  wrapImages: [...new Array(10).keys()].map((n) => {
    const i = new Image();
    i.src = `/img/wrap-${n}.png`;

    return i;
  }),
  ribbonImages: [...new Array(6).keys()].map((n) => {
    const i = new Image();
    i.src = `/img/ribbon-${n}.png`;

    return i;
  }),
};

export function BoxMaker({ onChange, initialBoxParams }) {
  const canvasRef = useRef();

  const [boxOptions, setBoxOptions] = useState({
    wrapNo: initialBoxParams?.wrap ?? 0,
    ribbonNo: initialBoxParams?.ribbon ?? 0,
  });

  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const loaded =
        images.wrapImages.every((i) => i.complete) &&
        images.ribbonImages.every((i) => i.complete);

      if (loaded) {
        setImgLoaded(true);
        clearInterval(id);
      }
    }, 100);

    return () => {
      clearInterval(id);
    };
  }, [setImgLoaded]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    if (imgLoaded) {
      ctx.clearRect(0, 0, 200, 200);
      ctx.drawImage(images.wrapImages[boxOptions.wrapNo], 0, 0, 200, 200);
      ctx.drawImage(images.ribbonImages[boxOptions.ribbonNo], 0, 0, 200, 200);
    }

    if (onChange) {
      onChange(canvasRef.current.toDataURL(), {
        wrap: boxOptions.wrapNo,
        ribbon: boxOptions.ribbonNo,
      });
    }
  }, [onChange, boxOptions, imgLoaded]);

  const changeBoxOption = useCallback(
    (prop, val) => {
      setBoxOptions((o) => ({
        ...o,
        [prop]: val,
      }));
      if (onChange) {
        onChange(canvasRef.current.toDataURL(), {
          wrap: boxOptions.wrapNo,
          ribbon: boxOptions.ribbonNo,
        });
      }
    },
    [onChange, boxOptions]
  );

  return (
    <div css={makerStyle}>
      <div className="box-preview">
        <canvas
          width="200"
          height="200"
          ref={canvasRef}
        ></canvas>
      </div>
      <div className="selector-group">
        <label>포장지</label>
        <SpinSelector
          init={boxOptions.wrapNo}
          min={0}
          max={9}
          onChange={(val) => changeBoxOption("wrapNo", val)}
        />
      </div>
      <div className="selector-group">
        <label>리본</label>
        <SpinSelector
          init={boxOptions.ribbonNo}
          min={0}
          max={5}
          onChange={(val) => changeBoxOption("ribbonNo", val)}
        />
      </div>
    </div>
  );
}
