import React from "react";
import Image from "next/image";

const EventCard = ({ image, title, desc }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden group">
      <div className="relative w-full h-48">
        <Image
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm mt-2 opacity-80">{desc}</p>
      </div>
    </div>
  );
};

export default EventCard;
