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
  // const courseListKey = goalID ? ["/api/courses/get-course-list", { goalID }] : null;
  const liveCoursesKey = goalID ? ["/api/courses/liveCourses", { goalID }] : null;

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

  // const {
  //   data: courseListRes,
  //   error: courseListErr,
  //   isLoading: loadingCourseList,
  //   mutate: mutateCourseList,
  // } = useSWR(courseListKey, ([url, body]) => postFetcher(url, body), {
  //   revalidateOnFocus: false,
  // });

  const {
    data: liveCoursesRes,
    error: liveCoursesErr,
    isLoading: loadingLiveCourses,
    mutate: mutateLiveCourses,
  } = useSWR(liveCoursesKey, ([url, body]) => postFetcher(url, body), {
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

  // const courseList = useMemo(() => {
  //   if (!goalID || courseListErr) return [];
  //   return courseListRes?.data || [];
  // }, [goalID, courseListRes, courseListErr]);

  const liveCourses = useMemo(() => {
    if (!goalID || liveCoursesErr) return [];
    return liveCoursesRes?.data || [];
  }, [goalID, liveCoursesRes, liveCoursesErr]);

  const loading = loadingEnrolled || loadingStore  || loadingLiveCourses;

  const refetch = useCallback(() => {
    mutateEnrolled();
    mutateStore();
    mutateCourseList();
    mutateLiveCourses();
  }, [mutateEnrolled, mutateStore, mutateLiveCourses]);

  const contextValue = useMemo(
    () => ({ enrolledCourses, storeCourses, goalDetails, liveCourses, loading, refetch }),
    [enrolledCourses, storeCourses, goalDetails, liveCourses, loading, refetch]
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
