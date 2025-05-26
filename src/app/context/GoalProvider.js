import React, { createContext, useContext } from "react";
import useSWR from "swr";

// Fetcher for SWR
export default async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

const GoalContext = createContext();

export function GoalProvider({ children }) {
  // Use SWR for caching and deduplication
  const {
    data: allData,
    error: allError,
    isLoading: loadingAll,
    mutate: mutateAll,
  } = useSWR("/api/goal/all", fetcher, { revalidateOnFocus: false });
  const {
    data: enData,
    error: enError,
    isLoading: loadingEn,
    mutate: mutateEn,
  } = useSWR("/api/user/get-goal", fetcher, { revalidateOnFocus: false });

  const loading = loadingAll || loadingEn;
  const goals = allError ? [] : allData?.data || [];
  const enrolledGoals = enError ? [] : enData?.data || [];

  return (
    <GoalContext.Provider
      value={{
        goals,
        enrolledGoals,
        loading,
        refetchGoals: () => {
          mutateAll();
          mutateEn();
        },
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoals must be used within a GoalProvider");
  }
  return context;
}
