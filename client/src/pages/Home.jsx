import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const options = [
    { label: "Doctor", value: "doctor" },
    { label: "Patient", value: "patient" },
    { label: "Pathlab", value: "pathlab" },
    { label: "Pharmacy", value: "pharmacy" },
  ];

  const images = [
    { src: "/images/ai-doctor.jpg", alt: "AI Doctor", className: "col-span-1 row-span-2 h-[230px] md:h-[270px]", delay: "0.12s" },
    { src: "/images/medicine.jpg", alt: "Pills", className: "col-span-1 row-span-1 h-[105px] md:h-[130px]", delay: "0.24s" },
    { src: "/images/lab.jpg", alt: "Lab", className: "col-span-1 row-span-2 h-[150px] md:h-[195px]", delay: "0.36s" },
    { src: "/images/surgery.jpg", alt: "Surgery", className: "col-span-1 row-span-1 h-[105px] md:h-[130px]", delay: "0.48s" }
  ];

  const handleOption = (val, label) => {
    setShowOptions(false);
    if (val === "patient") navigate("/patient/register");
    else if (val === "doctor") navigate("/doctor-registration");
    else if (val === "pathlab") navigate("/pathlab-registration");
    else if (val === "pharmacy") navigate("/pharmacy-registration");
    else alert(`Selected: ${label}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1c24] to-[#13232f] text-white px-4 sm:px-8 py-6 relative overflow-x-hidden">
      {/* Decorative Top SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-24 fill-[#0f1c24]">
          <path d="M0.00,49.98 C150.00,150.00 350.00,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
        </svg>
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center mb-10 z-10 relative">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="logo" className="h-12 animate-bounce" />
          <div className="text-3xl font-extrabold tracking-wide text-[#81D8D0]">CareMore</div>
        </div>
        <div className="space-x-6 md:space-x-8 text-base tracking-wide flex items-center">
          <Link to="/" className="hover:text-[#66C7C0] transition">HOME</Link>
          <Link to="/about" className="hover:text-[#66C7C0] transition">ABOUT</Link>
          <Link to="/faq" className="hover:text-[#66C7C0] transition">FAQ</Link>
          <Link to="/contact" className="hover:text-[#66C7C0] transition">CONTACT</Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative bg-[#172c38] px-6 py-12 rounded-3xl shadow-lg">
        <div className="relative flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-8">
            Seamless Digital <br />
            <span className="inline-block mt-2">
              <span className="bg-[#0f1c24] px-4 py-2 rounded-3xl inline-block shadow">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#81D8D0] via-[#48b8b0] to-[#1E3A5F] animate-gradient-x text-5xl">
                  Healthcare
                </span>
              </span>
            </span><br />
            at your fingertips
          </h1>

          <div className="relative w-fit mb-2 flex flex-col items-start gap-2">
            <button
              onClick={() => setShowOptions(v => !v)}
              className="bg-[#81D8D0] text-black font-semibold px-8 py-3 rounded-full shadow hover:scale-105 hover:bg-[#66C7C0] transition duration-200 focus:outline-none flex items-center z-20"
            >
              Get Started As <span className="ml-2 text-[#7bd3d5] animate-ping text-xl">●</span>
            </button>

            <div className={`w-[250px] md:w-[280px] rounded-2xl shadow-xl overflow-hidden bg-[#0f1c24] backdrop-blur text-white transition-all duration-700 ease-in-out ${showOptions ? "max-h-60 opacity-100 mt-2 pointer-events-auto" : "max-h-0 opacity-0 mt-0 pointer-events-none"} z-30`}>
              <ul className="flex flex-col">
                {options.map(opt => (
                  <li key={opt.value}>
                    <button
                      onClick={() => handleOption(opt.value, opt.label)}
                      className="w-full text-left px-8 py-4 text-lg font-semibold hover:bg-[#1b3847] hover:text-white transition"
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-lg md:text-xl text-white font-medium max-w-md sm:max-w-lg">
              Access doctors, pharmacy, and diagnostic services — all in one place.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-5 w-full max-w-[420px] mx-auto">
          {images.map((img) => (
            <div
              key={img.alt}
              className={`${img.className} flex animate-fadeup`}
              style={{ animationDelay: img.delay, animationFillMode: "both" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="rounded-2xl shadow-xl object-cover w-full h-full"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 2.4s ease-in-out infinite alternate;
        }
        @keyframes fadeup {
          0% { opacity: 0; transform: translateY(32px) scale(0.96);}
          80% { opacity: 0.7; }
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fadeup {
          animation: fadeup 1s cubic-bezier(.36,.7,.36,1.01) both;
        }
      `}</style>
    </div>
  );
};

export default Home;
