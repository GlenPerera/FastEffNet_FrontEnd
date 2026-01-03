export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      {/* Title */}
      <div className="mb-8">
        <p className="text-gray-500 text-sm mb-1">Hi, Dr. Amal</p>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to the Classifying Phase</h1>
      </div>

      {/* Upload Section */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">Upload your Retinal Fundus Image</h2>
      
      <div className="w-full h-80 border border-gray-400 rounded-xl flex flex-col items-center justify-center bg-white">
          {/* Cloud Icon */}
          <div className="mb-4">
            <svg className="w-16 h-16 text-[#3B8FAB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          
          <p className="text-gray-600 mb-6">Select your file or drag and drop</p>
          
          <button className="bg-[#3B8FAB] text-white px-12 py-2 rounded-md font-medium hover:bg-[#2d7086] transition-colors shadow-sm">
            Upload
          </button>
      </div>

      {/* Result Section */}
      <div className="mt-8 border border-gray-200 rounded-xl p-6 shadow-sm">
         <h3 className="text-xl font-bold text-[#4B5563] mb-4">Result:</h3>
         <div className="flex justify-center items-center py-6">
            <span className="text-2xl font-bold text-[#4B5563]">1- Moderate NPDR</span>
         </div>
      </div>
    </div>
  );
}