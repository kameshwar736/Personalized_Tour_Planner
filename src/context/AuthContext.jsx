import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocal, setLocal } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(() => getLocal('activeUser', null));
  const [toast, setToast] = useState(null);

  // Sync state on change
  useEffect(() => {
    if (activeUser) {
      setLocal('activeUser', activeUser);
    } else {
      localStorage.removeItem('activeUser');
    }
  }, [activeUser]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const login = (email, password) => {
    const allUsers = getLocal('UserData', []);
    const foundUser = allUsers.find(
      (u) => u.userEmail?.toLowerCase() === email?.toLowerCase() && u.userPassword === password
    );

    if (foundUser) {
      setActiveUser(foundUser);
      showToast(`Welcome back, ${foundUser.userName}!`, 'success');
      return { success: true };
    } else {
      showToast('Invalid email or password', 'error');
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const register = (userData) => {
    const allUsers = getLocal('UserData', []);
    const exists = allUsers.some(
      (u) => u.userEmail?.toLowerCase() === userData.userEmail?.toLowerCase()
    );

    if (exists) {
      showToast('An account with this email already exists', 'error');
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      ...userData,
      favPlace: userData.favPlace || [],
      userPhone: userData.userPhone || '',
      userState: userData.userState || '',
      userBio: userData.userBio || 'Passionate traveler exploring the world.',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...allUsers, newUser];
    setLocal('UserData', updatedUsers);
    setActiveUser(newUser);
    showToast('Account created successfully! Welcome aboard.', 'success');
    return { success: true };
  };

  const logout = () => {
    setActiveUser(null);
    localStorage.removeItem('activeUser');
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = (updatedData) => {
    if (!activeUser) return { success: false };

    const allUsers = getLocal('UserData', []);
    const updatedUsers = allUsers.map((u) =>
      u.userEmail === activeUser.userEmail ? { ...u, ...updatedData } : u
    );

    const newActive = { ...activeUser, ...updatedData };
    setLocal('UserData', updatedUsers);
    setActiveUser(newActive);
    showToast('Profile updated successfully!', 'success');
    return { success: true };
  };

  const toggleFavorite = (destiName) => {
    if (!activeUser) {
      showToast('Please login to save favorite places', 'warning');
      return false;
    }

    const currentFavs = activeUser.favPlace || [];
    const isFav = currentFavs.includes(destiName);

    const newFavs = isFav
      ? currentFavs.filter((item) => item !== destiName)
      : [...currentFavs, destiName];

    const updatedUser = { ...activeUser, favPlace: newFavs };
    const allUsers = getLocal('UserData', []);
    const updatedUsers = allUsers.map((u) =>
      u.userEmail === activeUser.userEmail ? updatedUser : u
    );

    setLocal('UserData', updatedUsers);
    setActiveUser(updatedUser);

    if (isFav) {
      showToast(`Removed ${destiName} from favorites`, 'info');
    } else {
      showToast(`Added ${destiName} to your favorites!`, 'success');
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        activeUser,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
