import { type Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./form";
import { ArrowLeft, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Join Community Aid | Sign Up",
  description: "Create your account to start helping your community today.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex flex-col pt-20">
      {/* Navigation Bar */}
      <header className="w-full border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Retour à l'accueil</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-700 to-amber-600 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-emerald-900 to-amber-700 bg-clip-text text-transparent">
              Dir-Khir
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Welcome Message */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 to-amber-700 bg-clip-text text-transparent">
                  Rejoignez Notre Communauté
                </h1>
                <p className="text-lg text-emerald-700 leading-relaxed">
                  Devenez membre d'un réseau où les voisins s'entraident. Créez votre compte pour partager des besoins ou offrir de l'aide dans votre communauté.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Why Join Community Aid?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Connect with people in your neighborhood</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Request help when you need it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Offer help and make a difference</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Build stronger local connections</span>
                  </li>
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-700 italic">"This platform helped me find assistance when I needed it most. The community support is amazing!"</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-600">Community Member, Casablanca</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
                <p className="text-gray-600 mt-2">Start your journey with Community Aid</p>
              </div>

              <SignUpForm />

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      href="/login" 
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    By joining, you agree to our Terms and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}