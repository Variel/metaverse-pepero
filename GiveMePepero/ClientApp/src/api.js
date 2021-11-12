import { useHistory } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, tokenState } from "./authState";

export function useApi() {
  const history = useHistory();
  const { accessToken, refreshToken } = useRecoilValue(tokenState) ?? {
    accessToken: null,
    refreshToken: null,
  };
  const [currentAuthState, setAuthState] = useRecoilState(authState);

  const request = async (
    url,
    { method, headers, body, tokenOverride, authRequired = false }
  ) => {
    const apiCall = async (token) => {
      return await fetch(url, {
        method,
        headers: token
          ? {
              ...headers,
              Authorization: `Bearer ${token}`,
            }
          : headers,
        body,
      });
    };

    let response = await apiCall(tokenOverride || accessToken);

    if (response.status === 401) {
      const authResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (authResponse.status === 401) {
        if (authRequired) {
          history.push("/login");
        }
        return null;
      } else {
        const authResult = await authResponse.json();
        setAuthState({
          accessToken: authResult.accessToken,
          refreshToken: authResult.refreshToken,
          user: currentAuthState.user,
        });

        response = await apiCall(authResult.accessToken);
      }
    }

    return response.json();
  };

  return {
    get: (url, tokenOverride = null, authRequired = false) => {
      return request(url, { method: "GET", tokenOverride, authRequired });
    },
    post: (url, body, tokenOverride = null, authRequired = false) => {
      return request(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        tokenOverride,
        authRequired,
      });
    },
    put: (url, body, tokenOverride = null, authRequired = false) => {
      return request(url, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        tokenOverride,
        authRequired,
      });
    },
    delete: (url, tokenOverride = null, authRequired = false) => {
      return request(url, { method: "DELETE", tokenOverride, authRequired });
    },
    request,
  };
}
