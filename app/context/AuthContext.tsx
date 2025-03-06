import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'supervisor' | 'worker' | null;

interface AuthContextType {
  userRole: UserRole;
  login: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role) setUserRole(role as UserRole); 
    };
    checkLoginStatus();
  }, []);

  const login = async (role: UserRole) => {
    await AsyncStorage.setItem('userRole', role);
    setUserRole(role); 
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userRole');
    setUserRole(null); 
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export  const useAuth = () => useContext(AuthContext);
