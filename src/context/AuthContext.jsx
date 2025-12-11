import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('levelup_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('levelup_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('levelup_user');
        }
    }, [user]);

    const loginSuccess = (apiResponse) => {
        const userData = {
            ...apiResponse.usuario,
            token: apiResponse.token
        };
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (newUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...newUserData
        }));
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loginSuccess, 
            logout, 
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};