import {createContext, useContext, useReducer, useMemo} from 'react';
import {API_URL} from '../services/api';
import {storage} from '../storage/storage';
import Toast from 'react-native-toast-message';

export type Participant = {
  id: string;
  name: string;
  avatar: string;
  userId: string;
  approved?: 'WAITING' | 'APPROVED' | 'REJECTED';
  subscriptionStatus?: 'WAITING' | 'APPROVED' | 'REJECTED';
  confirmedAt?: string | null;
};

type State = {
  participants: Participant[];
  confirmationCode: string | null;
  activityDetails: any | null;
};

const initialState: State = {
  participants: [],
  confirmationCode: null,
  activityDetails: null,
};

type Action =
  | {type: 'SET_PARTICIPANTS'; payload: Participant[]}
  | {type: 'CLEAR_PARTICIPANTS'}
  | {type: 'SET_CONFIRMATION_CODE'; payload: string}
  | {type: 'SET_ACTIVITY_DETAILS'; payload: any};

function activityReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PARTICIPANTS':
      return {...state, participants: action.payload};
    case 'CLEAR_PARTICIPANTS':
      return {...state, participants: []};
    case 'SET_CONFIRMATION_CODE':
      return {...state, confirmationCode: action.payload};
    case 'SET_ACTIVITY_DETAILS':
      return {...state, activityDetails: action.payload};
    default:
      return state;
  }
}

const ActivityContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
      fetchParticipants: (activityId: string) => Promise<void>;
      subscribe: (activityId: string) => Promise<void>;
      unsubscribe: (activityId: string) => Promise<void>;
      approve: (
        activityId: string,
        participantId: string,
        approve: boolean,
      ) => Promise<void>;
      checkIn: (activityId: string, code: string) => Promise<void>;
      fetchConfirmationCode: (activityId: string) => Promise<void>;
      fetchActivityDetails: (activityId: string) => Promise<any | null>;
      approvedCount: number;
    }
  | undefined
>(undefined);

export function ActivityProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  async function fetchParticipants(activityId: string) {
    try {
      const token = await storage.getItem('token');
      const res = await fetch(
        `${API_URL}/activities/${activityId}/participants`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        const participants = data.map((p: any) => ({
          id: p.id,
          userId: p.userId,
          name: p.name,
          avatar: p.avatar,
          subscriptionStatus: p.subscriptionStatus || null,
          approved: p.subscriptionStatus || null,
          confirmedAt: p.confirmedAt || null,
        }));
        dispatch({type: 'SET_PARTICIPANTS', payload: participants});
      } else {
        Toast.show({type: 'error', text1: 'Erro ao carregar participantes'});
      }
    } catch (error) {
      Toast.show({type: 'error', text1: 'Erro ao buscar participantes'});
    }
  }

  async function fetchConfirmationCode(activityId: string) {
    try {
      const token = await storage.getItem('token');

      let res = await fetch(`${API_URL}/activities/user/creator/all`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let data = await res.json();

      let match = data?.find((a: any) => a.id === activityId);

      if (!match) {
        const resAll = await fetch(`${API_URL}/activities/all`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        const dataAll = await resAll.json();
        match = dataAll.activities?.find((a: any) => a.id === activityId);
      }

      if (match?.confirmationCode) {
        dispatch({
          type: 'SET_CONFIRMATION_CODE',
          payload: match.confirmationCode,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Código de confirmação não encontrado',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar código de confirmação',
      });
    }
  }

  async function fetchActivityDetails(activityId: string): Promise<any | null> {
    try {
      const token = await storage.getItem('token');
      const response = await fetch(`${API_URL}/activities/${activityId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({type: 'SET_ACTIVITY_DETAILS', payload: data});
        return data;
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao buscar detalhes da atividade',
        });
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async function subscribe(activityId: string) {
    const token = await storage.getItem('token');
    await fetch(`${API_URL}/activities/${activityId}/subscribe`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`},
    });
    await fetchParticipants(activityId);
    await fetchActivityDetails(activityId);
  }

  async function unsubscribe(activityId: string) {
    const token = await storage.getItem('token');
    await fetch(`${API_URL}/activities/${activityId}/unsubscribe`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`},
    });
    await fetchParticipants(activityId);
    await fetchActivityDetails(activityId);
  }

  async function approve(
    activityId: string,
    participantId: string,
    approve: boolean,
  ) {
    const token = await storage.getItem('token');
    await fetch(`${API_URL}/activities/${activityId}/approve`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({participantId, approve}),
    });
    await fetchParticipants(activityId);
    await fetchActivityDetails(activityId);
  }

  async function checkIn(activityId: string, code: string) {
    try {
      const token = await storage.getItem('token');
      const response = await fetch(
        `${API_URL}/activities/${activityId}/check-in`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({confirmationCode: code}),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Código inválido',
        );
      }

      await fetchParticipants(activityId);
    } catch (err) {
      throw err;
    }
  }

  const approvedCount = useMemo(() => {
    return state.participants.filter(
      p => p.approved === 'APPROVED' || p.subscriptionStatus === 'APPROVED',
    ).length;
  }, [state.participants]);

  return (
    <ActivityContext.Provider
      value={{
        state,
        dispatch,
        fetchParticipants,
        subscribe,
        unsubscribe,
        approve,
        checkIn,
        fetchConfirmationCode,
        fetchActivityDetails,
        approvedCount,
      }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity deve ser usado dentro de um ActivityProvider');
  }
  return context;
}
