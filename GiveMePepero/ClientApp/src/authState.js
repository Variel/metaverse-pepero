import { atom, selector } from "recoil";

/*
  authState

  {
    accessToken: null,
    refreshToken: null,
    user: {
      id: something
      name: something,
    }
  }
*/
export const authState = atom({
  key: 'authState',
  default: null
});

export const tokenState = selector({
  key: 'accessTokenState',
  get: (({get}) => {
    const state = get(authState);

    return state && {
      accessToken: state.accessToken,
      refreshToken: state.refreshToken
    };
  })
});

export const userState = selector({
  key: 'userState',
  get: (({get}) => {
    return get(authState)?.user;
  })
})