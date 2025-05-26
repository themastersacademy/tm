"use client";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

// Fetcher for SWR
export default async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const {
    data: subscriptionData,
    error: subscriptionError,
    isLoading: subscriptionLoading,
    mutate: subscriptionMutate,
  } = useSWR("/api/subscription/get-all-plans", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  const loading = subscriptionLoading;
  const plans = subscriptionError ? [] : subscriptionData?.data || [];

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        loading,
        refetchPlans: () => subscriptionMutate(),
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
