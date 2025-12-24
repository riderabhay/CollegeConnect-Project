export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
        {/* Inner Dot */}
        <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-xs text-cyan-400 font-bold animate-pulse">⚡</span>
        </div>
      </div>
    </div>
  );
}