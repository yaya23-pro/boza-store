// components/User/Account/CommunicationPreferences.tsx
export interface PreferenceItem {
  key: string;
  label: string;
  text: string;
  checked: boolean;
}

interface CommunicationPreferencesProps {
  preferences: PreferenceItem[];
  onToggle: (key: string) => void;
}

export default function CommunicationPreferences({ preferences, onToggle }: CommunicationPreferencesProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Préférences de communication</h2>
      </div>

      {preferences.map((pref) => (
        <div
          key={pref.key}
          className="flex justify-between items-center py-4 border-b border-boza-cream-alt last:border-b-0"
        >
          <div>
            <div className="text-sm font-semibold text-boza-black">{pref.label}</div>
            <div className="text-xs text-boza-taupe mt-0.5">{pref.text}</div>
          </div>

          <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={pref.checked}
              onChange={() => onToggle(pref.key)}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute inset-0 bg-boza-cream-alt border border-boza-black transition-colors peer-checked:bg-boza-black before:content-[''] before:absolute before:h-4 before:w-4 before:left-[3px] before:bottom-[3px] before:bg-boza-black before:transition-transform peer-checked:before:translate-x-5 peer-checked:before:bg-boza-cream" />
          </label>
        </div>
      ))}
    </div>
  );
}