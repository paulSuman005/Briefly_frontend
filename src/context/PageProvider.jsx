import { PageContext } from './PageContext';
import { useLocation } from 'react-router-dom';

export function PageProvider({ children }) {
  const location = useLocation();
  
  const isLandingPage = location.pathname === '/';
  console.log("isLandingpage: ", isLandingPage);

  return (
    <PageContext.Provider value={{ isLandingPage }}>
      {children}
    </PageContext.Provider>
  );
}