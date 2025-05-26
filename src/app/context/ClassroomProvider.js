"use client";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

// Fetcher for SWR
export default async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

const ClassroomContext = createContext();

export function ClassroomProvider({ children }) {
  // Use SWR for caching and deduplication
  const {
    data: allData,
    error: allError,
    isLoading: loadingAll,
    mutate: mutateAll,
  } = useSWR("/api/my-classroom/get-all-enrolled-batch", fetcher, {
    revalidateOnFocus: false,
  });
  const loading = loadingAll;
  const classrooms = allError ? [] : allData?.data || [];
  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        loading,
        refetchClassrooms: () => {
          mutateAll();
        },
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

export function useClassrooms() {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error("useClassrooms must be used within a ClassroomProvider");
  }
  return context;
}
