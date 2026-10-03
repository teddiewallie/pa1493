"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/service/get-items";
import { getGroups } from "@/service/get-groups";
import { EquipmentContext } from "@/context/equipment-context";

const EquipmentProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);

  const refreshItems = async () => {
    setLoading(true);
    const capsule = await getItems();
    setItems(capsule.items);
    setMeta(capsule.meta);
    setLoading(false);
  };

  const refreshGroups = async () => {
    setLoading(true);
    const { groups: initialGroups } = await getGroups();
    setGroups(initialGroups);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await refreshItems();
      await refreshGroups();
    }

    load();
  }, []);

  return (
    <EquipmentContext.Provider value={{groups, items, meta, loading, refreshItems, refreshGroups}}>
      { children }
    </EquipmentContext.Provider>
  );
};

export { EquipmentProvider, loading };

