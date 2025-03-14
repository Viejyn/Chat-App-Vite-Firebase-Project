import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/config';

const AuthPage = ({ setIsAuth }) => {
    const handleClick = async () => {
      try {
        await auth.signOut();

        const res = await signInWithPopup(auth, provider);

        localStorage.setItem("token", res.user.refreshToken);

        setIsAuth(true);
      } catch (err) {
          console.error("Giriş hatası:", err);

          if (err.code === "auth/popup-blocked") {
            alert("Popup engellendi! Lütfen tarayıcı ayarlarından popup'lara izin verin.");
          }
      } 
    };

    return (
        <div className='container'>
          <div className='auth'>
            <h1>Chat Odası</h1>
            <p>Devam etmek için Giriş Yapın</p>
            <button onClick={handleClick}>
                <img src="/g-logo.png" alt="Google Logo"/>
                <span>Google ile giriş yap</span>
            </button>
          </div>
        </div>
    );
};

export default AuthPage;