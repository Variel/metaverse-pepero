import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useApi } from "./api";
import { authState } from "./authState";

export function Auth() {

  const [, setAuthState] = useRecoilState(authState);

  useEffect(() => {
    (async () => {
      let accessToken = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");

      if (accessToken !== null) {
        let meResponse = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (meResponse.status === 401) {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refreshToken
            })
          });

          if (refreshResponse.status === 401) {
            return;
          }

          ({accessToken, refreshToken} = await refreshResponse.json());
        }

        meResponse = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const me = meResponse.json();
        
        setAuthState({
          accessToken,
          refreshToken,
          user: me
        });
      }
    })();
  }, [setAuthState]);

  return null;
}
