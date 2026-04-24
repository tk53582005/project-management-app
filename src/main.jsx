import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import './index.css'
import App from './App.jsx'

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_LF0Frqj4b',
  client_id: '4vrs82vcgc93shqql5bdngdrfd',
  redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'email openid phone',
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)