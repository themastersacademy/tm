"use client";
import React, { createContext, useContext, useMemo, useCallback } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";

const postFetcher = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  });

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const { goalID } = useParams();

  // Always call hooks in same order
  const enrolledKey = goalID
    ? ["/api/courses/get-enrolled-course", { goalID }]
    : null;
  const storeKey = goalID ? ["/api/home/goal-details", { goalID }] : null;

  const {
    data: enrolledRes,
    error: enrolledErr,
    isLoading: loadingEnrolled,
    mutate: mutateEnrolled,
  } = useSWR(enrolledKey, ([url, body]) => postFetcher(url, body), {
    revalidateOnFocus: false,
  });

  const {
    data: storeRes,
    error: storeErr,
    isLoading: loadingStore,
    mutate: mutateStore,
  } = useSWR(storeKey, ([url, body]) => postFetcher(url, body), {
    revalidateOnFocus: false,
  });

  // Derive data values
  const enrolledCourses = useMemo(() => {
    if (!goalID || enrolledErr) return [];
    return enrolledRes?.data || [];
  }, [goalID, enrolledRes, enrolledErr]);

  const storeCourses = useMemo(() => {
    if (!goalID || storeErr) return [];
    return storeRes?.data?.coursesList || [];
  }, [goalID, storeRes, storeErr]);

  const goalDetails = useMemo(() => {
    if (!goalID || storeErr) return [];
    return storeRes?.data || {};
  }, [goalID, storeRes, storeErr]);

  const loading = loadingEnrolled || loadingStore;

  const refetch = useCallback(() => {
    mutateEnrolled();
    mutateStore();
  }, [mutateEnrolled, mutateStore]);

  const contextValue = useMemo(
    () => ({ enrolledCourses, storeCourses, loading, refetch }),
    [enrolledCourses, storeCourses, loading, refetch]
  );

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context)
    throw new Error("useCourses must be used within a CourseProvider");
  return context;
}
