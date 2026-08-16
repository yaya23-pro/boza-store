// components/User/Account/AccountInfoForm.tsx
"use client";

import { useState } from "react";

export interface AccountInfoData {
  fullName: string;
  email: string;
  phone: string;
}

interface AccountInfoFormProps {
  initialData: AccountInfoData;
  onSave: (data: AccountInfoData) => void;
  saving?: boolean;
}

export default function AccountInfoForm({ initialData, onSave, saving }: AccountInfoFormProps) {
  const [data, setData] = useState<AccountInfoData>(initialData);

  function handleChange<K extends keyof AccountInfoData>(key: K, value: AccountInfoData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(data);
  }

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Informations personnelles</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-[18px] mb-[18px] max-[640px]:grid-cols-1">
          <div className="col-span-2 max-[640px]:col-span-1">
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Nom complet</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-[13px] border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
            />
          </div>

          <div className="col-span-2 max-[640px]:col-span-1">
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Adresse e-mail</label>
            <input
              type="email"
              value={data.email}
              disabled
              className="w-full px-4 py-[13px] border border-boza-cream-alt bg-boza-cream-alt text-boza-taupe text-sm outline-none cursor-not-allowed"
            />
            <div className="text-xs text-boza-taupe mt-1.5">
              Non modifiable ici — utilisée pour te connecter et recevoir tes confirmations de commande
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Téléphone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-[13px] border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-[14px] bg-boza-taune text-boza-black border border-boza-black text-sm font-bold uppercase tracking-wide transition hover:bg-boza-brown hover:border-boza-brown disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}