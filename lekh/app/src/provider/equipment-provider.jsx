"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/service/get-items";
import { getGroups } from "@/service/get-groups";
import { EquipmentContext } from "@/context/equipment-context";

const EquipmentProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});
  const [groups, setGroups] = useState({});

  const [loading, setLoading] = useState(true);

  const refreshItems = async () => {
    setLoading(true);

    const capsule = await getItems();
    const groups = await getGroups();

    setItems(capsule.items);
    setMeta(capsule.meta);
    setGroups(groups);
    setLoading(false);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <EquipmentContext.Provider value={{groups, items, meta, loading, refreshItems}}>
      { children }
    </EquipmentContext.Provider>
  );
};

export { EquipmentProvider, loading };

