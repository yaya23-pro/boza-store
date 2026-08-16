// components/User/Address/AddAddressCard.tsx
interface AddAddressCardProps {
  onClick: () => void;
}

export default function AddAddressCard({ onClick }: AddAddressCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center border border-dashed border-boza-taupe bg-transparent py-10 px-[22px] text-center transition hover:border-boza-black hover:bg-boza-cream-alt"
    >
      <div className="w-11 h-11 rounded-full border border-boza-taupe flex items-center justify-center text-boza-taupe text-lg mb-3.5">
        +
      </div>
      <div className="text-sm font-semibold text-boza-black">Ajouter une nouvelle adresse</div>
    </button>
  );
}