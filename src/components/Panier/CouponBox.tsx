export default function CouponBox() {
  return (
    <div className="bg-boza-cream-alt border border-dashed border-boza-brown p-[15px] mb-[15px]">
      <div className="text-[15px] font-semibold text-boza-black mb-4 flex items-center gap-2">
        <i className="fas fa-tag"></i>
        <span>Vous avez un code promo ?</span>
      </div>
      <div className="flex gap-2.5">
        <input type="text" placeholder="Entrez votre code promo" className="flex-1 py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm font-body placeholder:text-boza-taupe" />
        <button className="py-3.5 px-7 bg-boza-black text-boza-cream border border-boza-black font-semibold cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown">
          Appliquer
        </button>
      </div>
    </div>
  );
}