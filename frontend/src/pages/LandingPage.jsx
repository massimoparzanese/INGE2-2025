export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 bg-red-500">
      <h1 className="text-4xl font-bold text-black mb-4">Welcome to Our Landing Page</h1>
      <p className="text-lg mb-8">This is a simple landing page built with React and Tailwind CSS.</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Get Started
      </button>
    </div>
  );
}