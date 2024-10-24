import { useEffect, useRef } from 'react';

// ==============================|| ELEMENT REFERENCE HOOKS  ||============================== //

const useScriptRef = () => {
  const scripted = useRef(true);

  useEffect(() => {
    scripted.current = true;
    return () => {
      scripted.current = false;
    };
  }, []);

  return scripted;
};

export default useScriptRef;
