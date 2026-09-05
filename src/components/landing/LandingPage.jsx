import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowDown, ArrowLeft, Binary, BookOpen, Box, Eye, FlaskConical, ListChecks, MousePointerClick, Play, ScanSearch, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { socialLinks } from "../../data/socialsMedia";
import { ALGORITHM_CATEGORIES } from "../../data/algorithms";

const arrayValues = [10, 15, 21, 35, 42, 58, 70, 91];

const features = [
  { icon: BookOpen, title: "شرح مبسط", detail: "شرح الخوارزميات باللغة العربية بطريقة مناسبة للطلاب.", color: "text-accent-blue" },
  { icon: ScanSearch, title: "تصور تفاعلي", detail: "شاهد الخوارزمية وهي تنفذ خطوة بخطوة.", color: "text-accent-yellow" },
  { icon: SlidersHorizontal, title: "جرّب بنفسك", detail: "غيّر البيانات وتحكم في عملية التنفيذ.", color: "text-accent-green" },
  { icon: Box, title: "تصور ثلاثي الأبعاد", detail: "شاهد الخوارزميات بطريقة بصرية ثلاثية الأبعاد.", color: "text-accent-purple" },
];

const howItWorksSteps = [
  { icon: ListChecks, title: "اختر الخوارزمية", detail: "تصفّح قائمة الخوارزميات المصنّفة واختر ما تريد تعلّمه.", color: "text-accent-blue" },
  { icon: Eye, title: "شاهد طريقة عملها", detail: "تابع التنفيذ خطوة بخطوة عبر تصور بصري وشرح مبسط.", color: "text-accent-yellow" },
  { icon: MousePointerClick, title: "جرّبها بنفسك", detail: "غيّر البيانات وتحكم في السرعة لتختبر فهمك بنفسك.", color: "text-accent-green" },
];

const learningFlow = ["اختيار", "فهم", "مشاهدة", "تجربة"];

const previewAlgorithmIds = new Set([
  "bubble-sort", "selection-sort", "insertion-sort", "quick-sort", "merge-sort",
  "linear-search", "binary-search", "ternary-search",
]);

const previewCategories = ALGORITHM_CATEGORIES
  .map((category) => ({ ...category, algorithms: category.algorithms.filter((algorithm) => previewAlgorithmIds.has(algorithm.id)) }))
  .filter((category) => category.algorithms.length > 0);


function AlgorithmPreview() {
  return (
    <div className="relative w-full max-w-xl border border-border bg-bg-panel shadow-2xl shadow-black/20" aria-label="معاينة تفاعلية للخوارزميات">
      <div className="flex h-9 items-center gap-2 border-b border-border-subtle bg-bg-inset px-3" dir="ltr">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-yellow/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green/80" />
        <span className="ms-2 font-mono text-[10px] text-text-muted">binary_search.py</span>
      </div>
      <div className="grid grid-cols-[42px_1fr] gap-3 p-5 font-mono text-[11px] leading-7" dir="ltr">
        <div className="select-none text-right text-text-muted">01<br />02<br />03<br />04<br />05<br />06<br />07</div>
        <div>
          <p><span className="text-accent-purple">def</span> <span className="text-accent-yellow">binary_search</span>(array, target):</p>
          <p className="ps-4"><span className="text-accent-blue">left</span> = <span className="text-accent-orange">0</span></p>
          <p className="ps-4"><span className="text-accent-blue">middle</span> = <span className="text-accent-yellow">(left + right) // 2</span></p>
          <p className="border-s-2 border-accent-blue bg-accent-blue/10 ps-3"><span className="text-accent-purple">if</span> array[middle] == target:</p>
          <p className="ps-4 text-accent-green">return middle</p>
          <p><span className="text-accent-purple">return</span> <span className="text-accent-red">-1</span></p>
          <div className="mt-5 grid grid-cols-8 gap-1.5 border-t border-border-subtle pt-4">
            {arrayValues.map((value, index) => <span key={`${value}-${index}`} className={`flex aspect-square items-center justify-center border text-[10px] ${index === 4 ? "border-accent-yellow bg-accent-yellow/15 text-accent-yellow" : "border-border-subtle bg-bg-elevated text-text-secondary"}`}>{value}</span>)}
          </div>
          <div className="mt-2 flex justify-between px-1 text-[9px] text-text-muted"><span>left</span><span className="text-accent-yellow">middle</span><span>right</span></div>
        </div>
      </div>
      <div className="absolute -bottom-4 -start-4 flex items-center gap-2 border border-accent-green/40 bg-bg-inset px-3 py-2 text-[10px] text-accent-green shadow-lg"><ScanSearch className="h-3.5 w-3.5" /> نطاق البحث يتقلص مع كل مقارنة</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, detail, color }) {
  return (
    <article className="border border-border-subtle bg-bg-panel p-5 transition-colors hover:border-border hover:bg-bg-elevated">
      <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
      <h3 className="mt-4 text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-xs leading-6 text-text-secondary">{detail}</p>
    </article>
  );
}


function HowItWorksStep({ icon: Icon, title, detail, index }) {
  return (
    <div className="relative border border-border-subtle bg-bg-panel p-5">
      <span className="font-mono text-[10px] text-text-muted">{`0${index + 1}`}</span>
      <Icon className="mt-3 h-5 w-5 text-accent-blue" strokeWidth={1.8} />
      <h3 className="mt-4 text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-xs leading-6 text-text-secondary">{detail}</p>
    </div>
  );
}

function LearningFlow({ steps }) {
  return (
    <div className="flex flex-col items-center gap-2 border border-border-subtle bg-bg-inset px-6 py-5 font-mono text-xs text-text-secondary">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <span className={index === steps.length - 1 ? "text-accent-green" : "text-text-primary"}>{step}</span>
          {index < steps.length - 1 && <ArrowDown className="h-3.5 w-3.5 text-text-muted" />}
        </div>
      ))}
    </div>
  );
}

function AlgorithmPreviewCard({ name, englishName, description, onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="flex w-full flex-col items-start border border-border-subtle bg-bg-panel p-4 text-right transition-colors hover:border-border hover:bg-bg-elevated">
      <span className="text-sm font-semibold text-text-primary">{name}</span>
      <span className="font-mono text-[10px] text-text-muted">{englishName}</span>
      <p className="mt-2 text-xs leading-6 text-text-secondary">{description}</p>
    </button>
  );
}

  function LearningSignal({ icon: Icon, title, detail, color }) {
  return (
    <div className="flex items-start gap-3 border-s border-border-subtle ps-4">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} strokeWidth={1.8} />
      <div>
        <p className="text-xs text-text-primary">{title}</p>
        <p className="mt-1 text-[11px] leading-5 text-text-muted">{detail}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const onStart = () => navigate("/app");

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-bg-app text-text-primary" dir="rtl">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-10 py-16">
        <section className="grid min-h-[calc(100vh-220px)] items-center gap-20 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="landing-title">
          <div className="order-2 lg:order-1">
            <div className="mb-5 flex items-center gap-2 font-mono text-[11px] text-accent-green"><span className="h-1.5 w-1.5 bg-accent-green" /> بيئة تعلم جزائرية للبرمجة</div>
            <h1 id="landing-title" className="font-mono text-5xl font-semibold tracking-tight text-text-primary">DSAlgeria</h1>
            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight text-text-primary">تعلم الخوارزميات بطريقة تفاعلية</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary">منصة تعليمية تساعدك على فهم الخوارزميات من خلال الشرح، المحاكاة، والتجربة.</p>
            <button type="button" onClick={onStart} className="mt-9 inline-flex h-11 items-center gap-3 bg-accent-blue px-5 text-sm font-semibold text-bg-inset transition-colors hover:bg-accent-blue-bright focus-visible:outline-none"><Play className="h-4 w-4 fill-current" />ابدأ التعلم<ArrowLeft className="h-4 w-4" /></button>
            <div className="mt-14 grid max-w-xl grid-cols-3 gap-6">
              <LearningSignal icon={Binary} title="فهم" detail="خطوات واضحة" color="text-accent-blue" />
              <LearningSignal icon={ScanSearch} title="محاكاة" detail="تتبع كل مقارنة" color="text-accent-yellow" />
              <LearningSignal icon={FlaskConical} title="تجربة" detail="اختبر أفكارك" color="text-accent-purple" />
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2"><AlgorithmPreview /></div>
        </section>

        <section className="mt-20 border-t border-border-subtle pt-10" aria-labelledby="why-heading">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] text-accent-blue">// learning_environment</p>
              <h2 id="why-heading" className="mt-2 text-2xl font-semibold text-text-primary">لماذا DSAlgeria؟</h2>
            </div>
            <p className="max-w-sm text-left text-xs leading-6 text-text-muted">أدوات بسيطة تساعدك على الانتقال من حفظ الخطوات إلى فهم طريقة التفكير.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
          </div>
        </section>

        <section className="mt-20 border-t border-border-subtle pt-10" aria-labelledby="how-heading">
          <p className="font-mono text-[10px] text-accent-blue">// student_flow</p>
          <h2 id="how-heading" className="mt-2 text-2xl font-semibold text-text-primary">كيف يعمل DSAlgeria؟</h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="grid gap-3 sm:grid-cols-3">
              {howItWorksSteps.map((step, index) => <HowItWorksStep key={step.title} index={index} {...step} />)}
            </div>
            <div className="flex justify-center lg:justify-start">
              <LearningFlow steps={learningFlow} />
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-border-subtle pt-10" aria-labelledby="explore-heading">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] text-accent-blue">// algorithm_catalog</p>
              <h2 id="explore-heading" className="mt-2 text-2xl font-semibold text-text-primary">استكشف الخوارزميات</h2>
            </div>
            <button type="button" onClick={onStart} className="hidden shrink-0 items-center gap-2 border border-border-subtle px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-accent-blue hover:text-accent-blue sm:inline-flex">استكشف جميع الخوارزميات<ArrowLeft className="h-3.5 w-3.5" /></button>
          </div>
          <div className="space-y-10">
            {previewCategories.map((category) => (
              <div key={category.id}>
                <h3 className="mb-3 font-mono text-xs text-text-muted">{category.name}</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {category.algorithms.map((algorithm) => <AlgorithmPreviewCard key={algorithm.id} {...algorithm} onOpen={onStart} />)}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={onStart} className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-border-subtle py-3 text-xs font-semibold text-text-secondary transition-colors hover:border-accent-blue hover:text-accent-blue sm:hidden">استكشف جميع الخوارزميات<ArrowLeft className="h-3.5 w-3.5" /></button>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-7xl border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-10 py-8 sm:flex-row sm:justify-between">
          <p className="order-2 font-mono text-[13px] text-text-muted">{new Date().getFullYear()} DSAlgeria</p>
          <div className="order-1 sm:order-2 flex items-center gap-2">
            {socialLinks.map(({ name, Icon, url }) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} title={name} className="flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle bg-bg-inset text-text-muted transition-colors hover:bg-bg-hover hover:text-accent-blue">
                <FontAwesomeIcon icon={Icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <p className="order-3 font-mono text-[13px] text-text-muted">By <a href="https://github.com/BenzidaneMo" target="_blank" rel="noreferrer" className="font-mono text-[13px] hover:text-accent-blue hover:underline">BenzidaneMo</a></p>
        </div>
      </footer>
    </div>
  );
}
