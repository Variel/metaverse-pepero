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

  .pepero-preview {
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
  baseImages: [...new Array(5).keys()].map((n) => {
    const i = new Image();
    i.src = `/img/base-${n}.png`;

    return i;
  }),
  sourceImages: [...new Array(9).keys()].map((n) => {
    const i = new Image();
    i.src = `/img/source-${n}.png`;

    return i;
  }),
  toppingImages: [...new Array(12).keys()].map((n) => {
    const i = new Image();
    i.src = `/img/topping-${n}.png`;

    return i;
  }),
};

export function PeperoMaker({ onChange, initialPeperoParams }) {
  const canvasRef = useRef();

  const [peperoOptions, setPeperoOptions] = useState({
    baseNo: initialPeperoParams?.base ?? 0,
    sourceNo: initialPeperoParams?.source ?? 0,
    toppingNo: initialPeperoParams?.topping ?? 0,
  });

  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const loaded =
        images.baseImages.every((i) => i.complete) &&
        images.sourceImages.every((i) => i.complete) &&
        images.toppingImages.every((i) => i.complete);

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
      ctx.drawImage(images.baseImages[peperoOptions.baseNo], 0, 0, 200, 200);
      ctx.drawImage(
        images.sourceImages[peperoOptions.sourceNo],
        0,
        0,
        200,
        200
      );
      ctx.drawImage(
        images.toppingImages[peperoOptions.toppingNo],
        0,
        0,
        200,
        200
      );
    }

    if (onChange) {
      onChange(canvasRef.current.toDataURL(), {
        base: peperoOptions.baseNo,
        source: peperoOptions.sourceNo,
        topping: peperoOptions.toppingNo,
      });
    }
  }, [onChange, peperoOptions, imgLoaded]);

  const changePeperoOption = useCallback((prop, val) => {
    setPeperoOptions((o) => ({
      ...o,
      [prop]: val,
    }));
    if (onChange) {
      onChange(canvasRef.current.toDataURL(), {
        base: peperoOptions.baseNo,
        source: peperoOptions.sourceNo,
        topping: peperoOptions.toppingNo,
      });
    }
  }, [onChange, peperoOptions]);

  return (
    <div css={makerStyle}>
      <div className="pepero-preview">
        <canvas
          width="200"
          height="200"
          ref={canvasRef}
        ></canvas>
      </div>
      <div className="selector-group">
        <label>과자</label>
        <SpinSelector
          init={peperoOptions.baseNo}
          min={0}
          max={4}
          onChange={(val) => changePeperoOption("baseNo", val)}
        />
      </div>
      <div className="selector-group">
        <label>초콜릿</label>
        <SpinSelector
          init={peperoOptions.sourceNo}
          min={0}
          max={8}
          onChange={(val) => changePeperoOption("sourceNo", val)}
        />
      </div>
      <div className="selector-group">
        <label>스프링클</label>
        <SpinSelector
          init={peperoOptions.toppingNo}
          min={0}
          max={11}
          onChange={(val) => changePeperoOption("toppingNo", val)}
        />
      </div>
    </div>
  );
}
