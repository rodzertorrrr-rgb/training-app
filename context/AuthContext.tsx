
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';

interface AuthContextType {
  user: User | null;
  availableUsers: User[];
  login: (userId: string, userObj?: User) => void;
  register: (name: string) => void;
  logout: () => void;
  deleteUser: (userId: string, force?: boolean) => void;
  importUserData: (data: any) => string;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const USERS_LIST_KEY = 'rdz_users_list';
  const CURRENT_USER_KEY = 'rdz_current_user';
  const DATA_PREFIX = 'rdz_v2_';

  useEffect(() => {
    const initAuth = async () => {
        try {
            const usersList = localStorage.getItem(USERS_LIST_KEY);
            if (usersList) {
              setAvailableUsers(JSON.parse(usersList));
            }

            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
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
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  };

  const login = (userId: string, userObj?: User) => {
    // Dacă primim obiectul direct (din register), îl folosim. Altfel căutăm în listă.
    const targetUser = userObj || availableUsers.find(u => u.id === userId);
    
    if (targetUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(targetUser));
      setUser(targetUser);
      // Folosim un mic delay înainte de reload pentru a ne asigura că Storage-ul a procesat scrierea
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
  };

  const register = (name: string) => {
    // Generăm un ID sigur care nu crapă la caractere românești
    const safeId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    
    const newUser: User = {
      id: safeId,
      name: name,
    };
    
    const updatedList = [...availableUsers, newUser];
    saveUsersList(updatedList);
    
    // Logăm utilizatorul nou creat imediat, trecând obiectul direct pentru a evita race-condition cu state-ul
    login(newUser.id, newUser);
  };

  const importUserData = (payload: any): string => {
    const clientName = `[CLIENT] ${payload.user.name}`;
    const newId = `import_${Date.now()}`;
    const newUser: User = { id: newId, name: clientName };
    
    const updatedList = [...availableUsers, newUser];
    saveUsersList(updatedList);

    if (payload.sessions) localStorage.setItem(`${DATA_PREFIX}sessions_${newId}`, JSON.stringify(payload.sessions));
    if (payload.weightLogs) localStorage.setItem(`${DATA_PREFIX}weight_${newId}`, JSON.stringify(payload.weightLogs));
    if (payload.customPrograms) localStorage.setItem(`${DATA_PREFIX}custom_programs_${newId}`, JSON.stringify(payload.customPrograms));
    if (payload.customExercises) localStorage.setItem(`${DATA_PREFIX}custom_exercises_${newId}`, JSON.stringify(payload.customExercises));

    return newId;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const deleteUser = (userId: string, force: boolean = false) => {
    if (force || window.confirm("Ești sigur? Toate antrenamentele acestui utilizator vor fi șterse.")) {
        const updatedList = availableUsers.filter(u => u.id !== userId);
        saveUsersList(updatedList);

        // Curățăm TOATE datele asociate acestui ID folosind prefixul corect rdz_v2_
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes(userId) || key.includes(`_${userId}`))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        if (user && user.id === userId) {
            logout();
        }
    }
  };

  if (isLoading) {
      return <div className="min-h-screen w-full bg-black flex items-center justify-center"></div>;
  }

  return (
    <AuthContext.Provider value={{ user, availableUsers, login, register, logout, deleteUser, importUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
