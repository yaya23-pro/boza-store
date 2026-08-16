// components/User/Account/DangerZone.tsx
interface DangerZoneProps {
  onDeleteAccount: () => void;
}

export default function DangerZone({ onDeleteAccount }: DangerZoneProps) {
  return (
    <div className="bg-boza-cream border border-boza-brown p-7 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black text-boza-brown">Zone sensible</h2>
      </div>

      <p className="text-[13px] text-boza-taupe mb-4">
        Supprimer ton compte effacera définitivement tes informations, ton historique de commandes et tes favoris.
        Cette action est irréversible.
      </p>

      <button
        onClick={onDeleteAccount}
        className="px-6 py-3 bg-transparent text-boza-brown border border-boza-brown text-[13px] font-bold transition hover:bg-boza-brown hover:text-boza-cream"
      >
        Supprimer mon compte
      </button>
    </div>
  );
}