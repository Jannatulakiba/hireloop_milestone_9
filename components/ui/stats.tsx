import type { LucideIcon } from "lucide-react"
import { Briefcase, ChartColumn, Star, Users } from "lucide-react"

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: ChartColumn, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

function Stats() {
  return (
    <section aria-label="Platform statistics" className="bg-surface pb-20">
      <div className="mx-auto max-w-[1170px] px-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-6 py-8 md:px-7"
            >
              <Icon
                aria-hidden
                className="size-5 text-white/75"
                strokeWidth={1.5}
              />
              <div className="mt-10 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {value}
              </div>
              <div className="mt-2 text-sm text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Stats }
