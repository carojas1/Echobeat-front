import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: true,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Load theme preference from localStorage
        const savedTheme = localStorage.getItem('echobeat-theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        document.body.classList.toggle('light-theme', !isDark);
        document.body.classList.toggle('dark-theme', isDark);

        // Save preference
        localStorage.setItem('echobeat-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
