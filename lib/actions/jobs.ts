const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface JobInput {
  title: string
  company: string
  category: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

export interface CreateJobResult<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}

export const createJob = async (data: JobInput): Promise<CreateJobResult> => {
  try {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return {
        ok: false,
        error: `Job API responded with status ${response.status}`,
      }
    }

    const json = await response.json().catch(() => null)
    return { ok: true, data: json }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to reach the job API",
    }
  }
}
