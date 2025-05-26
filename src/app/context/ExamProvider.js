"use client";
import React, { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";

// GET fetcher
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  });

// POST fetcher
const postFetcher = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  });

const ExamContext = createContext();

export function ExamProvider({ children }) {
  const { goalID } = useParams();

  const groupKey = goalID ? `/api/exams/type/${goalID}/group/all` : null;
  const mockKey = goalID ? `/api/exams/type/${goalID}/mock/all` : null;
  const subjectsKey = goalID ? ["/api/goal/get-all-subject", { goalID }] : null;
  const historyKey = goalID ? `/api/exams/history?goalID=${goalID}` : null;

  // Fetch group exams
  const {
    data: groupData,
    error: groupError,
    isLoading: groupLoading,
    mutate: mutateGroup,
  } = useSWR(groupKey, fetcher, { revalidateOnFocus: false });

  // Fetch mock exams
  const {
    data: mockData,
    error: mockError,
    isLoading: mockLoading,
    mutate: mutateMock,
  } = useSWR(mockKey, fetcher, { revalidateOnFocus: false });

  // Fetch subjects
  const {
    data: subjectsData,
    error: subjectsError,
    isLoading: subjectsLoading,
    mutate: mutateSubjects,
  } = useSWR(subjectsKey, ([url, body]) => postFetcher(url, body), {
    revalidateOnFocus: false,
  });

  // Fetch exam history
  const {
    data: historyData,
    error: historyError,
    isLoading: historyLoading,
    mutate: mutateHistory,
  } = useSWR(historyKey, fetcher, { revalidateOnFocus: false });

  // Derived values
  const group = useMemo(() => groupData?.data || [], [groupData]);
  const mock = useMemo(() => mockData?.data || [], [mockData]);
  const subjects = useMemo(() => subjectsData?.data || [], [subjectsData]);
  const history = useMemo(() => historyData?.data || [], [historyData]);

  const loading =
    groupLoading || mockLoading || subjectsLoading || historyLoading;

  const error = groupError || mockError || subjectsError || historyError;

  const contextValue = useMemo(
    () => ({
      group,
      mock,
      subjects,
      history,
      loading,
      error,
      refetch: () => {
        mutateGroup();
        mutateMock();
        mutateSubjects();
        mutateHistory();
      },
    }),
    [
      group,
      mock,
      subjects,
      history,
      loading,
      error,
      mutateGroup,
      mutateMock,
      mutateSubjects,
      mutateHistory,
    ]
  );

  return (
    <ExamContext.Provider value={contextValue}>{children}</ExamContext.Provider>
  );
}

export const useExams = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error("useExams must be used within an ExamProvider");
  return context;
};
