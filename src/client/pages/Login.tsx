import firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const Login = () => {
    const handleGoogleSignIn = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((result: { user: { displayName: any; }; }) => {
          console.log('User signed in:', result.user);
          alert(`Hello, ${result.user.displayName}`);
        })
        .catch((error: any) => {
          console.error('Error during sign-in:', error);
        });
    };
  
    return (
        <>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Login with Google</h2>
        <button onClick={handleGoogleSignIn} style={{ padding: '10px 20px', backgroundColor: '#4285F4', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign in with Google
        </button>
      </div>
      </>
    );
  };

export default Login;