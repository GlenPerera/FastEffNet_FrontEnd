import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full pt-10 px-4 md:px-0">
      <div className="bg-[#6A94A0] rounded-3xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[380px]">
        
        {/* Left Content */}
        <div className="z-10 p-8 md:p-12 md:w-2/3 text-white">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Check your Retinal Fundus Image before going to 
            <span className="block mt-2">Proliferative Stage</span>
          </h1>
          
          <p className="mb-8 text-sm md:text-base font-medium tracking-wide uppercase opacity-90">
            SAVE YOUR AND YOUR PATIENTS TIME!!!!
          </p>

          {/* Avatar Group */}
          <div className="flex -space-x-3">
             {/* Replace these generic divs with actual <Image /> tags when you have user icons */}
            <div className="w-10 h-10 rounded-full border-2 border-[#6A94A0] bg-gray-200 overflow-hidden">
               <Image src="/images/avatar_1.png" alt="User" width={40} height={40} className="object-cover" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#6A94A0] bg-gray-300 overflow-hidden">
               <Image src="/images/avatar_2.png" alt="User" width={40} height={40} className="object-cover" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#6A94A0] bg-gray-400 overflow-hidden">
               <Image src="/images/avatar_3.png" alt="User" width={40} height={40} className="object-cover" />
            </div>
          </div>
        </div>

        {/* Right Image (Doctors) */}
        <div className="relative w-full md:w-1/2 h-64 md:h-full flex items-end justify-end">
           <div className="relative w-full h-full mt-4">
             <Image 
               src="/images/hero_doctor.png" 
               alt="hero_doctor" 
               width={500}
               height={300}
               className="object-contain object-bottom md:object-right-bottom"
               priority
             />
           </div>
        </div>

        {/* Decorative Background Pattern (Optional subtle waves) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>

      </div>
    </section>
  );
}