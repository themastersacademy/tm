"use client";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

// Fetcher for SWR
export default async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

const BannerContext = createContext();

export function BannerProvider({ children }) {
  // Use SWR for caching and deduplication
  const {
    data: allData,
    error: allError,
    isLoading: loadingAll,
    mutate: mutateAll,
  } = useSWR("/api/home/banner", fetcher, { revalidateOnFocus: false });
  const loading = loadingAll;
  const banners = allError ? [] : allData?.data || [];
  return (
    <BannerContext.Provider
      value={{
        banners,
        loading,
        refetchBanners: () => {
          mutateAll();
        },
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}

export function useBanners() {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error("useBanners must be used within a BannerProvider");
  }
  return context;
}
