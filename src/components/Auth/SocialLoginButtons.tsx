export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2.5 mb-6">
      <button type="button" className="flex items-center justify-center gap-2.5 py-3.5 border border-boza-black bg-boza-cream text-boza-black font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt">
        <i className="fab fa-google"></i> Continuer avec Google
      </button>
      <button type="button" className="flex items-center justify-center gap-2.5 py-3.5 border border-boza-black bg-boza-cream text-boza-black font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt">
        <i className="fab fa-apple"></i> Continuer avec Apple
      </button>
    </div>
  );
}