import { setLogin, setLogout } from './authSlice';  
const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    if (setLogin.match(action)) {
        const { auth } = store.getState();
        localStorage.setItem('token', auth.token);
        localStorage.setItem('user', JSON.stringify(auth.user));
        console.log('Token and user data saved to localStorage.');
    } else if (setLogout.match(action)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Token and user data removed from localStorage.');
    }

    return result;
};

export default localStorageMiddleware;