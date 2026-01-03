import Link from "next/link";
// import { UserButton } from "@clerk/nextjs"; // Uncomment when you add Clerk later

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-gray-100 flex flex-col justify-between p-6 fixed h-full bg-white z-10">
        <div>
          {/* Logo */}
          <div className="mb-10">
             <span className="text-[#3B8FAB] font-bold text-lg">FastEffNet-NPDR</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            
            {/* Active Link (Test) */}
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#3B8FAB] text-white rounded-lg transition-colors">
              {/* Icon for Test (Grid) */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <span className="font-medium text-sm">Test</span>
            </Link>

            {/* Inactive Link (Profile) */}
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="font-medium text-sm">Profile</span>
            </Link>

            {/* Inactive Link (Saved Images) */}
            <Link href="/dashboard/saved" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="font-medium text-sm">Saved Images</span>
            </Link>

             {/* Inactive Link (Help) */}
             <Link href="/dashboard/help" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="font-medium text-sm">Help</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div className="text-gray-500 hover:text-red-500 cursor-pointer flex items-center gap-3 px-4 py-3 transition-colors">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           <span className="font-medium text-sm">Logout</span>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-64 p-8 bg-white min-h-screen">
        {/* Top Header with User Profile */}
        <header className="flex justify-end items-center mb-10">
           {/* Replace this with <UserButton /> later */}
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div> 
              <span className="font-medium text-sm text-gray-700">Stevan Dux</span>
           </div>
        </header>

        {children}
      </main>
    </div>
  );
}