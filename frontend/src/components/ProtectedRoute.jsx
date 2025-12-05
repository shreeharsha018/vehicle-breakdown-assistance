import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAllowed, redirectPath = '/' }) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}