import { useSelector } from 'react-redux'; export const useAuth = () => { const auth = useSelector(s => s.auth); return { login: () => {}, loading: false, error: null, ...auth }; };
