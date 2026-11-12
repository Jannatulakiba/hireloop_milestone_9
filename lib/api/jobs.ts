import type { JobRecord } from "@/lib/jobs-data"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const requiredString = (
  record: Record<string, unknown>,
  field: string
): string => {
  const value = record[field]
  if (typeof value !== "string") {
    throw new Error(`Job API returned a job with an invalid ${field}`)
  }
  return value
}

const toJobRecord = (value: unknown): JobRecord => {
  if (!isRecord(value)) {
    throw new Error("Job API returned an invalid job record")
  }

  const id = value.id ?? value._id
  if (typeof id !== "string") {
    throw new Error("Job API returned a job without an id")
  }

  const status = value.status
  if (status !== undefined && status !== "active" && status !== "expired") {
    throw new Error("Job API returned a job with an invalid status")
  }
  if (typeof value.isRemote !== "boolean") {
    throw new Error("Job API returned a job with an invalid isRemote value")
  }
  if (value.applicants !== undefined && typeof value.applicants !== "number") {
    throw new Error("Job API returned a job with an invalid applicants value")
  }
  if (
    value.postedLabel !== undefined &&
    typeof value.postedLabel !== "string"
  ) {
    throw new Error("Job API returned a job with an invalid postedLabel")
  }

  const job: JobRecord = {
    id,
    title: requiredString(value, "title"),
    company: requiredString(value, "company"),
    category: requiredString(value, "category"),
    jobType: requiredString(value, "jobType"),
    isRemote: value.isRemote,
    location: requiredString(value, "location"),
    deadline: requiredString(value, "deadline"),
    minSalary: requiredString(value, "minSalary"),
    maxSalary: requiredString(value, "maxSalary"),
    frequency: requiredString(value, "frequency"),
    responsibilities: requiredString(value, "responsibilities"),
    qualifications: requiredString(value, "qualifications"),
  }

  if (typeof value.applicants === "number") job.applicants = value.applicants
  if (status === "active" || status === "expired") job.status = status
  if (typeof value.postedLabel === "string") {
    job.postedLabel = value.postedLabel
  }

  return job
}

/**
 * Fetch jobs, optionally filtered by a query string such as
 * `jobType=part-time&search=nextjs`. Empty-string params are dropped and a
 * param-less request stays `/jobs` (no dangling `?`).
 */
export const getJobs = async (query = ''): Promise<JobRecord[]> => {
  const source = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query)
  const params = new URLSearchParams()
  for (const [key, value] of source) {
    const name = key.trim()
    const term = value.trim()
    if (name && term) params.append(name, term)
  }
  const search = params.toString()

  const response = await fetch(`${BASE_URL}/jobs${search ? `?${search}` : ''}`)
  if (!response.ok) {
    throw new Error(`Unable to load jobs (HTTP ${response.status})`)
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Job API returned an invalid jobs list')
  }

  return data.map(toJobRecord)
}

export const getJob = async (id: string): Promise<JobRecord | null> => {
  const response = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(id)}`)
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Unable to load job (HTTP ${response.status})`)
  }

  return toJobRecord(await response.json())
}
