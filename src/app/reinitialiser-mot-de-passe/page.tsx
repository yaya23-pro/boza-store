import AuthHeader from "@/components/Auth/AuthHeader";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center py-[50px] px-6">
        <div className="w-full max-w-[420px]">
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  );
}