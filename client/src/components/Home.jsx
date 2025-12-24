import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          COLLEGE CONNECT
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          The Ultimate Ecosystem for Engineering Students. <br/>
          <span className="text-green-400 font-semibold">Learn. Build. Connect.</span>
        </p>

        <div className="flex gap-6 justify-center">
          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-green-500/30">
              Login 🚀
            </button>
          </Link>
          
          <Link to="/register">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105 border border-gray-600">
              Register 📝
            </button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-gray-500 text-sm">
        Built with ❤️ by Abhay Nishad
      </div>
    </div>
  );
}