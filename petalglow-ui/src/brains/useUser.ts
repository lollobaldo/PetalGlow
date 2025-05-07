import { useLocalStorage } from './hooks';

type UserType = {
  user?: {
    userName: string,
    clientId: string,
    mqttToken: string,
    nFlowers: number,
  }
};

const useUser = () => {
  const [user, setUser] = useLocalStorage<UserType>('user', {});
  
  const params = new URLSearchParams(window.location.search)
  
  const encodedClientId = params.get('clientId');
  const encodedMqttToken = params.get('mqttToken');
  const nFlowers = params.get('nFlowers');

  if(encodedClientId && encodedMqttToken) {
    const clientId = decodeURI(encodedClientId);
    const mqttToken = decodeURI(encodedMqttToken);
    const newUser = { user: {
      userName: window.atob(clientId),
      clientId: 'PetalGlow-' + clientId,
      mqttToken,
      nFlowers: nFlowers ? parseInt(nFlowers) : 3,
    }};

    // Deep object comparison
    if(JSON.stringify(user) !== JSON.stringify(newUser)) {
      setUser(newUser);
    }
  }
  return user;
};

export default useUser;
