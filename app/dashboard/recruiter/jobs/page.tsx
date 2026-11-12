"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Briefcase,
  Bug,
  ChevronRight,
  ClipboardList,
  Code2,
  Copy,
  EllipsisVertical,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  Pencil,
  Plus,
  RotateCcw,
  Server,
  Trash2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { getJobs } from "@/lib/api/jobs";
import {
  formatApplicants,
  formatCompensation,
  formatDeadline,
  formatLocation,
  type JobRecord,
  type JobStatus,
} from "@/lib/jobs-data";

interface CategoryStyle {
  icon: LucideIcon;
  chip: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Engineering & Tech": { icon: Code2, chip: "bg-[#132a4a] text-[#6aa6ff]" },
  "Design & Creative": { icon: Palette, chip: "bg-[#43261a] text-[#ff9b6b]" },
  "Marketing & Sales": { icon: Megaphone, chip: "bg-[#43261a] text-[#ff9b6b]" },
  "Finance & Legal": { icon: Briefcase, chip: "bg-[#16352a] text-[#4ade80]" },
  "Customer Support": {
    icon: MessageCircle,
    chip: "bg-[#1e2f4a] text-[#7dd3fc]",
  },
  "Operations & HR": { icon: Server, chip: "bg-[#3a2a55] text-[#c08bff]" },
};

const FALLBACK_STYLE: CategoryStyle = {
  icon: Briefcase,
  chip: "bg-[#232327] text-[#a0a0ab]",
};

/** A few titles get their own glyph, like in the design. */
const TITLE_ICONS: Record<string, LucideIcon> = {
  "Frontend Developer": Code2,
  "DevOps Specialist": Server,
  "QA Automation Engineer": Bug,
};

const jobVisual = (job: JobRecord): CategoryStyle => {
  const style = CATEGORY_STYLES[job.category] ?? FALLBACK_STYLE;
  return { ...style, icon: TITLE_ICONS[job.title] ?? style.icon };
};

const StatusPill = ({ status }: { status?: JobStatus }) => {
  const isActive = status === "active";
  const isExpired = status === "expired";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        isActive
          ? "border-[#245c3b] bg-[#12301f] text-[#4ade80]"
          : "border-[#3a3a3e] bg-[#232327] text-[#a0a0ab]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-[#4ade80]" : "bg-[#a0a0ab]"
        )}
      />
      {isActive ? "Active" : isExpired ? "Expired" : "Unknown"}
    </span>
  );
};

const JobIdentity = ({ job }: { job: JobRecord }) => {
  const visual = jobVisual(job);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          visual.chip
        )}
      >
        <visual.icon className="size-4" />
      </span>
      <div className="min-w-0 max-w-[11rem]">
        <p className="truncate text-sm font-semibold text-white" title={job.title}>
          {job.title}
        </p>
        <p className="truncate text-xs text-[#a0a0ab]">{job.category}</p>
      </div>
    </div>
  );
};

const CompanyCell = ({ job }: { job: JobRecord }) => {
  const location = formatLocation(job);

  return (
    <div className="min-w-0 max-w-[10.5rem]">
      <p className="truncate text-sm text-[#f4f4f5]" title={job.company}>
        {job.company}
      </p>
      <p
        className="flex items-center gap-1.5 text-[11px] text-[#a0a0ab]"
        title={location}
      >
        <MapPin aria-hidden className="size-3.5 shrink-0" />
        <span className="truncate">{location}</span>
      </p>
    </div>
  );
};

interface JobActionsProps {
  job: JobRecord;
  onDuplicate: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const JobActions = ({
  job,
  onDuplicate,
  onToggleStatus,
  onDelete,
}: JobActionsProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; right: number }>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setOpen(false);
    setPosition(undefined);
  };

  const openMenu = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + 6,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onViewportChange = () => closeMenu();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [open]);

  const menuItemClass =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#c3c3c8] transition-colors hover:bg-[#232327] hover:text-white focus-visible:bg-[#232327] focus-visible:text-white focus-visible:outline-none";

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center justify-end gap-1"
    >
      <Button
        render={
          <Link
            href={`/dashboard/recruiter/jobs/${encodeURIComponent(job.id)}`}
          />
        }
        nativeButton={false}
        size="sm"
        className="h-8 rounded-lg bg-[#5c53fe] px-2.5 text-xs font-semibold text-white hover:bg-[#4a42f0]"
      >
        <Pencil aria-hidden />
        Edit
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${job.title}`}
        onClick={() => onDelete(job.id)}
        className="text-[#a0a0ab] hover:bg-[#232327] hover:text-red-400"
      >
        <Trash2 aria-hidden />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`More actions for ${job.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        className="text-[#a0a0ab] hover:bg-[#232327] hover:text-white"
      >
        <EllipsisVertical aria-hidden />
      </Button>

      {open && position && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={closeMenu}
          />
          <div
            role="menu"
            aria-label={`Actions for ${job.title}`}
            className="fixed z-50 w-48 overflow-hidden rounded-xl border border-[#2a2a2b] bg-[#1e1e21] py-1 shadow-2xl shadow-black/40"
            style={{ top: position.top, right: position.right }}
          >
            <button
              type="button"
              role="menuitem"
              className={menuItemClass}
              onClick={() => {
                closeMenu();
                onDuplicate(job.id);
              }}
            >
              <Copy aria-hidden className="size-3.5" />
              Duplicate job
            </button>
            <button
              type="button"
              role="menuitem"
              className={menuItemClass}
              onClick={() => {
                closeMenu();
                onToggleStatus(job.id);
              }}
            >
              {job.status === "active" ? (
                <Archive aria-hidden className="size-3.5" />
              ) : (
                <RotateCcw aria-hidden className="size-3.5" />
              )}
              {job.status === "active" ? "Archive job" : "Reactivate job"}
            </button>
            <button
              type="button"
              role="menuitem"
              className={menuItemClass}
              onClick={() => {
                closeMenu();
                onDelete(job.id);
              }}
            >
              <Trash2 aria-hidden className="size-3.5" />
              Delete job
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const MetaItem = ({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
}) => (
  <div className="flex min-w-0 flex-col gap-1">
    <dt className="text-[10px] font-medium tracking-[0.08em] text-[#5a5a60] uppercase">
      {label}
    </dt>
    <dd className="flex items-center gap-1.5 text-sm text-[#f4f4f5]">
      {Icon ? <Icon aria-hidden className="size-3.5 shrink-0 text-[#a0a0ab]" /> : null}
      <span className="truncate">{value}</span>
    </dd>
    {sub ? <span className="text-[11px] text-[#5a5a60]">{sub}</span> : null}
  </div>
);

interface JobActionHandlers {
  onDuplicate: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

type JobItemProps = JobActionHandlers & { job: JobRecord };

const JobRow = ({ job, ...actions }: JobItemProps) => (
  <tr className="group border-b border-[#232327] transition-colors last:border-b-0 hover:bg-[#1a1a1c]">
    <td className="px-2.5 py-4 align-middle">
      <JobIdentity job={job} />
    </td>
    <td className="px-2.5 py-4 align-middle">
      <CompanyCell job={job} />
    </td>
    <td className="px-2.5 py-4 align-middle text-[13px] whitespace-nowrap text-[#c3c3c8]">
      {job.jobType}
    </td>
    <td className="px-2.5 py-4 align-middle text-sm font-medium whitespace-nowrap text-white">
      {formatCompensation(job)}
    </td>
    <td className="px-2.5 py-4 align-middle">
      <span className="inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap text-[#c3c3c8]">
        <Users aria-hidden className="size-3.5 text-[#a0a0ab]" />
        {formatApplicants(job.applicants)}
      </span>
    </td>
    <td className="px-2.5 py-4 align-middle">
      <StatusPill status={job.status} />
    </td>
    <td className="px-2.5 py-4 align-middle">
      <p className="text-[13px] whitespace-nowrap text-[#f4f4f5]">
        {formatDeadline(job.deadline)}
      </p>
      <p className="text-[11px] whitespace-nowrap text-[#5a5a60]">
        {job.postedLabel}
      </p>
    </td>
    <td className="sticky right-0 z-10 bg-[#151516] px-2.5 py-4 text-right align-middle transition-colors group-hover:bg-[#1a1a1c]">
      <JobActions {...actions} job={job} />
    </td>
  </tr>
);

const JobCard = ({ job, ...actions }: JobItemProps) => (
  <article className="rounded-xl border border-[#232327] bg-[#1a1a1c] p-4">
    <div className="flex items-start justify-between gap-3">
      <JobIdentity job={job} />
      <StatusPill status={job.status} />
    </div>

    <div className="mt-3 min-w-0">
      <p className="truncate text-sm font-medium text-[#f4f4f5]">{job.company}</p>
      <p className="flex items-center gap-1.5 truncate text-xs text-[#a0a0ab]">
        <MapPin aria-hidden className="size-3.5 shrink-0" />
        <span className="truncate">{formatLocation(job)}</span>
      </p>
    </div>

    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#232327] pt-3 sm:grid-cols-4">
      <MetaItem label="Type" value={job.jobType} />
      <MetaItem label="Compensation" value={formatCompensation(job)} />
      <MetaItem
        label="Applicants"
        value={formatApplicants(job.applicants)}
        icon={Users}
      />
      <MetaItem
        label="Deadline"
        value={formatDeadline(job.deadline)}
        sub={job.postedLabel}
      />
    </dl>

    <div className="mt-4 flex justify-end border-t border-[#232327] pt-3">
      <JobActions {...actions} job={job} />
    </div>
  </article>
);

const RecruiterManageJobsPage = () => {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    getJobs()
      .then((loadedJobs) => {
        if (active) {
          setJobs(loadedJobs);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load jobs"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const retryLoad = () => {
    setLoading(true);
    setLoadError(null);
    setReloadKey((key) => key + 1);
  };

  const handleDelete = (id: string) => {
    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id
          ? {
              ...job,
              status: job.status === "active" ? "expired" : "active",
            }
          : job
      )
    );
  };

  const handleDuplicate = (id: string) => {
    setJobs((currentJobs) => {
      const index = currentJobs.findIndex((job) => job.id === id);
      if (index === -1) return currentJobs;

      const source = currentJobs[index];
      const copy: JobRecord = {
        ...source,
        id: `${source.id}_copy_${Date.now()}`,
        title: `${source.title} (Copy)`,
        applicants: 0,
        status: "active",
        postedLabel: "Posted just now",
      };

      return [
        ...currentJobs.slice(0, index + 1),
        copy,
        ...currentJobs.slice(index + 1),
      ];
    });
  };

  const actionProps = {
    onDuplicate: handleDuplicate,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDelete,
  };

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#131314] md:-m-6">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-10 md:px-6">
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
          <span className="text-[#c3c0ff]">Job Listings &amp; Postings</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[32px] leading-tight font-medium text-white">
              Manage Job Posts
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-[#a0a0ab]">
              Review, publish, archive, and update job details across your
              organization.
            </p>
          </div>

          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            nativeButton={false}
            className="h-11 shrink-0 rounded-xl bg-[#5c53fe] px-5 text-sm font-bold text-white hover:bg-[#4a42f0]"
          >
            <Plus aria-hidden />
            New Job Post
          </Button>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#232327] bg-[#151516]">
          {loading ? (
            <p role="status" className="px-6 py-16 text-center text-sm text-[#a0a0ab]">
              Loading job posts…
            </p>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <p role="alert" className="text-sm text-red-400">
                {loadError}
              </p>
              <Button
                onClick={retryLoad}
                className="h-10 rounded-xl bg-[#5c53fe] px-4 text-sm font-bold text-white hover:bg-[#4a42f0]"
              >
                Try again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-xl bg-[#232327] text-[#8f88ff]"
              >
                <ClipboardList className="size-5" />
              </span>
              <p className="text-sm font-medium text-white">No job posts yet</p>
              <p className="max-w-sm text-[13px] text-[#a0a0ab]">
                Publish your first listing to start collecting applications from
                candidates across the network.
              </p>
              <Button
                render={<Link href="/dashboard/recruiter/jobs/new" />}
                nativeButton={false}
                className="mt-1 h-10 rounded-xl bg-[#5c53fe] px-4 text-sm font-bold text-white hover:bg-[#4a42f0]"
              >
                <Plus aria-hidden />
                New Job Post
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop table (1440px and up) */}
              <div className="hidden overflow-x-auto min-[1440px]:block">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <caption className="sr-only">
                    Job postings with their status, compensation, applicants, and
                    deadline
                  </caption>
                  <thead>
                    <tr className="border-b border-[#232327] text-[11px] tracking-[0.08em] text-[#5a5a60] uppercase">
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Job Title &amp; Dept
                      </th>
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Company &amp; Location
                      </th>
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Type
                      </th>
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Compensation
                      </th>
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Applicants
                      </th>
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-2.5 py-4 font-medium">
                        Deadline
                      </th>
                      <th
                        scope="col"
                        className="sticky right-0 z-10 bg-[#151516] px-2.5 py-4 text-right font-medium"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <JobRow key={job.id} job={job} {...actionProps} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card list (below 1440px) */}
              <div className="flex flex-col gap-3 p-4 min-[1440px]:hidden">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} {...actionProps} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecruiterManageJobsPage;
