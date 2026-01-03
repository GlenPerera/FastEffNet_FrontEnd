import Image from "next/image";

interface DoctorProps {
  name: string;
  role: string;
  experience: string;
  tag: string;
  tagColor: string; // e.g., "bg-cyan-100 text-cyan-700"
  imageSrc?: string;
}

export default function DoctorCard({ name, role, experience, tag, tagColor, imageSrc }: DoctorProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4 mb-5">
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
           {/* Placeholder Image */}
           <Image 
             src={imageSrc || "/images/avatar1.png"} // Fallback image 
             alt={name} 
             width={56} 
             height={56} 
             className="object-cover w-full h-full"
           />
        </div>

        {/* Info */}
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{name}</h3>
          <p className="text-xs text-gray-500 mb-2 mt-0.5">{role} | {experience}</p>
          
          {/* Tag / Badge */}
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${tagColor}`}>
            {tag}
          </span>
        </div>
      </div>

      {/* Button */}
      <button className="w-full bg-[#3B8FAB] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d7086] transition-colors shadow-sm">
        Book an appointment
      </button>
    </div>
  );
}