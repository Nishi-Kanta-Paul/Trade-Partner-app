import { useParams } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { STAGES } from "@/data/stages";

/** Plays a briefing video in-app instead of bouncing out to the YouTube app. */
export default function VideoScreen() {
  const { videoId = "" } = useParams();
  const action = STAGES.flatMap((s) => s.actions).find(
    (a) => a.kind === "video" && a.href.endsWith(videoId),
  );

  return (
    <div className="bg-navy-deep min-h-dvh">
      <ScreenHeader
        title={action?.label ?? "Video"}
        subtitle="Cleaning Connected"
        accent="sky"
      />

      <main className="pt-[calc(3.5rem+env(safe-area-inset-top))]">
        <div className="mx-auto max-w-2xl">
          <div className="aspect-video w-full bg-black">
            <iframe
              className="size-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              title={action?.label ?? "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="px-5 py-6 text-white">
            <h2 className="text-xl font-extrabold">{action?.label}</h2>
            {action?.hint ? (
              <p className="mt-1.5 text-[15px] text-white/65">{action.hint}</p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
