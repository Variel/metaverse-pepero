import { useApi } from "./api";

export function useFetcher() {
  const api = useApi();

  return (url) => {
    return api.get(url);
  }
}