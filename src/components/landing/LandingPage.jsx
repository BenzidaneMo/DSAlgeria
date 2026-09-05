import { ArrowLeft, Binary, FlaskConical, Play, ScanSearch } from "lucide-react";
import Navbar from "../layout/Navbar";

const arrayValues = [10, 15, 21, 35, 42, 58, 70, 91];

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

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen w-full overflow-auto bg-bg-app text-text-primary" dir="rtl">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-44px)] w-full max-w-7xl flex-col justify-center px-10 py-16">
        <section className="grid items-center gap-20 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="landing-title">
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
      </main>
    </div>
  );
}
