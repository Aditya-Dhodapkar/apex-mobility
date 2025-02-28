import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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