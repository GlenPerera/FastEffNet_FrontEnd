import Image from "next/image";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import Link from "next/link";
import StageCard from "@/components/StageCard";
import DoctorCard from "@/components/DoctorCard";


//Data for Stages
const stages = [
  { title: "Normal", img: "/images/no_dr.png" },
  { title: "Mild NPDR", img: "/images/mild.png" },
  { title: "Moderate NPDR", img: "/images/moderate.png" },
  { title: "Severe NPDR", img: "/images/severe.png" },
];

// --- Data for Specialists ---
const specialists = [
  { 
    name: "Amanda Clara", 
    role: "specialist", 
    exp: "12 years experience", 
    tag: "Pediatric", 
    color: "bg-cyan-50 text-cyan-600",
    img: "/images/doctor1.png"
  },
  { 
    name: "Jason Shatsky", 
    role: "specialist", 
    exp: "10 years experience", 
    tag: "Surgical", 
    color: "bg-blue-50 text-blue-600",
    img: "/images/doctor2.png"
  },
  { 
    name: "Jessie Dux", 
    role: "specialist", 
    exp: "7 years experience", 
    tag: "Gastroenterology", 
    color: "bg-teal-50 text-teal-600",
    img: "/images/doctor3.png"
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
      <Hero/>

      {/* 2. Placeholders for the rest of the page content */}
      <div className="text-left">
        <h2 className="text-2xl font-bold">What is Fine-Grained Non-Proliferative Diabetic Retinopathy?</h2>
        <p className="text-gray-600 text-left">It’s the early stage of the disease, where damage to the retina ’ s tiny blood vessels is new and fine-grained and abnormal blood vessels have not yet started to grow is known as fine-grained Non-Proliferative Diabetic Retinopathy.</p>
      </div>

      <div>
        <Button variant="primary" size="sm" radius="md">Proceed to Classify</Button>
      </div>

      


      {/* --- STAGES SECTION --- */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
          Stages of Early Non-Proliferative Diabetic Retinopathy
        </h2>
        
        {/* Responsive Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stages.map((stage, index) => (
            <StageCard 
              key={index} 
              title={stage.title} 
              imageSrc={stage.img} 
            />
          ))}
        </div>
      </section>

      {/* --- SPECIALISTS SECTION --- */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Available Specialists</h2>
          <Link href="#" className="text-[#3B8FAB] text-sm font-bold hover:underline mb-1">
            View All &gt;
          </Link>
        </div>
        
        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map((doc, index) => (
            <DoctorCard 
              key={index}
              name={doc.name}
              role={doc.role}
              experience={doc.exp}
              tag={doc.tag}
              tagColor={doc.color}
              imageSrc={doc.img}
            />
          ))}
        </div>
      </section>

      {/* --- OPHTHALMOLOGISTS SECTION (Reusing the same component) --- */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Available Ophthalmologists</h2>
          <Link href="#" className="text-[#3B8FAB] text-sm font-bold hover:underline mb-1">
            View All &gt;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Using the same data for demo purposes, you can create a separate array */}
          {specialists.map((doc, index) => (
            <DoctorCard 
              key={index}
              name={doc.name}
              role={doc.role}
              experience={doc.exp}
              tag={doc.tag}
              tagColor={doc.color}
              imageSrc={doc.img}
            />
          ))}
        </div>
      </section>


    
    </div>
  );
}
