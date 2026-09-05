import { Binary, Braces, Home, Info, Menu, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutModal from "./AboutModal";

const mobileNavLinks = [
  { label: "الرئيسية", icon: Home, action: "home" },
  { label: "الخوارزميات", icon: Binary, action: "algorithms" },
  { label: "حول الموقع", icon: Info, action: "about" },
  { label: "ابدأ التعلم", icon: Play, action: "start" },
];

export default function Navbar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const onStart = () => navigate("/");

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen]);

  function handleMobileLink(action) {
    setIsMenuOpen(false);
    if (action === "home") navigate("/");
    else if (action === "algorithms" || action === "start") navigate("/app");
    else if (action === "about") setIsAboutOpen(true);
  }

  return (
    <>
      <header ref={headerRef} className="relative flex h-11 shrink-0 items-center justify-between border-b border-border bg-bg-inset px-4" role="banner">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onStart}>
          <Braces className="h-4 w-4 text-accent-blue" strokeWidth={2.25} />
          <span className="font-mono text-sm font-semibold text-text-primary">DSAlgeria</span>
        </div>

        <button
          type="button"
          onClick={() => setIsAboutOpen(true)}
          className="hidden h-7 items-center gap-1.5 border border-border-subtle px-2.5 text-xs text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary sm:flex"
          aria-label="حول الموقع"
        >
          <Info className="h-3.5 w-3.5" strokeWidth={2} />
          <span>حول الموقع</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-7 w-7 items-center justify-center border border-border-subtle text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary sm:hidden"
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <nav
          id="mobile-nav-menu"
          aria-label="القائمة الرئيسية"
          className={`absolute inset-x-0 top-11 z-40 overflow-hidden border-b border-border bg-bg-panel shadow-lg transition-[max-height,opacity] duration-200 ease-out sm:hidden ${isMenuOpen ? "max-h-64 opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
        >
          <ul className="divide-y divide-border-subtle">
            {mobileNavLinks.map(({ label, icon: Icon, action }) => (
              <li key={action}>
                <button
                  type="button"
                  onClick={() => handleMobileLink(action)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-right text-sm text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
                >
                  <Icon className="h-4 w-4 shrink-0 text-accent-blue" strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
    </>
  );
}
