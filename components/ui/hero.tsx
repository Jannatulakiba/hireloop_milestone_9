import Image from "next/image"
import { Briefcase, MapPin, Search } from "lucide-react"

import globe from "@app/images/globe.png"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const trendingPositions = ["Product Designer", "AI Engineering", "DevOps Engineer"]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Globe backdrop from @app/images */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-36 bottom-0 mx-auto max-w-[1040px]"
      >
        <Image
          src={globe}
          alt=""
          fill
          sizes="(max-width: 1040px) 100vw, 1040px"
          loading="eager"
          className="object-cover object-top"
        />
        <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-surface via-surface/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 pt-16 text-center sm:pt-20 lg:pt-44">
        {/* Badge */}
        <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-sm">
          <span
            aria-hidden
            className="hidden h-px w-8 bg-gradient-to-r from-transparent to-white/25 sm:block"
          />
          <Briefcase
            aria-hidden
            className="size-3.5 shrink-0 text-amber-500"
            strokeWidth={2}
          />
          <span className="text-[11px] font-semibold tracking-wider text-white/60 uppercase">
            <span className="text-white">59,800+</span> New Jobs This Month
          </span>
          <span
            aria-hidden
            className="hidden h-px w-8 bg-gradient-to-l from-transparent to-white/25 sm:block"
          />
        </span>

        <h1 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Find Your Dream Job Today
        </h1>

        <p className="mx-auto mt-5 max-w-[600px] text-sm leading-relaxed text-white/60 sm:text-base">
          Hireloop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role &mdash;
          faster.
        </p>

        {/* Search */}
        <form
          role="search"
          className="mx-auto mt-7 flex w-full max-w-[1040px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] p-2 pl-5 shadow-[0_20px_60px_-20px_rgb(0_0_0_/_0.8)] backdrop-blur-md sm:gap-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Search
              aria-hidden
              className="size-5 shrink-0 text-white/45"
              strokeWidth={2}
            />
            <input
              type="search"
              name="q"
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              className="h-12 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/45 focus-visible:outline-none"
            />
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-8 bg-white/10 sm:block"
          />

          <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
            <MapPin
              aria-hidden
              className="size-5 shrink-0 text-white/45"
              strokeWidth={2}
            />
            <input
              type="search"
              name="location"
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              className="h-12 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/45 focus-visible:outline-none"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            aria-label="Search jobs"
            className="size-11 shrink-0 rounded-xl bg-brand text-brand-foreground hover:bg-brand/85 sm:size-12"
          >
            <Search />
          </Button>
        </form>

        {/* Trending */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/50 sm:text-[13px]">
          <span className="mr-1">Trending Positions</span>
          {trendingPositions.map((position) => (
            <span
              key={position}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-white/80"
            >
              {position}
            </span>
          ))}
        </div>
      </div>

      {/* Statement over the globe */}
      <p className="relative z-10 mx-auto max-w-[1320px] px-4 pt-24 pb-20 text-center text-xl leading-snug font-medium text-white sm:pt-36 sm:text-2xl lg:pt-72">
        Assisting over 15,000 job seekers
        <br className="hidden sm:block" /> find their dream positions.
      </p>
    </section>
  )
}

export { Hero }
