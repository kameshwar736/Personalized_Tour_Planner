import { getLocal } from '../utils/storage';

// Utility wrapper for backward compatibility
const useGetLocal = (keyName, fallback = null) => {
  return getLocal(keyName, fallback);
};

export default useGetLocal;