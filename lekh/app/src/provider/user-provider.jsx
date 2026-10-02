"use client";

import { UserContext } from "@/context/user-context";

const UserProvider = ({ user, children }) => (
  <UserContext.Provider value={{user}}>
    { children }
  </UserContext.Provider>
);

export { UserProvider };

