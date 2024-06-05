import { getAuth, signOut } from "firebase/auth";

const SignOut = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("Signed out");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};

// Justin add menu shenangins and style
const Account = () => {
  return <button onClick={SignOut}>Sign Out</button>;
};

export default Account;
