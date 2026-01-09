import Categories from "@/components/Categories";

const sampleItems = [
  { name: "Item 1", price: 1000 },
  { name: "Item 2", price: 2500 },
  { name: "Item 3", price: 1500 },
  { name: "Item 4", price: 3000 },
];

export default function VideoPage() {
  return (
    <main className="p-6">
      <Categories />

      <div className="mt-6">
        {/* Search bar */}
        <input 
          type="text"
          placeholder="Search in Video..."
          className="win95-button px-2 py-1 w-full max-w-md"
        />

        {/* Items grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {sampleItems.map((item) => (
            <div key={item.name} className="border border-border-dark p-2 bg-panel-light">
              <div className="font-bold text-blue">{item.name}</div>
              <div>${(item.price / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
