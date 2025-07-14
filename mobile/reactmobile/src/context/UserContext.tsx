import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import {API_URL} from '../services/api';
import {storage} from '../storage/storage';

export type UserType = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  avatar: string;
  xp: number;
  level: number;
  achievements: any[];
  preferences: string[];
};

const initialState: {user: UserType | null} = {
  user: null,
};

export type ActionType =
  | {type: 'SET_USER'; payload: UserType}
  | {type: 'CLEAR_USER'};

function userReducer(state: typeof initialState, action: ActionType) {
  switch (action.type) {
    case 'SET_USER':
      return {...state, user: action.payload};
    case 'CLEAR_USER':
      return {...state, user: null};
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<ActionType>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}>({
  state: initialState,
  dispatch: () => {},
  refreshUser: async () => {},
  isLoading: true,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export function UserProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    try {
      const token = await storage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const [userRes, preferencesRes] = await Promise.all([
        fetch(`${API_URL}/user`, {
          headers: {Authorization: `Bearer ${token}`},
        }),
        fetch(`${API_URL}/user/preferences`, {
          headers: {Authorization: `Bearer ${token}`},
        }),
      ]);

      if (!userRes.ok || !preferencesRes.ok) {
        setIsAuthenticated(false);
        return;
      }

      const userData = await userRes.json();
      const preferencesData = await preferencesRes.json();
      const preferences = preferencesData.map((item: any) => item.typeId);

      dispatch({
        type: 'SET_USER',
        payload: {...userData, preferences},
      });

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    async function init() {
      await refreshUser();
      setIsLoading(false);
    }

    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        refreshUser,
        isAuthenticated,
        isLoading,
        setIsAuthenticated,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
