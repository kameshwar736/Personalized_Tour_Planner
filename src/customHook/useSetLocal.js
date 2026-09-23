import { getLocal, setLocal } from '../utils/storage';

// Utility wrapper for backward compatibility
const useSetLocal = (keyName, value) => {
  const currentData = getLocal(keyName, []);
  const updatedData = Array.isArray(currentData) ? [...currentData, value] : [value];
  setLocal(keyName, updatedData);
  return updatedData;
};

export default useSetLocal;