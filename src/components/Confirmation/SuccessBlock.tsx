type SuccessBlockProps = {
  orderNumber: string;
};

export default function SuccessBlock({ orderNumber }: SuccessBlockProps) {
  return (
    <>
      <div className="w-20 h-20 bg-boza-black text-boza-cream rounded-full flex items-center justify-center text-[32px] mx-auto mb-6">
        <i className="fas fa-check"></i>
      </div>

      <h1 className="font-display text-[30px] font-black mb-3">Merci, commande confirmée !</h1>
      <p className="text-boza-taupe text-[15px] mb-[30px] leading-relaxed">
        Votre commande a bien été reçue et est en cours de préparation.<br />
        Vous recevrez un e-mail de confirmation avec tous les détails.
      </p>

      <div className="inline-block bg-boza-cream-alt py-3 px-6 mb-10">
        <div className="text-xs text-boza-taupe uppercase tracking-wide">Numéro de commande</div>
        <div className="font-display text-lg font-black text-boza-black">{orderNumber}</div>
      </div>
    </>
  );
}