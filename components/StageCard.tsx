import Image from "next/image";

interface StageCardProps {
  title: string;
  imageSrc: string;
}

export default function StageCard({ title, imageSrc }: StageCardProps) {
  return (
    // Removed "group" and "cursor-pointer" since you want it still
    <div className="flex flex-col items-center">
      
      {/* Image Container 
         - Removed: shadow hover effects and transitions 
         - Added: bg-black (Retina images look best on black backgrounds if they don't fill the space)
      */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-black">
        
        <Image 
          src={imageSrc} 
          alt={title} 
          fill // Auto-fills the container size
          sizes="(max-width: 768px) 50vw, 25vw" // Optimization for performance
          className="object-contain" // ensures the FULL image is seen (no cropping)
        /> 
        
      </div>
      
      {/* Title - Removed hover color changes */}
      <h3 className="mt-4 font-serif text-lg text-gray-900 font-medium">
        {title}
      </h3>
    </div>
  );
}