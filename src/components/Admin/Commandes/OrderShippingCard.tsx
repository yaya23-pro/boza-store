type OrderShippingCardProps = {
  ligne1: string;
  ligne2: string;
};

export default function OrderShippingCard({ ligne1, ligne2 }: OrderShippingCardProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <h2 className="font-display text-lg font-black mb-5">Livraison</h2>
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <div>
          <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Adresse</div>
          <div className="text-[13px] text-boza-black font-medium leading-relaxed">
            {ligne1}
            <br />
            {ligne2}
          </div>
        </div>
      </div>
    </div>
  );
}