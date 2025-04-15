import { useLocalStorage } from './hooks';

type UserType = {
  user?: {
    userName: string,
    clientId: string,
    mqttToken: string,
  }
};

const useUser = () => {
  const [user, setUser] = useLocalStorage<UserType>('user', {});
  
  const params = new URLSearchParams(window.location.search)
  
  const encodedClientId = params.get('clientId');
  const encodedMqttToken = params.get('mqttToken');

  if(encodedClientId && encodedMqttToken) {
    const clientId = decodeURI(encodedClientId);
    const mqttToken = decodeURI(encodedMqttToken);
    const newUser = { user: {
      userName: window.atob(clientId),
      clientId: 'PetalGlow-' + clientId,
      mqttToken,
    }};

    // Deep object comparison
    if(JSON.stringify(user) !== JSON.stringify(newUser)) {
      setUser(newUser);
    }
  }
  return user;
};

export default useUser;
