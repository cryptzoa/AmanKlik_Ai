import type { EvidenceNode, InvestigationGraph } from "@/types/investigation";

const kindLabels: Record<EvidenceNode["kind"], string> = {
  case: "Perbandingan",
  scan: "Hasil",
  signal: "Pola berulang",
  domain: "Alamat utama berulang",
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
            Hanya pola atau alamat utama yang muncul pada sedikitnya dua hasil berbeda
            yang ditampilkan. Kesamaan membantu pemeriksaan, tetapi tidak
            membuktikan siapa pengirimnya atau memastikan adanya penipuan.
          </p>
        </div>

        <div className="investigation-map__legend" aria-label="Legenda peta">
          <span><i data-kind="artifact" aria-hidden="true" /> Hasil berbeda</span>
          <span><i data-kind="pattern" aria-hidden="true" /> Pola bersama</span>
        </div>

        <div className="investigation-map__canvas">
          <div className="investigation-map__sources">
            <div className="investigation-map__column-heading">
              <h3>Hasil yang dibandingkan</h3>
              <span>{sourceNodes.length} hasil</span>
            </div>
            <ol aria-label="Hasil pemeriksaan yang dibandingkan">
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
              <ol aria-label="Pola dan alamat utama yang berulang">
                {sharedNodes.map((node, index) => {
                  const sources = (node.sourceIds ?? [])
                    .map((sourceId) => sourceById.get(sourceId))
                    .filter((source): source is EvidenceNode => Boolean(source));

                  return (
                    <li key={node.id}>
                      <div className="investigation-map__pattern-topline">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{node.count}/{sourceNodes.length} hasil</strong>
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
                  Setiap hasil tetap bisa dibuka satu per satu. Tambahkan hasil
                  berbeda untuk melihat apakah pola, alamat utama, atau permintaan
                  yang sama muncul kembali.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="investigation-map__caption">
          Peta menghubungkan setiap hasil dengan pola yang muncul berulang.
          Hasil tidak dianggap terkait hanya karena skornya mirip.
        </p>
      </div>
    </section>
  );
}
