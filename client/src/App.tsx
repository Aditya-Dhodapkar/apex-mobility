import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

function Router() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading user...</div>;

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      {user ? <Route path="/dashboard" component={Dashboard} /> : <Route path="/dashboard" component={Login} />}
      {user ? <Route path="/profile" component={Profile} /> : <Route path="/profile" component={Login} />}
      {user ? <Route path="/settings" component={Settings} /> : <Route path="/settings" component={Login} />}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-muted text-foreground">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
