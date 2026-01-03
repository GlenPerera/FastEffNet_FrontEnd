import Image from "next/image";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
      <Hero/>

      {/* 2. Placeholders for the rest of the page content */}
      <div className="text-left">
        <h2 className="text-2xl font-bold">What is Fine-Grained Non-Proliferative Diabetic Retinopathy?</h2>
        <p className="mt-4 text-gray-600 text-left">It’s the early stage of the disease, where damage to the retina ’ s tiny blood vessels is new and fine-grained and abnormal blood vessels have not yet started to grow is known as fine-grained Non-Proliferative Diabetic Retinopathy.</p>
      </div>


    
    </div>
  );
}
