import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecruiterManageJobsPage = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-xl font-semibold">Manage Jobs</h1>
      <Button
        render={<Link href="/dashboard/recruiter/jobs/new" />}
        nativeButton={false}
        className="gap-1.5"
      >
        <PlusIcon />
        Post a New Job
      </Button>
    </div>
  );
};

export default RecruiterManageJobsPage;
