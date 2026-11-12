"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JobForm } from "@/components/jobs/job-form";
import { createJob } from "@/lib/actions/jobs";
import { EMPTY_JOB } from "@/lib/jobs-data";

export default function NewJobPage() {
  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#131314] md:-m-6">
      <div className="mx-auto w-full max-w-[1032px] px-6 pt-6 pb-8">
        <JobForm
          initialValues={EMPTY_JOB}
          submitLabel="Publish Job"
          submittingLabel="Publishing…"
          successMessage="Job posted successfully."
          onSubmit={createJob}
          header={
            <>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <Link
                  href="/dashboard/recruiter/jobs"
                  className="text-[#a0a0ab] transition-colors hover:text-white"
                >
                  Manage Jobs
                </Link>
                <ChevronRight aria-hidden className="size-3 text-[#5a5a60]" />
                <span className="text-[#c3c0ff]">Create New Listing</span>
              </nav>
              <h1 className="text-[32px] leading-tight font-medium text-white">
                Post a New Job
              </h1>
              <p className="text-[13px] text-[#a0a0ab]">
                Fill in the position specifications to attract qualified talent
                across our network.
              </p>
            </>
          }
        />
      </div>
    </div>
  );
}
