export default function ConfirmationHeader() {
  return (
    <header className="bg-boza-cream border-b border-boza-cream-alt py-[18px] px-10 flex items-center justify-between max-[640px]:px-5">
      <a href="/" className="font-display text-[26px] font-black text-boza-black no-underline tracking-[-0.5px]">
        BOZA
      </a>
      <a href="/panier" aria-label="Panier" className="bg-transparent border-0 cursor-pointer text-boza-black text-lg inline-block">
        <i className="fas fa-cart-shopping"></i>
      </a>
    </header>
  );
}