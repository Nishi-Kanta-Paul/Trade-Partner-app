import { ScreenHeader } from "@/components/ScreenHeader";
import { sendSubmission } from "@/lib/submit";
import { ACCENTS, AccentProvider } from "@/lib/accents";
import { cn } from "@/lib/utils";
import { Field } from "@/components/form/Field";
import { TextArea, TextInput } from "@/components/form/TextInput";
import { CheckboxGroup, YesNo } from "@/components/form/Choice";
import { PhotoUpload } from "@/components/form/PhotoUpload";
import { TimeInput } from "@/components/form/TimeInput";
import { Callout } from "@/components/form/Callout";
import {
  StepCard,
  StepDots,
  SubmittedScreen,
  Summary,
  SummaryList,
  WizardActions,
  useWizard,
} from "@/components/form/Wizard";
import {
  CLEANING_TYPES,
  EMPTY_ARRIVAL,
  type ArrivalValues,
  arrivalPayload,
} from "@/data/arrival";

const STEPS = ["Check in", "Project", "Crew", "You", "Review"] as const;

/** This screen belongs to the "amber" stage — it wears that colour. */
const ACCENT = "amber" as const;

const REQUIRED: Record<number, string[]> = {
  0: ["ppePhoto"],
  1: ["projectName", "projectLocation", "projectNumber", "arrivalTime", "currentTime"],
  2: ["cleaners", "ppeOk", "cleaningToday"],
  3: ["firstName", "lastName", "company", "phone", "email"],
  4: [],
};

/** Fills the time field with the phone's clock — the common case on arrival. */
function nowAsClock() {
  const now = new Date();
  const hours = now.getHours();
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${meridiem}`;
}

export default function ArrivalForm() {
  const w = useWizard<ArrivalValues & Record<string, never>>(
    EMPTY_ARRIVAL as ArrivalValues & Record<string, never>,
    REQUIRED,
    STEPS.length,
    (values) => sendSubmission("arrival", values, arrivalPayload(values)),
  );
  const v = w.values;

  if (w.submitted)
    return (
      <SubmittedScreen
        accent={ACCENT}
        title="You're checked in"
        message="Your arrival is logged. Remember the action photos — sideways, not vertical."
      />
    );

  return (
    <AccentProvider accent={ACCENT}>
      <div className="min-h-dvh bg-slate-50 dark:bg-[#0a1426]">
        <ScreenHeader
          title="Daily Arrival"
          subtitle={`Step ${w.step + 1} of ${STEPS.length} — ${STEPS[w.step]}`}
          accent={ACCENT}
          progress={(w.step + (w.stepComplete ? 1 : 0)) / STEPS.length}
          onBack={w.back}
        />

        <main className="mx-auto max-w-2xl px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-40">
          <StepDots steps={STEPS} step={w.step} accent={ACCENT} />

          {w.step === 0 ? (
            <StepCard
              accent={ACCENT}
              title="Check in on site"
              blurb="Document today's arrival before the crew starts."
            >
              <Field label="Today's date">
                <TextInput
                  type="date"
                  value={v.date}
                  onChange={(e) => w.set("date", e.target.value)}
                />
              </Field>

              <Callout title="Important">
                <p>
                  Take photos and videos of areas cleaned complete, and of the techs
                  cleaning — you upload them on your daily report each day.
                </p>
                <p className="font-bold">
                  Hold your phone sideways, not vertical. Those are your action photos.
                </p>
              </Callout>

              <Field
                label="Photo of the team in PPE"
                hint="You cannot submit the form without it."
                required
                error={w.errorFor("ppePhoto")}
              >
                <PhotoUpload
                  file={v.ppePhoto}
                  invalid={!!w.errorFor("ppePhoto")}
                  onChange={(file) => w.set("ppePhoto", file)}
                />
              </Field>
            </StepCard>
          ) : null}

          {w.step === 1 ? (
            <StepCard
              accent={ACCENT}
              title="Project"
              blurb="Which job, and when you got there."
            >
              <Field label="Project name" required error={w.errorFor("projectName")}>
                <TextInput
                  value={v.projectName}
                  invalid={!!w.errorFor("projectName")}
                  onChange={(e) => w.set("projectName", e.target.value)}
                />
              </Field>

              <Field
                label="Project location city & state"
                required
                error={w.errorFor("projectLocation")}
              >
                <TextInput
                  value={v.projectLocation}
                  invalid={!!w.errorFor("projectLocation")}
                  onChange={(e) => w.set("projectLocation", e.target.value)}
                />
              </Field>

              <Field label="Project number" required error={w.errorFor("projectNumber")}>
                <TextInput
                  inputMode="numeric"
                  value={v.projectNumber}
                  invalid={!!w.errorFor("projectNumber")}
                  onChange={(e) => w.set("projectNumber", e.target.value)}
                />
              </Field>

              <Field label="Arrival time" required error={w.errorFor("arrivalTime")}>
                <div className="space-y-2">
                  <TimeInput
                    value={v.arrivalTime}
                    invalid={!!w.errorFor("arrivalTime")}
                    onChange={(value) => w.set("arrivalTime", value)}
                  />
                  <NowButton onClick={() => w.set("arrivalTime", nowAsClock())} />
                </div>
              </Field>

              <Field label="Current time" required error={w.errorFor("currentTime")}>
                <div className="space-y-2">
                  <TimeInput
                    value={v.currentTime}
                    invalid={!!w.errorFor("currentTime")}
                    onChange={(value) => w.set("currentTime", value)}
                  />
                  <NowButton onClick={() => w.set("currentTime", nowAsClock())} />
                </div>
              </Field>
            </StepCard>
          ) : null}

          {w.step === 2 ? (
            <StepCard
              accent={ACCENT}
              title="Crew & work"
              blurb="Who is on site and what they're doing."
            >
              <Field
                label="Number of cleaners on site now"
                required
                error={w.errorFor("cleaners")}
              >
                <TextInput
                  inputMode="numeric"
                  placeholder="e.g. 4"
                  value={v.cleaners}
                  invalid={!!w.errorFor("cleaners")}
                  onChange={(e) => w.set("cleaners", e.target.value)}
                />
              </Field>

              <Field
                label="Do all cleaners have proper PPE?"
                hint="Hard hat, safety vest, jeans and work shoes."
                required
                error={w.errorFor("ppeOk")}
              >
                <YesNo value={v.ppeOk} onChange={(value) => w.set("ppeOk", value)} />
              </Field>

              <Field
                label="Cleaning you'll be doing today"
                hint={`${v.cleaningToday.length} selected`}
                required
                error={w.errorFor("cleaningToday")}
              >
                <CheckboxGroup
                  options={CLEANING_TYPES}
                  value={v.cleaningToday}
                  onChange={(value) => w.set("cleaningToday", value)}
                />
              </Field>

              <Field label="Any comments or questions?">
                <TextArea
                  value={v.comments}
                  onChange={(e) => w.set("comments", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}

          {w.step === 3 ? (
            <StepCard
              accent={ACCENT}
              title="Who's reporting"
              blurb="So the office knows who checked in."
            >
              <Field
                label="Your name"
                required
                error={w.errorFor("firstName") ?? w.errorFor("lastName")}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="First name"
                    autoComplete="given-name"
                    value={v.firstName}
                    invalid={!!w.errorFor("firstName")}
                    onChange={(e) => w.set("firstName", e.target.value)}
                  />
                  <TextInput
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={v.lastName}
                    invalid={!!w.errorFor("lastName")}
                    onChange={(e) => w.set("lastName", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Your company name" required error={w.errorFor("company")}>
                <TextInput
                  autoComplete="organization"
                  value={v.company}
                  invalid={!!w.errorFor("company")}
                  onChange={(e) => w.set("company", e.target.value)}
                />
              </Field>

              <Field label="Your phone number" required error={w.errorFor("phone")}>
                <TextInput
                  type="tel"
                  inputMode="tel"
                  placeholder="(000) 000-0000"
                  autoComplete="tel"
                  value={v.phone}
                  invalid={!!w.errorFor("phone")}
                  onChange={(e) => w.set("phone", e.target.value)}
                />
              </Field>

              <Field label="Your email address" required error={w.errorFor("email")}>
                <TextInput
                  type="email"
                  inputMode="email"
                  placeholder="example@example.com"
                  autoComplete="email"
                  value={v.email}
                  invalid={!!w.errorFor("email")}
                  onChange={(e) => w.set("email", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}

          {w.step === 4 ? (
            <StepCard
              accent={ACCENT}
              title="Review & submit"
              blurb="Check it before it goes to the office."
            >
              <SummaryList>
                <Summary label="Project" value={v.projectName} />
                <Summary label="Number" value={v.projectNumber} />
                <Summary label="Location" value={v.projectLocation} />
                <Summary label="Arrived" value={v.arrivalTime} />
                <Summary label="Now" value={v.currentTime} />
                <Summary label="Cleaners" value={v.cleaners} />
                <Summary label="PPE" value={v.ppeOk} />
                <Summary label="Work today" value={v.cleaningToday.join(", ")} />
                <Summary
                  label="Reported by"
                  value={`${v.firstName} ${v.lastName}`.trim()}
                />
                <Summary label="PPE photo" value={v.ppePhoto ? "Attached" : ""} />
              </SummaryList>

              <Callout title="Before you leave">
                <p>
                  Keep taking action photos through the day — areas cleaned complete, and
                  techs at work. Sideways, not vertical.
                </p>
              </Callout>
            </StepCard>
          ) : null}
        </main>

        <WizardActions
          step={w.step}
          lastStep={STEPS.length - 1}
          stepComplete={w.stepComplete}
          onBack={w.back}
          onNext={w.next}
          onSubmit={w.submit}
          accent={ACCENT}
          sending={w.sending}
          error={w.error}
          submitLabel="Submit arrival"
        />
      </div>
    </AccentProvider>
  );
}

function NowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-[13px] font-bold transition-colors active:scale-95",
        ACCENTS[ACCENT].soft,
      )}
    >
      Use current time
    </button>
  );
}
