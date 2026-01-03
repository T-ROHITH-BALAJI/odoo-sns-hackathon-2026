import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // DEMO MODE: Skip authentication with mock user
  const mockUser = {
    id: 'demo-user-123',
    email: 'keerthivasan@globetrotter.com',
    user_metadata: {
      full_name: 'Keerthivasan',
      phone: '9488627508',
      location: 'Chennai, India'
    }
  };

  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-login with mock user for demo
    setUser(mockUser);
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
