import { createContext, useContext } from 'react';

export const PageContext = createContext();

export function usePageContext() {
  return useContext(PageContext);
}