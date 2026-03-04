export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0B0F19] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#F4B400] rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-black uppercase tracking-widest">Loading Adventure...</p>
      </div>
    </div>
  );
}
