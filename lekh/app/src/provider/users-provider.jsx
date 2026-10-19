"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/service/get-users";
import { UsersContext } from "@/context/users-context";

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = async () => {
    setLoading(true);

    try {
      const users = await getUsers();
      setUsers(users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, refreshUsers, loading }}>
      {children}
    </UsersContext.Provider>
  );
};

export { UsersProvider };

