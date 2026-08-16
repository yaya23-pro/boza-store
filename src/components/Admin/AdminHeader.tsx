export default function AdminHeader() {
  return (
    <header className="bg-boza-cream border-b border-boza-cream-alt sticky top-0 z-[1000]">
      <nav className="py-2.5">
        <div className="container mx-auto flex items-center justify-between px-6">
          <a href="/admin/dashboard" className="font-display text-2xl font-black text-boza-black no-underline">
            BOZA <span className="text-sm font-body font-semibold text-boza-taupe tracking-normal">Admin</span>
          </a>
          <div className="flex items-center gap-2.5">
            <button aria-label="Notifications" className="relative p-[5px] text-boza-black">
              <i className="far fa-bell"></i>
              <span className="absolute -top-1 -right-1.5 min-w-[20px] h-5 flex items-center justify-center text-[11px] font-semibold text-boza-brown px-1.5">
                2
              </span>
            </button>
            <a href="/" aria-label="Voir le site" className="p-[5px] text-boza-black inline-block">
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}