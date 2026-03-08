import React from "react";
import Image from "next/image";

const FacilityCard = ({ image, title, desc }) => {
  return (
    <div className="bg-card-light rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
      <div className="relative w-full h-56">
        <Image
          alt={title}
          className="scale-105 md:scale-100 object-cover"
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-text-light-secondary">{desc}</p>
      </div>
    </div>
  );
};

export default FacilityCard;
