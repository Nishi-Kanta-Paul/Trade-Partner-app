import { ScreenHeader } from "@/components/ScreenHeader";
import { AccentProvider } from "@/lib/accents";
import { Field } from "@/components/form/Field";
import { TextArea, TextInput } from "@/components/form/TextInput";
import { CheckboxGroup, RadioGroup, YesNo } from "@/components/form/Choice";
import { MediaUpload } from "@/components/form/MediaUpload";
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
  ACTIVITIES,
  EMPTY_DEPARTURE,
  STATUSES,
  UPLOAD_FALLBACK_EMAIL,
  type DepartureValues,
} from "@/data/departure";

const STEPS = ["Job", "Proof", "Work done", "You", "Review"] as const;

/** This screen belongs to the "amber" stage — it wears that colour. */
const ACCENT = "amber" as const;

const REQUIRED: Record<number, string[]> = {
  0: ["date", "cleaningDate", "projectName", "projectNumber", "projectCity"],
  1: ["completedMedia", "actionPhotos"],
  2: ["activities", "details", "cleaners", "startTime", "finishTime", "ppeOk", "status"],
  3: ["firstName", "lastName", "company", "email", "phone"],
  4: [],
};

/** "09:30 AM" -> minutes since midnight, or null if not complete yet. */
function toMinutes(value: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return null;
  const [, h, m, meridiem] = match;
  const hour = (Number(h) % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0);
  return hour * 60 + Number(m);
}

/** Hours on site, so nobody has to do the arithmetic on the report. */
function hoursOnSite(start: string, finish: string) {
  const from = toMinutes(start);
  const to = toMinutes(finish);
  if (from === null || to === null) return null;
  const span = (to - from + 24 * 60) % (24 * 60);
  const hours = Math.floor(span / 60);
  const minutes = span % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export default function DepartureForm() {
  const w = useWizard<DepartureValues & Record<string, never>>(
    EMPTY_DEPARTURE as DepartureValues & Record<string, never>,
    REQUIRED,
    STEPS.length,
  );
  const v = w.values;
  const onSite = hoursOnSite(v.startTime, v.finishTime);

  if (w.submitted)
    return (
      <SubmittedScreen
        accent={ACCENT}
        title="Daily report sent"
        message="Your departure report is in. The office can see what was completed today."
      />
    );

  return (
    <AccentProvider accent={ACCENT}>
      <div className="min-h-dvh bg-slate-50 dark:bg-[#0a1426]">
        <ScreenHeader
          title="Departure Report"
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
              title="Today's job"
              blurb="A daily report keeps the office and the site on the same page — what got done, and what's still outstanding."
            >
              <Field label="Today's date" required error={w.errorFor("date")}>
                <TextInput
                  type="date"
                  value={v.date}
                  invalid={!!w.errorFor("date")}
                  onChange={(e) => w.set("date", e.target.value)}
                />
              </Field>

              <Field
                label="Cleaning date"
                hint="The day the work was actually performed."
                required
                error={w.errorFor("cleaningDate")}
              >
                <TextInput
                  type="date"
                  value={v.cleaningDate}
                  invalid={!!w.errorFor("cleaningDate")}
                  onChange={(e) => w.set("cleaningDate", e.target.value)}
                />
              </Field>

              <Field label="Project name" required error={w.errorFor("projectName")}>
                <TextInput
                  value={v.projectName}
                  invalid={!!w.errorFor("projectName")}
                  onChange={(e) => w.set("projectName", e.target.value)}
                />
              </Field>

              <Field label="Project number" required error={w.errorFor("projectNumber")}>
                <TextInput
                  inputMode="numeric"
                  placeholder="e.g. 23"
                  value={v.projectNumber}
                  invalid={!!w.errorFor("projectNumber")}
                  onChange={(e) => w.set("projectNumber", e.target.value)}
                />
              </Field>

              <Field
                label="Project city & state"
                required
                error={w.errorFor("projectCity")}
              >
                <TextInput
                  value={v.projectCity}
                  invalid={!!w.errorFor("projectCity")}
                  onChange={(e) => w.set("projectCity", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}

          {w.step === 1 ? (
            <StepCard
              accent={ACCENT}
              title="Proof of work"
              blurb="Both uploads are required to submit."
            >
              <Callout title="Important">
                <p>
                  Photos and videos are required <strong>every day</strong> — the areas
                  cleaned, plus action photos of the team actively cleaning.
                </p>
                <p className="font-bold">
                  Always hold the device sideways (landscape) when capturing.
                </p>
              </Callout>

              <Field
                label="Areas cleaned 100%"
                hint="Photos and videos of completed areas."
                required
                error={w.errorFor("completedMedia")}
              >
                <MediaUpload
                  files={v.completedMedia}
                  invalid={!!w.errorFor("completedMedia")}
                  onChange={(files) => w.set("completedMedia", files)}
                />
              </Field>

              <Field
                label="Action photos"
                hint="Cleaners actively cleaning."
                required
                error={w.errorFor("actionPhotos")}
              >
                <MediaUpload
                  files={v.actionPhotos}
                  invalid={!!w.errorFor("actionPhotos")}
                  onChange={(files) => w.set("actionPhotos", files)}
                />
              </Field>

              <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                Upload failing on site?{" "}
                <a
                  href={`mailto:${UPLOAD_FALLBACK_EMAIL}`}
                  className="text-navy dark:text-brand font-bold underline"
                >
                  Email them to {UPLOAD_FALLBACK_EMAIL}
                </a>{" "}
                instead.
              </p>
            </StepCard>
          ) : null}

          {w.step === 2 ? (
            <StepCard
              accent={ACCENT}
              title="What got done"
              blurb="The heart of the daily report."
            >
              <Field
                label="Cleaning activities you did today"
                hint={`${v.activities.length} selected`}
                required
                error={w.errorFor("activities")}
              >
                <CheckboxGroup
                  options={ACTIVITIES}
                  value={v.activities}
                  onChange={(value) => w.set("activities", value)}
                />
              </Field>

              <Field
                label="Explain what cleaning was completed today"
                hint="Details are important — this is what the office reads."
                required
                error={w.errorFor("details")}
              >
                <TextArea
                  value={v.details}
                  invalid={!!w.errorFor("details")}
                  onChange={(e) => w.set("details", e.target.value)}
                />
              </Field>

              <Field
                label="Number of cleaners on site today"
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
                label="Time you started cleaning"
                required
                error={w.errorFor("startTime")}
              >
                <TimeInput
                  value={v.startTime}
                  invalid={!!w.errorFor("startTime")}
                  onChange={(value) => w.set("startTime", value)}
                />
              </Field>

              <Field
                label="Time you finished cleaning"
                hint={onSite ? `${onSite} on site` : undefined}
                required
                error={w.errorFor("finishTime")}
              >
                <TimeInput
                  value={v.finishTime}
                  invalid={!!w.errorFor("finishTime")}
                  onChange={(value) => w.set("finishTime", value)}
                />
              </Field>

              <Field
                label="Did all your cleaners have proper PPE?"
                hint="Hard hat, safety vest, jeans and work shoes."
                required
                error={w.errorFor("ppeOk")}
              >
                <YesNo value={v.ppeOk} onChange={(value) => w.set("ppeOk", value)} />
              </Field>

              <Field
                label="Current cleaning status"
                required
                error={w.errorFor("status")}
              >
                <RadioGroup
                  options={STATUSES}
                  value={v.status}
                  onChange={(value) => w.set("status", value)}
                />
              </Field>

              <Field label="Any additional comments or questions?">
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
              blurb="So the office knows who filed this."
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

              <Field label="Company name" required error={w.errorFor("company")}>
                <TextInput
                  autoComplete="organization"
                  value={v.company}
                  invalid={!!w.errorFor("company")}
                  onChange={(e) => w.set("company", e.target.value)}
                />
              </Field>

              <Field label="Email" required error={w.errorFor("email")}>
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

              <Field label="Phone number" required error={w.errorFor("phone")}>
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
            </StepCard>
          ) : null}

          {w.step === 4 ? (
            <StepCard
              accent={ACCENT}
              title="Review & submit"
              blurb="Last look before it goes to the office."
            >
              <SummaryList>
                <Summary label="Project" value={v.projectName} />
                <Summary label="Number" value={v.projectNumber} />
                <Summary label="Cleaning date" value={v.cleaningDate} />
                <Summary label="On site" value={onSite ?? ""} />
                <Summary label="Cleaners" value={v.cleaners} />
                <Summary label="Activities" value={v.activities.join(", ")} />
                <Summary label="PPE" value={v.ppeOk} />
                <Summary label="Status" value={v.status} />
                <Summary
                  label="Media"
                  value={`${v.completedMedia.length} completed, ${v.actionPhotos.length} action`}
                />
                <Summary label="Filed by" value={`${v.firstName} ${v.lastName}`.trim()} />
              </SummaryList>
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
          submitLabel="Submit report"
        />
      </div>
    </AccentProvider>
  );
}
