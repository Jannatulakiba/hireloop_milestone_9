import type { JobInput } from "@/lib/actions/jobs";

export type JobStatus = "active" | "expired";

/**
 * A job as it is stored by the "Post a New Job" form (`JobInput`),
 * plus the display metadata the manage-jobs table needs.
 */
export interface JobRecord extends JobInput {
  id: string;
  applicants?: number;
  status?: JobStatus;
  /** Pre-rendered relative label, e.g. "Posted 3 days ago". */
  postedLabel?: string;
}

/** Blank values for the "Post a New Job" form. */
export const EMPTY_JOB: JobInput = {
  title: "",
  company: "",
  category: "Engineering & Tech",
  jobType: "Full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "per hour",
  responsibilities: "",
  qualifications: "",
};

const CEDI = "\u20B5";

const FREQUENCY_SUFFIX: Record<string, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per week": "/ wk",
  "per month": "/ mo",
  "per year": "/ yr",
};

const formatMoney = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const amount = Number(trimmed);
  if (Number.isNaN(amount)) return null;

  return amount >= 1000
    ? `${CEDI}${Math.round(amount / 1000)}k`
    : `${CEDI}${amount}`;
};

/** "₵25 – ₵40 / hr", "₵50k – ₵115k / yr", or "Not specified". */
export const formatCompensation = (job: JobInput): string => {
  const min = formatMoney(job.minSalary ?? "");
  const max = formatMoney(job.maxSalary ?? "");

  if (!min && !max) return "Not specified";

  const range = [min, max].filter(Boolean).join(" \u2013 ");
  const suffix = FREQUENCY_SUFFIX[job.frequency];

  return suffix ? `${range} ${suffix}` : range;
};

/** "2027-01-30" -> "Jan 30, 2027" (UTC so server and client agree). */
export const formatDeadline = (isoDate: string): string => {
  if (!isoDate) return "No deadline";

  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

/** "Remote (New York, USA)" / "Berlin, Germany (On-site)". */
export const formatLocation = (job: JobInput): string => {
  const location = job.location.trim();

  if (job.isRemote) {
    return location ? `Remote (${location})` : "Remote";
  }

  return location ? `${location} (On-site)` : "On-site";
};

export const formatApplicants = (count?: number): string =>
  count === undefined
    ? "Not available"
    : `${count} ${count === 1 ? "Candidate" : "Candidates"}`;
