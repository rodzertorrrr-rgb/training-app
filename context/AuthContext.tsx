
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  availableUsers: User[];
  login: (userId: string) => void;
  register: (name: string) => void;
  logout: () => void;
  deleteUser: (userId: string, force?: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for stability and check storage
    const initAuth = async () => {
        try {
            const usersList = localStorage.getItem('rdz_users_list');
            if (usersList) {
            setAvailableUsers(JSON.parse(usersList));
            }

            const currentUser = localStorage.getItem('rdz_current_user');
            if (currentUser) {
            setUser(JSON.parse(currentUser));
            }
        } catch (e) {
            console.error("Auth init failed", e);
        } finally {
            setIsLoading(false);
        }
    };
    initAuth();
  }, []);

  const saveUsersList = (users: User[]) => {
    setAvailableUsers(users);
    localStorage.setItem('rdz_users_list', JSON.stringify(users));
  };

  const register = (name: string) => {
    const newUser: User = {
      id: btoa(name + Date.now()),
      name: name,
    };
    const updatedList = [...availableUsers, newUser];
    saveUsersList(updatedList);
    // Auto login
    login(newUser.id);
  };

  const login = (userId: string) => {
    const targetUser = availableUsers.find(u => u.id === userId);
    if (targetUser) {
      localStorage.setItem('rdz_current_user', JSON.stringify(targetUser));
      setUser(targetUser);
    } else {
        // Fallback for immediate registration
        const freshUser = availableUsers.find(u => u.id === userId); // Re-check state if updated immediately
        if(freshUser) {
            localStorage.setItem('rdz_current_user', JSON.stringify(freshUser));
            setUser(freshUser);
        }
    }
  };

  const logout = () => {
    localStorage.removeItem('rdz_current_user');
    setUser(null);
  };

  const deleteUser = (userId: string, force: boolean = false) => {
    if (force || window.confirm("Ești sigur? Toate antrenamentele acestui utilizator vor fi șterse.")) {
        // 1. Remove from list
        const updatedList = availableUsers.filter(u => u.id !== userId);
        saveUsersList(updatedList);

        // 2. Clean up specific data
        const PREFIX = 'rdz_';
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes(userId)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // 3. Logout if it was the current user
        if (user && user.id === userId) {
            logout();
        }
    }
  };

  if (isLoading) {
      return <div className="min-h-screen w-full bg-black flex items-center justify-center"></div>;
  }

  return (
    <AuthContext.Provider value={{ user, availableUsers, login, register, logout, deleteUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
