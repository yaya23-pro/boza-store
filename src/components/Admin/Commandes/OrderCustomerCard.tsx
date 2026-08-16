type OrderCustomerCardProps = {
  nom: string;
  email: string;
  telephone: string;
};

export default function OrderCustomerCard({ nom, email, telephone }: OrderCustomerCardProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <h2 className="font-display text-lg font-black mb-5">Client</h2>

      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
          <i className="fas fa-user"></i>
        </div>
        <div>
          <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Nom</div>
          <div className="text-[13px] text-boza-black font-medium">{nom}</div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
          <i className="fas fa-envelope"></i>
        </div>
        <div>
          <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">E-mail</div>
          <div className="text-[13px] text-boza-black font-medium">{email}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
          <i className="fas fa-phone"></i>
        </div>
        <div>
          <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Téléphone</div>
          <div className="text-[13px] text-boza-black font-medium">{telephone}</div>
        </div>
      </div>
    </div>
  );
}