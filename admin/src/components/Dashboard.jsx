import React, { useEffect, useState } from "react";
import { dashboardStyles as s } from "../assets/dummySyles";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building, User } from "lucide-react";
const Dashboard = () => {
  const [companyFilter, setCompanyFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: "0",
    closedJobs: "0",
    totalApplicants: "0",
    totalCompanies: "0",
  });

  const [toast, setToast] = useState(null);
  const [jobs, setJobs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const statsRes = await fetch(
          "http://localhost:5000/api/job/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const statsData = await statsRes.json();
        if (statsData.success) {
          setDashboardStats(statsData.stats);
        } else {
          setToast({ type: "error", message: statsData.message });
        }
        const jobsRes = await fetch(
          "http://localhost:5000/api/job/admin/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const jobsData = await jobsRes.json();
        if (jobsData.success) {
          const mappedJobs = jobsData.jobs.map((j) => ({
            id: j._id,
            name: j.companyName,
            role: j.roleName,
            location: j.location,
            category: j.category,
            logo: j.companyLogo?.startsWith("http")
              ? j.companyLogo
              : `http://localhost:5000${j.companyLogo || ""}`,
            applicants: j.applicantsCount || 0,
            status: j.status || "active",
          }));
          setJobs(mappedJobs);
        } else {
          setToast({ type: "error", message: jobsData.message });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  //handle toast auto-dismiss

  useEffect(() => {
    if (toast && !toast.confirm) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  //handle close job

  const handleCloseJob = async (jobId) => {
    setToast({
      type: "confirm",
      message: " Are you want to close this job?",
      confirm: true,
      jobId,
    });
  };

  //to close

  const handleConfirmClose = async () => {
    const jobId = toast.jobId;
    setToast(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/job/admin/jobs/${jobId}/close`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: "Job closed successfully" });

        //refresh the state

        const statsRes = await fetch(
          "http://localhost:5000/api/job/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const statsData = await statsRes.json();
        if (statsData.success) {
          setDashboardStats(statsData.stats);
        } else {
          setToast({ type: "error", message: statsData.message });
        }
        const jobsRes = await fetch(
          "http://localhost:5000/api/job/admin/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const jobsData = await jobsRes.json();
        if (jobsData.success) {
          const mappedJobs = jobsData.jobs.map((j) => ({
            id: j._id,
            name: j.companyName,
            role: j.roleName,
            location: j.location,
            category: j.category,
            logo: j.companyLogo?.startsWith("http")
              ? j.companyLogo
              : `http://localhost:5000${j.companyLogo || ""}`,
            applicants: j.applicantsCount || 0,
            status: j.status || "active",
          }));
          setJobs(mappedJobs);
        } else {
          setToast({ type: "error", message: jobsData.message });
        }
      } else {
        setToast({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Error closing job:", error);
      setToast({ type: "error", message: "Error closing job" });1
    }
  };

  const stats = [
    {
      label: "Total Jobs",
      value: dashboardStats.totalJobs,
      icon: Briefcase,
      colors: statColors.blue,
    },
    {
      label: "Closed Jobs",
      value: dashboardStats.closedJobs,
      icon: Briefcase,
      colors: statColors.rose,
    },
    {
      label: "Total Applicants",
      value: dashboardStats.totalApplicants,
      icon: User,
      colors: statColors.emerald,
    },
    {
      label: "Active Companies",
      value: dashboardStats.totalCompanies,
      icon: Building,
      colors: statColors.amber,
    },
  ];

  //to get unique companies and role filter

  
  const uniqueCompanies = [...new Set(jobs.map((c) => c.name))];
  const uniqueRoles = [...new Set(jobs.map((c) => c.role))];

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    const matchesCompany = companyFilter === "" || job.name === companyFilter;
    const matchesRole = roleFilter === "" || job.role === roleFilter;
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesCompany && matchesRole && matchesStatus;
  });


  //fallbacke for the logos failed to load 

  const handleImageError = (e) => {
    e.target.style.display="none";
    e.target.nextSibling?.classList.remove("hidden");
  };

  //clear all filter

  const clearFilters=()=>{
    setCompanyFilter("");
    setRoleFilter("");
    setStatusFilter("active");
  }

  return (
    <div className={s.container}>
      
    </div>
  );
};

export default Dashboard;
