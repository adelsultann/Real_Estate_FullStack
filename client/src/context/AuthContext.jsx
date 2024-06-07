import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  // initialize use state with currentUser with value from 
  // localStorage if not it will be null
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  //Directly modifying currentUser would not trigger a re-render because React wouldn't know that a change occurred.
  // note if this updated the useEffect function below will directely triggered 
  const updateUser = (data) => {
    setCurrentUser(data);
  };

//This effect runs every time currentUser changes, updating the localStorage with the new currentUser value.
//
  useEffect(() => {
    console.log(`from authcontex ${currentUser}`)
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
