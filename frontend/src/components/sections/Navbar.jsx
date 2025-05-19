import { useState } from "react";

export default function Navbar() {
    const [showNavbar] = useState(true);
    return(
        <>
      <nav
        className={`fixed pb-4 md:pb-0 top-0 w-full min-h-[10%] z-50 bg-[#24222B]/35 backdrop-blur-sm transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}>
            <div className="flex items-center justify-between md:justify-center px-4 lg:px-24 py-2 lg:py-4">
                <ul className="contents md:flex items-center gap-5 afacad-bold text-base text-[#CDA053]">
                    <li className="hidden md:block">Alo</li>
                </ul>
            </div>
          </nav>
        </>
        )
}