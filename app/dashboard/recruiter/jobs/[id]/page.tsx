"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/jobs/job-form";
import { updateJob, type JobInput } from "@/lib/actions/jobs";
import { getJob } from "@/lib/api/jobs";
import type { JobRecord } from "@/lib/jobs-data";

const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#131314] md:-m-6">
    <div className="mx-auto w-full max-w-[1032px] px-6 pt-6 pb-8">
      {children}
    </div>
  </div>
);

const Breadcrumb = () => (
  <nav
    aria-label="Breadcrumb"
    className="flex flex-wrap items-center gap-1.5 text-xs font-medium"
  >
    <Link
      href="/dashboard/recruiter/jobs"
      className="text-[#a0a0ab] transition-colors hover:text-white"
    >
      Manage Jobs
    </Link>
    <ChevronRight aria-hidden className="size-3 text-[#5a5a60]" />
    <Link
      href="/dashboard/recruiter/jobs"
      className="text-[#a0a0ab] transition-colors hover:text-white"
    >
      Job Listings &amp; Postings
    </Link>
    <ChevronRight aria-hidden className="size-3 text-[#5a5a60]" />
    <span className="text-[#c3c0ff]">Update Job Post</span>
  </nav>
);

export default function UpdateJobPage() {
  const params = useParams<{ id: string }>();
  const [loadState, setLoadState] = useState<
    | { id: string; status: "loading" }
    | { id: string; status: "loaded"; job: JobRecord | null }
    | { id: string; status: "error"; message: string }
  >({ id: params.id, status: "loading" });

  useEffect(() => {
    let active = true;

    getJob(params.id)
      .then((loadedJob) => {
        if (active) {
          setLoadState({ id: params.id, status: "loaded", job: loadedJob });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadState({
            id: params.id,
            status: "error",
            message:
              error instanceof Error ? error.message : "Unable to load job",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  const isLoading =
    loadState.id !== params.id || loadState.status === "loading";

  if (isLoading) {
    return (
      <PageShell>
        <p role="status" className="py-16 text-center text-sm text-[#a0a0ab]">
          Loading job…
        </p>
      </PageShell>
    );
  }

  if (loadState.status === "error" && loadState.id === params.id) {
    return (
      <PageShell>
        <p role="alert" className="py-16 text-center text-sm text-red-400">
          {loadState.message}
        </p>
      </PageShell>
    );
  }

  const job = loadState.status === "loaded" ? loadState.job : null;

  if (job === null) {
    return (
      <PageShell>
        <Breadcrumb />
        <section className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-[#151516] px-6 py-14 text-center">
          <h1 className="text-xl font-medium text-white">Job not found</h1>
          <p className="max-w-sm text-[13px] text-[#a0a0ab]">
            This listing may have been removed, or the link is out of date.
          </p>
          <Button
            render={<Link href="/dashboard/recruiter/jobs" />}
            nativeButton={false}
            className="mt-1 h-10 rounded-xl bg-[#5c53fe] px-4 text-sm font-bold text-white hover:bg-[#4a42f0]"
          >
            Back to Manage Jobs
          </Button>
        </section>
      </PageShell>
    );
  }

  const handleSubmit = async (values: JobInput) => {
    return updateJob(job.id, values);
  };

  return (
    <PageShell>
      <JobForm
        key={job.id}
        initialValues={job}
        submitLabel="Update Job"
        submittingLabel="Updating…"
        successMessage="Job updated successfully."
        onSubmit={handleSubmit}
        header={
          <>
            <Breadcrumb />
            <h1 className="text-[32px] leading-tight font-medium text-white">
              Update Job Post
            </h1>
            <p className="text-[13px] text-[#a0a0ab]">
              Modify position specifications, compensation range, and candidate
              requirements for this listing.
            </p>
          </>
        }
      />
    </PageShell>
  );
}
