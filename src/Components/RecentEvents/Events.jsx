"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "./EventCards";
import { FadeUp, ScaleIn } from "../../utils/motion";
import { supabase } from "@/lib/supabaseClient";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const Events = () => {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  // Fetch recent events from Supabase
  const loadEvents = async () => {
    const { data, error } = await supabase
      .from("recent_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <section className="py-20 bg-primary text-white" id="events">
      <div className="container mx-auto px-6">

        <FadeUp delay={0.2}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">Recent Events</h2>
            <p className="mt-4 opacity-80">
              Stay updated with the vibrant life at Mayoor. <br />
              Here are some of our recent highlights and achievements.
            </p>
          </div>
        </FadeUp>

        <ScaleIn delay={0.2}>
          <Swiper className="events-slider mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-black"
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 2500 }}
            pagination={{ clickable: true }}
            loop={true}
            spaceBetween={20}
            breakpoints={{
              300: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {events.map((ev) => (
              <SwiperSlide key={ev.id}>
                <EventCard
                  image={ev.image}
                  title={ev.title}
                  desc={ev.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {events.length === 0 && (
            <p className="text-white opacity-80 text-center mt-10">
              No events uploaded yet.
            </p>
          )}

        </ScaleIn>

        {/* Our Gallery Button */}
        <FadeUp delay={0.4}>
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => router.push('/gallery')}
              className="bg-white text-primary font-semibold py-3 px-8 rounded-full shadow-md hover:scale-105 transition-transform duration-300 flex items-center gap-2"
            >
              Our Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </FadeUp>

      </div>
    </section>
  );
};

export default Events;
