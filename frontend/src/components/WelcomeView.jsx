import React from 'react';
import { Brackets, X } from 'lucide-react';


const currentYear = new Date().getFullYear();

const ConnectXLogo = () => (
  <div className="relative w-1/2 h-screen bg-black">
    <Brackets className="w-full h-full text-primary absolute" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 px-8">
      <X className="w-full h-full text-primary" />
    </div>
  </div>
);


function App() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Left section (Logo) */}
      <div className="md:w-1/2 flex justify-center items-center">
        <ConnectXLogo />
      </div>

      {/* Right section (Form) */}
      <div className="md:w-1/2 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 whitespace-nowrap">Happening now</h1>
          </div>
          
          <div className="space-y-3">
          <h5 className="text-3xl mb-8">Join today.</h5>
            <button className="w-full bg-primary text-white rounded-full py-2 px-4 font-bold">
              Create account
            </button>
            <p className="text-xs text-gray-400">
              By signing up, you agree to the <a href="#" className="text-primary">Terms of Service</a> and{' '}
              <a href="#" className="text-primary">Privacy Policy</a>, including <a href="#" className="text-primary">Cookie Use</a>.
            </p>
          </div>
          <div className="mt-12">
            <h3 className="font-bold mb-4">Already have an account?</h3>
            <button className="w-full bg-transparent text-primary border border-gray-700 rounded-full py-2 px-4 font-bold hover:bg-primary/10">
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-500">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Download the ConnectX app</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Ads info</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Brand Resources</a>
          <a href="#" className="hover:underline">Advertising</a>
          <a href="#" className="hover:underline">Marketing</a>
          <a href="#" className="hover:underline">ConnectX for Business</a>
          <a href="#" className="hover:underline">Developers</a>
          <a href="#" className="hover:underline">Directory</a>
          <a href="#" className="hover:underline">Settings</a>
        </nav>
        <p>© {currentYear} ConnectX Corp.</p>
      </footer>
    </div>
  );
}

export default App;