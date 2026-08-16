"use client";

import { useState } from "react";
import LoginForm from "@/components/Auth/LoginForm";
import SignupForm from "@/components/Auth/SignupForm";

export default function AuthContent() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <main className="flex-1 flex items-center justify-center py-[50px] px-6">
      <div className="w-full max-w-[420px]">
        <div className="flex mb-[30px] border-b border-boza-cream-alt">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3.5 text-center bg-transparent border-0 border-b-2 text-sm font-semibold cursor-pointer -mb-px transition-all duration-300 ${
              activeTab === "login" ? "text-boza-black border-boza-black" : "text-boza-taupe border-transparent"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3.5 text-center bg-transparent border-0 border-b-2 text-sm font-semibold cursor-pointer -mb-px transition-all duration-300 ${
              activeTab === "signup" ? "text-boza-black border-boza-black" : "text-boza-taupe border-transparent"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {activeTab === "login" ? (
          <LoginForm onSwitchToSignup={() => setActiveTab("signup")} />
        ) : (
          <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
        )}
      </div>
    </main>
  );
}