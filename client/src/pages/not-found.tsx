import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import confetti from "canvas-confetti";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


export default function NotFound() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center transition-colors ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-4 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm">
              Did you forget to add the page to the router?
            </p>

            <div className="mt-6 flex justify-between items-center">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              <a 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <Home className="w-5 h-5" />
                Home
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
\

useEffect(() => {
  const timeout = setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, 2000);

  return () => clearTimeout(timeout);
}, []);

const [showModal, setShowModal] = useState(false);

useEffect(() => {
  const modalTimeout = setTimeout(() => {
    setShowModal(true);
  }, 4000);
  return () => clearTimeout(modalTimeout);
}, []);

return (
  <>
    {/* Your original JSX remains here */}

    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
        >
          <h2 className="text-xl font-bold mb-2">Looks like you're lost!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            This page doesn't exist — but hey, enjoy some confetti while you're here 🎉
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </>
);