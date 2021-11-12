/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { Component } from "react";
import useSWR from "swr";
import { useFetcher } from "../fetcher";
import { mobile } from "../helpers/media-query";
import { PeperoItem } from "./PeperoItem";

const counterStyle = css`
  font-size: 14px;
`;

const listStyle = css`
  display: flex;
  flex-wrap: wrap;

  margin-left: -16px;
  margin-right: -16px;

  ${mobile} {
    margin-left: -8px;
    margin-right: -8px;
  }

  @keyframes floating {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-4px);
    }
  }

  .list-item .pepero-package {
    animation: floating 1.5s ease-in-out alternate infinite;
  }

  .list-item:nth-of-type(15n) .pepero-package {
    animation-delay: 0.1s;
  }

  .list-item:nth-of-type(15n + 1) .pepero-package {
    animation-delay: 0.2s;
  }

  .list-item:nth-of-type(15n + 2) .pepero-package {
    animation-delay: 0.3s;
  }

  .list-item:nth-of-type(15n + 3) .pepero-package {
    animation-delay: 0.4s;
  }

  .list-item:nth-of-type(15n + 4) .pepero-package {
    animation-delay: 0.5s;
  }

  .list-item:nth-of-type(15n + 5) .pepero-package {
    animation-delay: 0.6s;
  }

  .list-item:nth-of-type(15n + 6) .pepero-package {
    animation-delay: 0.7s;
  }

  .list-item:nth-of-type(15n + 7) .pepero-package {
    animation-delay: 0.8s;
  }

  .list-item:nth-of-type(15n + 8) .pepero-package {
    animation-delay: 0.9s;
  }

  .list-item:nth-of-type(15n + 9) .pepero-package {
    animation-delay: 1s;
  }

  .list-item:nth-of-type(15n + 10) .pepero-package {
    animation-delay: 1.1s;
  }

  .list-item:nth-of-type(15n + 11) .pepero-package {
    animation-delay: 1.2s;
  }

  .list-item:nth-of-type(15n + 12) .pepero-package {
    animation-delay: 1.3s;
  }

  .list-item:nth-of-type(15n + 13) .pepero-package {
    animation-delay: 1.4s;
  }
  
  .list-item:nth-of-type(15n + 14) .pepero-package {
    animation-delay: 1.5s;
  }
`;

export function PeperoList({ userId }) {
  const fetcher = useFetcher();
  const { data: peperos, error } = useSWR(
    `/api/users/${userId}/peperos`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 10000,
    }
  );

  if (peperos) {
    return (
      <>
        <div className="text-subduded" css={counterStyle}>
          빼빼로 <strong>{peperos.length}</strong>개를 받았습니다
        </div>
        <div css={listStyle}>
          {peperos.map((p) => (
            <PeperoItem key={p.id} receiverId={userId} item={p} />
          ))}
        </div>
      </>
    );
  }

  return null;
}
