import Image from "next/image";

const CurriculumCard = ({ image, title, desc }) => {
  return (
    <div className="group relative flex flex-col items-center swoosh-container">
      <div className="relative mb-4 z-10 w-40 h-40">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 160px, 160px"
          className="object-cover rounded-full border-4 border-amber-300 shadow-lg transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <h3 className="text-xl font-bold text-center text-text-light-primary">{title}</h3>

      <p className="text-center mt-2 text-sm text-text-light-secondary">{desc}</p>
    </div>
  );
};

export default CurriculumCard;
