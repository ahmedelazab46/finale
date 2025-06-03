import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
       <GoogleOAuthProvider clientId="917470419321-l0l90k2hnic8ctmsu2qemgs567pqdsna.apps.googleusercontent.com"><App /></GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
) 