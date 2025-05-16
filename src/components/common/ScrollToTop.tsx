import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    const content = document.getElementById('sub-main-content');
    content?.scrollTo(-100, -100); // ✅ scroll the Ant Design content area
  }, [location.pathname, location.search]); // include query changes too

  return null;
}
