"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/service/get-users";
import { UsersContext } from "@/context/users-context";

const UsersProvider = ({ children }) => {
  const [ users, setUsers ] = useState([]);

  const [ loading, setLoading ] = useState(true);

  const refreshUsers = async () => {
    setLoading(true);

    const users = await getUsers();

    setUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    refreshUsers()
  }, []);

  return (
    <UsersContext.Provider value={{users, refreshUsers}}>
      { children }
    </UsersContext.Provider>
  );
};

export { UsersProvider, loading };

