import Card from "../components/Card";

export default function Results() {
  const report = {
    filename: "sample.docx",
    score: 42,
    matches: [
      { source: "#", similarity: "%" },
      { source: "#", similarity: "%" },
      { source: "#", similarity: "%" },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Results</h1>
      <Card title="Summary">
        <p>
          <strong></strong> {report.filename}
        </p>
        <p>
          <strong></strong> {report.score}%
        </p>
      </Card>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {report.matches.map((m, i) => (
          <Card key={i} title={`Source ${i + 1}`}>
            <p>
              <strong></strong> {m.source}
            </p>
            <p>
              <strong></strong> {m.similarity}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
