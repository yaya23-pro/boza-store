export default function ConfirmationActions() {
  return (
    <>
      <div className="flex gap-3 mb-5 max-[640px]:flex-col">
        <a href="#" className="flex-1 py-4 border border-boza-black bg-boza-black text-boza-cream font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 no-underline inline-block text-center hover:bg-boza-brown hover:border-boza-brown">
          Suivre ma commande
        </a>
        <a href="/catalogue" className="flex-1 py-4 border border-boza-black bg-boza-cream text-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 no-underline inline-block text-center hover:bg-boza-cream-alt">
          Continuer mes achats
        </a>
      </div>

      <p className="text-[13px] text-boza-taupe">Un e-mail de confirmation a été envoyé à ton adresse.</p>
    </>
  );
}