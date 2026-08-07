import { ResultView } from "@/components/result/result-view";
import { getScanForSession } from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { scanIdSchema } from "@/lib/validation";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!scanIdSchema.safeParse(id).success) notFound();
  const sessionId = await getAnonymousSessionId({ create: false });
  if (!sessionId) notFound();

  let scan;
  try {
    scan = await getScanForSession(id, sessionId);
  } catch {
    notFound();
  }

  if (!scan) notFound();
  return <ResultView result={scan.resultJson} />;
}
