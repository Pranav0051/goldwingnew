export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0B0F19] flex items-center justify-center">
      <img
        src="/images/logo.png"
        alt="Goldwing Logo"
        className="w-48 animate-pulse text-white transition-opacity duration-1000"
      />
    </div>
  );
}
