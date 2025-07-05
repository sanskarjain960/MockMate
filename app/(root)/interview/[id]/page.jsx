"use client";
import { getInterviewById } from "@/actions/general.actions";
import Agent from "@/components/Agent";
import Loader from "@/components/Loading";
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/actions/auth.actions";

const page = ({ params }) => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState({}); 
  const [user,setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        setId(id);

        const interview = await getInterviewById(id);
        setInterview(interview);

        const user = await getCurrentUser();
        setUser(user);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if(loading) return <Loader />

  return (
    <>

    
    
    <Agent 
        userName={user?.name} 
        userId = {user?.id} 
        type = "interview"
        interviewId = {id}
        questions={interview?.questions}
        interviewData={interview}
    />
        

    </>
  );
};

export default page;
