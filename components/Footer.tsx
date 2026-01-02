export default function Footer(){
    return(
        <footer className="w-full bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">

                {/* Uppercase Tagline */}
        <p className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4">
          BUILT A BETTER WORLD WITHOUT NO DIABETIC RETINOPATHY FOR EVERYONE
        </p>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8 text-[15px]">
          Built under guidance of industry experts in Bio-informatics
        </p>

        {/* Contact Button */}
        <button className="bg-[#3B8FAB] text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-[#3B8FAB]/20 hover:bg-[#2d7086] transition-all duration-200 mb-12">
          Contact Admins
        </button>

        {/* Divider & Copyright */}
        <div className="w-full border-t border-gray-100 pt-8 flex justify-center">
          <p className="text-xs text-gray-500">
            © 2019 Lift Media, LLC
          </p>
        </div>


        </div>

        </footer>
    )
}