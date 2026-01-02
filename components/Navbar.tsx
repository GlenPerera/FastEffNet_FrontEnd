import Link from "next/link"

export default function NavBar(){
    return (
        <nav className="bg-white w-full border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/*Left Side: Logo & Brand Name*/ }
                    <Link href="/" className="flex items-center gap-2 group">
                        {/* Custom Medical Heart Icon */}
                        <svg
                        className="w-8 h-8 text-[#3B8FAB]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        <path
                            d="M12 7v6M9 10h6" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                        />
                        </svg>

                        <span className="font-bold text-xl text-[#3B8FAB] tracking-tight group-hover:opacity-80 transition-opacity">
                        FastEffNet-NPDR
                        </span>
                    </Link>


                    {/* Right Side: login Button */}
                    <div>
                        <Link href="/login" className="bg-[#3B8FAB] text-white px-6 py-2.5 rounded-md font-medium shadow-sm hover:bg-[#2d7086] hover:shadow-md transition-all duration-200">
                        Login Here</Link>
                    </div>
                </div>
            </div>
        </nav>

    )
}