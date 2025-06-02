import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Guardar la posición actual del scroll antes de cambiar de página
    const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
    const key = `${pathname}${search}`; // Incluir los parámetros de búsqueda en la clave
    scrollPositions[key] = window.scrollY;
    sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
  }, [pathname, search]);

  useEffect(() => {
    // Restaurar la posición del scroll cuando se carga la página
    const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
    const key = `${pathname}${search}`; // Incluir los parámetros de búsqueda en la clave
    const savedPosition = scrollPositions[key];
    
    if (savedPosition !== undefined) {
      window.scrollTo(0, savedPosition);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop; 