import type { EvidenceNode, InvestigationGraph } from "@/types/investigation";

const kindLabels: Record<EvidenceNode["kind"], string> = {
  case: "Kasus",
  scan: "Artefak",
  signal: "Pola berulang",
  domain: "Domain berulang",
};

export function EvidenceGraph({ graph }: { graph: InvestigationGraph }) {
  const sourceNodes = graph.nodes.filter((node) => node.kind === "scan");
  const sharedNodes = graph.nodes.filter((node) =>
    node.kind === "signal" || node.kind === "domain"
  );
  const sourceById = new Map(sourceNodes.map((node) => [node.id, node]));

  return (
    <section
      className="investigation-map"
      aria-labelledby="evidence-graph-heading"
    >
      <div className="product-container">
        <div className="investigation-map__heading">
          <div>
            <p className="product-eyebrow text-ai-soft">Peta hubungan</p>
            <h2 id="evidence-graph-heading">Apa yang benar-benar berulang?</h2>
          </div>
          <p>
            Hanya pola atau domain yang muncul pada sedikitnya dua artefak unik
            yang ditampilkan. Kesamaan membantu verifikasi, tetapi tidak
            membuktikan identitas pelaku atau kepastian penipuan.
          </p>
        </div>

        <div className="investigation-map__legend" aria-label="Legenda peta">
          <span><i data-kind="artifact" aria-hidden="true" /> Artefak unik</span>
          <span><i data-kind="pattern" aria-hidden="true" /> Pola bersama</span>
        </div>

        <div className="investigation-map__canvas">
          <div className="investigation-map__sources">
            <div className="investigation-map__column-heading">
              <h3>Artefak yang dibandingkan</h3>
              <span>{sourceNodes.length} unik</span>
            </div>
            <ol aria-label="Artefak unik dalam kasus">
              {sourceNodes.map((node, index) => (
                <li key={node.id} id={`map-${node.id}`}>
                  <span className="investigation-map__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="investigation-map__node-meta">
                      {kindLabels[node.kind]} ·{" "}
                      {node.riskLevel?.replaceAll("_", " ")}
                    </p>
                    <h4>{node.label}</h4>
                    <p>{node.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="investigation-map__patterns">
            <div className="investigation-map__column-heading">
              <h3>Pola yang saling menguatkan</h3>
              <span>{sharedNodes.length} ditemukan</span>
            </div>
            {sharedNodes.length ? (
              <ol aria-label="Pola dan domain berulang">
                {sharedNodes.map((node, index) => {
                  const sources = (node.sourceIds ?? [])
                    .map((sourceId) => sourceById.get(sourceId))
                    .filter((source): source is EvidenceNode => Boolean(source));

                  return (
                    <li key={node.id}>
                      <div className="investigation-map__pattern-topline">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{node.count}/{sourceNodes.length} artefak</strong>
                      </div>
                      <h4>{node.label}</h4>
                      <p>{node.detail}</p>
                      <div className="investigation-map__source-links">
                        <span>Terlihat pada</span>
                        <ul aria-label={`Sumber untuk ${node.label}`}>
                          {sources.map((source) => (
                            <li key={source.id}>
                              <a href={`#map-${source.id}`}>{source.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="investigation-map__empty">
                <h4>Belum ada pola yang berulang.</h4>
                <p>
                  Artefak tetap bisa diperiksa satu per satu. Tambahkan sumber
                  berbeda untuk membandingkan pola, domain, atau permintaan yang
                  sama.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="investigation-map__caption">
          Peta dibaca dari artefak ke pola bersama, lalu kembali ke sumber yang
          mendukungnya. Tidak ada koneksi yang dibuat hanya dari skor yang mirip.
        </p>
      </div>
    </section>
  );
}
