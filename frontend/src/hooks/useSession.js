import usePersistentState from './usePersistentState';

export default function useSession() {
  const [auth, setAuth] = usePersistentState('tw_auth', null);
  const [currentView, setCurrentView] = usePersistentState('tw_view', 'home');

  function loginUser(payload) {
    setAuth(payload);
    setCurrentView('home');
  }

  function logoutUser() {
    setAuth(null);
    setCurrentView('home');
  }

  function setCurrentUserId(userId) {
    setAuth((current) => {
      if (!current) {
        return current;
      }

      if (String(current.userId ?? '') === String(userId)) {
        return current;
      }

      return {
        ...current,
        userId: String(userId)
      };
    });
  }

  return {
    auth,
    currentView: auth ? currentView : 'auth',
    loginUser,
    logoutUser,
    setCurrentView,
    setCurrentUserId
  };
}
