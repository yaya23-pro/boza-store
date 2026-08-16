// components/User/Address/AddressCard.tsx
export interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  fullName: string;
  phone: string;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({ address, fullName, phone, onSetDefault, onDelete }: AddressCardProps) {
  return (
    <div className={`relative bg-boza-cream border p-[22px] ${address.isDefault ? "border-boza-black" : "border-boza-cream-alt"}`}>
      {address.isDefault && (
        <span className="absolute -top-px -right-px bg-boza-black text-boza-cream text-[10px] font-bold uppercase tracking-wide py-1.5 px-3">
          Par défaut
        </span>
      )}

      <div className="text-xs text-boza-taupe uppercase tracking-wide mb-2.5">{address.type}</div>

      <div className="text-[15px] font-semibold text-boza-black mb-1.5">{fullName}</div>

      <div className="text-sm text-boza-black leading-relaxed mb-[18px]">
        {address.street}
        <br />
        {address.city}, {address.postalCode}
        <br />
        {address.country}
        {phone && (
          <>
            <br />
            {phone}
          </>
        )}
      </div>

      <div className="flex gap-2.5 flex-wrap">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="px-4 py-2 border border-boza-black bg-boza-cream text-boza-black text-xs font-semibold transition hover:bg-boza-black hover:text-boza-cream"
          >
            Définir par défaut
          </button>
        )}
        <button className="px-4 py-2 border border-boza-black bg-boza-cream text-boza-black text-xs font-semibold transition hover:bg-boza-black hover:text-boza-cream">
          Modifier
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="px-4 py-2 border border-boza-brown bg-boza-cream text-boza-brown text-xs font-semibold transition hover:bg-boza-brown hover:text-boza-cream"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}