"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Globe,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";
import type { CreateJobResult, JobInput } from "@/lib/actions/jobs";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Finance & Legal",
  "Customer Support",
  "Operations & HR",
];

const FREQUENCIES = ["per hour", "per day", "per week", "per month", "per year"];

const inputClass =
  "h-11 rounded-xl border border-[#232327] bg-[#1e1e21] dark:bg-[#1e1e21] px-3.5 text-sm text-white placeholder:text-[#a0a0ab] focus-visible:border-[#5c53fe] focus-visible:ring-[#5c53fe]/25";

const textareaClass =
  "min-h-[98px] resize-y rounded-xl border border-[#232327] bg-[#1e1e21] dark:bg-[#1e1e21] px-3.5 py-3 text-sm leading-relaxed text-white placeholder:text-[#a0a0ab] focus-visible:border-[#5c53fe] focus-visible:ring-[#5c53fe]/25";

const selectClass =
  "h-11 w-full rounded-xl border border-[#232327] bg-[#1e1e21] dark:bg-[#1e1e21] px-3.5 text-sm text-white focus-visible:border-[#5c53fe] focus-visible:ring-[#5c53fe]/25 [&_svg]:text-[#a0a0ab]";

export interface JobFormProps {
  /** Page heading, breadcrumb, and description rendered above the sections. */
  header: ReactNode;
  initialValues: JobInput;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  onSubmit: (values: JobInput) => Promise<CreateJobResult>;
}

export function JobForm({
  header,
  initialValues,
  submitLabel,
  submittingLabel,
  successMessage,
  onSubmit,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobInput>(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSubmitted(false);

    try {
      const result = await onSubmit(formData);
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong while saving the job.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save the job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#2a2a2b]/40 pb-6">
        <div className="flex flex-col gap-1.5">{header}</div>
      </div>

      {/* 1. Basic Information */}
      <section className="rounded-2xl bg-[#151516] p-6">
        <h2 className="mb-5 flex items-center gap-2.5 text-base font-medium text-white">
          <span className="size-2 rounded-full bg-[#5c53fe]" />
          1. Basic Information
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm text-[#f4f4f5]">
              Job Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Frontend Developer"
              required
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company" className="text-sm text-[#f4f4f5]">
                Company Name *
              </Label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a0a0ab]" />
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="HirePulse Network"
                  required
                  className={cn(inputClass, "pl-10")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-[#f4f4f5]">Job Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value ?? prev.category,
                  }))
                }
                required
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e21] text-white ring-[#2a2a2b]">
                  {CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="focus:bg-[#232327] focus:text-white"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#f4f4f5]">Job Type *</Label>
            <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, jobType: type }));
                    setSubmitted(false);
                    setError(null);
                  }}
                  className={cn(
                    "h-11 rounded-xl border text-sm transition-colors",
                    formData.jobType === type
                      ? "border-[#5c53fe]/50 bg-[#232327] font-medium text-white"
                      : "border-transparent bg-[#1e1e21] text-[#a0a0ab] hover:bg-[#232327]"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Location, Compensation & Timeline */}
      <section className="rounded-2xl bg-[#151516] p-6">
        <h2 className="mb-5 flex items-center gap-2.5 text-base font-medium text-white">
          <span className="size-2 rounded-full bg-[#5c53fe]" />
          2. Location, Compensation &amp; Timeline
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[#232327] bg-[#1e1e21] p-3">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#232327] text-[#8f88ff]">
                <Globe className="size-4" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">
                  Remote Work Allowed (isRemote)
                </span>
                <span className="text-[13px] text-[#a0a0ab]">
                  Enable worldwide or distributed candidate applications
                </span>
              </div>
            </div>
            <Switch
              checked={formData.isRemote}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, isRemote: checked }));
                setSubmitted(false);
                setError(null);
              }}
              aria-label="Remote work allowed"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location" className="text-sm text-[#f4f4f5]">
                  Job Location (location)
                </Label>
                <span className="text-xs font-medium text-[#5a5a60]">
                  Required
                </span>
              </div>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a0a0ab]" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="New York, USA"
                  required
                  className={cn(inputClass, "pl-10")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="deadline" className="text-sm text-[#f4f4f5]">
                Application Deadline (deadline)
              </Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a0a0ab]" />
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className={cn(inputClass, "pl-10 [color-scheme:dark]")}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="minSalary" className="text-sm text-[#f4f4f5]">
                Min Salary / Rate
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-[#a0a0ab]">
                  ₵
                </span>
                <Input
                  id="minSalary"
                  name="minSalary"
                  inputMode="numeric"
                  value={formData.minSalary}
                  onChange={handleChange}
                  placeholder="25"
                  className={cn(inputClass, "pl-8")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="maxSalary" className="text-sm text-[#f4f4f5]">
                Max Salary / Rate
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-[#a0a0ab]">
                  ₵
                </span>
                <Input
                  id="maxSalary"
                  name="maxSalary"
                  inputMode="numeric"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  placeholder="40"
                  className={cn(inputClass, "pl-8")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-[#f4f4f5]">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    frequency: value ?? prev.frequency,
                  }))
                }
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e21] text-white ring-[#2a2a2b]">
                  {FREQUENCIES.map((frequency) => (
                    <SelectItem
                      key={frequency}
                      value={frequency}
                      className="focus:bg-[#232327] focus:text-white"
                    >
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Responsibilities & Requirements */}
      <section className="rounded-2xl bg-[#151516] p-6">
        <h2 className="mb-5 flex items-center gap-2.5 text-base font-medium text-white">
          <span className="size-2 rounded-full bg-[#5c53fe]" />
          3. Responsibilities &amp; Requirements
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="responsibilities"
              className="text-sm text-[#f4f4f5]"
            >
              Key Responsibilities *
            </Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
              required
              className={textareaClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="qualifications"
              className="text-sm text-[#f4f4f5]"
            >
              Qualifications &amp; Requirements *
            </Label>
            <Textarea
              id="qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder={
                "• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers"
              }
              required
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-[#151516] p-6">
        <div className="flex flex-wrap items-center gap-3">
          {submitted && (
            <span className="text-sm text-[#8f88ff]" role="status">
              {successMessage}
            </span>
          )}
          {error && (
            <span className="text-sm text-red-400" role="alert">
              {error}
            </span>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-xl bg-[#5c53fe] px-6 text-sm font-bold text-white hover:bg-[#4a42f0] disabled:opacity-60"
          >
            {submitting ? submittingLabel : submitLabel}
            <ArrowRight />
          </Button>
        </div>
      </section>
    </form>
  );
}
