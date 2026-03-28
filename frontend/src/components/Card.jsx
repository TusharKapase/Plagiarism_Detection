export default function Card({ title, children }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div>{children}</div>
      </div>
    );
  }
  