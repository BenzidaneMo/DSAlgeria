import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import { socialLinks } from "../../data/socialsMedia";


export default function AboutModal({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99] flex items-start justify-center bg-black/50 px-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="about-heading" className="w-full max-w-md border rounded-lg mt-28 border-border bg-bg-panel shadow-2xl outline-none">
        <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 id="about-heading" className="text-sm font-semibold text-text-primary">حول DSAlgeria</h2>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary" aria-label="إغلاق النافذة">
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-4 py-5 text-xs leading-6 text-text-secondary">
          <div>
            <h3 className="mb-1 font-semibold text-text-primary">ما هو DSAlgeria؟</h3>
            <p>
              منصة تعليمية تفاعلية تهدف إلى مساعدة الطلاب على فهم الخوارزميات
              وهياكل البيانات بطريقة بصرية وعملية.
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-text-primary">من أنشأه؟</h3>
            <p>
              تم تطوير DSAlgeria بواسطة محمد بن زيدان، مطور ويب مهتم بتطوير
              البرمجيات وتقنيات الذكاء الاصطناعي.
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-text-primary">لماذا أُنشئ؟</h3>
            <p>
              أُنشئ المشروع لتسهيل دراسة الخوارزميات من خلال تحويل المفاهيم
              النظرية إلى خطوات تفاعلية ورسوم مرئية تساعد على الفهم والتعلّم.
            </p>
          </div>
        </div>
        <footer className="flex w-fit gap-2 mx-auto border-t border-border-subtle px-4 py-3">
          {socialLinks.map(({ name, Icon, url }) => (
            <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} title={name} className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-inset border border-border-subtle text-text-muted hover:bg-bg-hover hover:text-accent-blue">
              <FontAwesomeIcon icon={Icon} className="h-3.5 w-3.5" />
            </a>
          ))}
        </footer>
      </section>
    </div>
  );
}