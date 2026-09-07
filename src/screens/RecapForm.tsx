import { ScreenHeader } from "@/components/ScreenHeader";
import { ACCENTS, AccentProvider } from "@/lib/accents";
import { cn } from "@/lib/utils";
import { Field } from "@/components/form/Field";
import { MoneyInput, TextArea, TextInput } from "@/components/form/TextInput";
import {
  StepCard,
  StepDots,
  SubmittedScreen,
  Summary,
  SummaryList,
  WizardActions,
  useWizard,
} from "@/components/form/Wizard";
import { EMPTY_RECAP, type RecapValues } from "@/data/recap";

const STEPS = ["Project", "Timeline", "The work", "You", "Review"] as const;

/** This screen belongs to the "emerald" stage — it wears that colour. */
const ACCENT = "emerald" as const;

const REQUIRED: Record<number, string[]> = {
  0: ["date", "projectName", "projectNumber", "projectCity", "projectState"],
  1: ["startDate", "completedDate", "daysWorked"],
  2: ["description", "issues", "totalValue"],
  3: ["company", "phone", "email"],
  4: [],
};

/** Calendar days from start to completion, inclusive — the usual reading of
 *  "days worked at the site" when a partner is on it every day. */
function spanInDays(start: string, end: string) {
  if (!start || !end) return null;
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf())) return null;
  const days = Math.round((to.valueOf() - from.valueOf()) / 86_400_000) + 1;
  return days > 0 ? days : null;
}

export default function RecapForm() {
  const w = useWizard<RecapValues & Record<string, never>>(
    EMPTY_RECAP as RecapValues & Record<string, never>,
    REQUIRED,
    STEPS.length,
  );
  const v = w.values;
  const suggestedDays = spanInDays(v.startDate, v.completedDate);

  if (w.submitted)
    return (
      <SubmittedScreen
        accent={ACCENT}
        title="Recap sent"
        message="The project recap is with the office. Your invoice can go in next."
      />
    );

  return (
    <AccentProvider accent={ACCENT}>
      <div className="min-h-dvh bg-slate-50 dark:bg-[#0a1426]">
        <ScreenHeader
          title="Project Recap"
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
              title="Which project?"
              blurb="This recap captures every detail of the job your company delivered."
            >
              <Field label="Date" required error={w.errorFor("date")}>
                <TextInput
                  type="date"
                  value={v.date}
                  invalid={!!w.errorFor("date")}
                  onChange={(e) => w.set("date", e.target.value)}
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
                  value={v.projectNumber}
                  invalid={!!w.errorFor("projectNumber")}
                  onChange={(e) => w.set("projectNumber", e.target.value)}
                />
              </Field>

              <Field
                label="Project city & state"
                required
                error={w.errorFor("projectCity") ?? w.errorFor("projectState")}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="City"
                    value={v.projectCity}
                    invalid={!!w.errorFor("projectCity")}
                    onChange={(e) => w.set("projectCity", e.target.value)}
                  />
                  <TextInput
                    placeholder="State / Province"
                    value={v.projectState}
                    invalid={!!w.errorFor("projectState")}
                    onChange={(e) => w.set("projectState", e.target.value)}
                  />
                </div>
              </Field>
            </StepCard>
          ) : null}

          {w.step === 1 ? (
            <StepCard
              accent={ACCENT}
              title="Timeline"
              blurb="When the crew started and finished."
            >
              <Field
                label="Date you started cleaning"
                required
                error={w.errorFor("startDate")}
              >
                <TextInput
                  type="date"
                  value={v.startDate}
                  invalid={!!w.errorFor("startDate")}
                  onChange={(e) => w.set("startDate", e.target.value)}
                />
              </Field>

              <Field
                label="Date cleaning was completed"
                required
                error={w.errorFor("completedDate")}
              >
                <TextInput
                  type="date"
                  min={v.startDate || undefined}
                  value={v.completedDate}
                  invalid={!!w.errorFor("completedDate")}
                  onChange={(e) => w.set("completedDate", e.target.value)}
                />
              </Field>

              <Field
                label="Total days worked at the site"
                required
                error={w.errorFor("daysWorked")}
              >
                <div className="space-y-2">
                  <TextInput
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    value={v.daysWorked}
                    invalid={!!w.errorFor("daysWorked")}
                    onChange={(e) => w.set("daysWorked", e.target.value)}
                  />
                  {suggestedDays && v.daysWorked !== String(suggestedDays) ? (
                    <button
                      type="button"
                      onClick={() => w.set("daysWorked", String(suggestedDays))}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[13px] font-bold transition-colors active:scale-95",
                        ACCENTS[ACCENT].soft,
                      )}
                    >
                      Use {suggestedDays} {suggestedDays === 1 ? "day" : "days"} from
                      those dates
                    </button>
                  ) : null}
                </div>
              </Field>
            </StepCard>
          ) : null}

          {w.step === 2 ? (
            <StepCard
              accent={ACCENT}
              title="The work"
              blurb="What was delivered, and what got in the way."
            >
              <Field
                label="Describe all the cleaning you completed"
                hint="In your own words — this is the record of the job."
                required
                error={w.errorFor("description")}
              >
                <TextArea
                  value={v.description}
                  invalid={!!w.errorFor("description")}
                  onChange={(e) => w.set("description", e.target.value)}
                />
              </Field>

              <Field
                label="Any issues encountered during cleaning"
                hint="Write 'None' if the job ran clean."
                required
                error={w.errorFor("issues")}
              >
                <TextArea
                  value={v.issues}
                  invalid={!!w.errorFor("issues")}
                  onChange={(e) => w.set("issues", e.target.value)}
                />
              </Field>

              <Field
                label="Total value of your cleaning"
                required
                error={w.errorFor("totalValue")}
              >
                <MoneyInput
                  placeholder="0.00"
                  value={v.totalValue}
                  invalid={!!w.errorFor("totalValue")}
                  onChange={(e) => w.set("totalValue", e.target.value)}
                />
              </Field>

              <Field label="Any additional comments?">
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
              title="Your company"
              blurb="Who delivered the work."
            >
              <Field label="Your name">
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="First name"
                    autoComplete="given-name"
                    value={v.firstName}
                    onChange={(e) => w.set("firstName", e.target.value)}
                  />
                  <TextInput
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={v.lastName}
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
            </StepCard>
          ) : null}

          {w.step === 4 ? (
            <StepCard
              accent={ACCENT}
              title="Review & submit"
              blurb="Check it before the office files it."
            >
              <SummaryList>
                <Summary label="Project" value={v.projectName} />
                <Summary label="Number" value={v.projectNumber} />
                <Summary
                  label="Location"
                  value={[v.projectCity, v.projectState].filter(Boolean).join(", ")}
                />
                <Summary label="Started" value={v.startDate} />
                <Summary label="Completed" value={v.completedDate} />
                <Summary label="Days worked" value={v.daysWorked} />
                <Summary
                  label="Total value"
                  value={v.totalValue ? `$${v.totalValue}` : ""}
                />
                <Summary label="Company" value={v.company} />
                <Summary label="Contact" value={v.email} />
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
          submitLabel="Submit recap"
        />
      </div>
    </AccentProvider>
  );
}
