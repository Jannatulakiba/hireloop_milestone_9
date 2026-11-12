const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface JobInput {
  title: string;
  company: string;
  category: string;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  frequency: string;
  responsibilities: string;
  qualifications: string;
}

export interface CreateJobResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

const request = async (
  path: string,
  init: RequestInit
): Promise<CreateJobResult> => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Job API responded with status ${response.status}`,
      };
    }

    const json = await response.json().catch(() => null);
    return { ok: true, data: json };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to reach the job API",
    };
  }
};

export const createJob = (data: JobInput): Promise<CreateJobResult> =>
  request("/jobs", { method: "POST", body: JSON.stringify(data) });

export const updateJob = (
  id: string,
  data: JobInput
): Promise<CreateJobResult> =>
  request(`/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
