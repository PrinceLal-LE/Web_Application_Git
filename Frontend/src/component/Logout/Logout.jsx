import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setLogout } from '../../store/authSlice';
export const LogoutComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setLogout());
        navigate('/login', { replace: true });
    }, [dispatch, navigate]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h2>Logging out...</h2>
        </div>
    );
};

export default LogoutComponent;