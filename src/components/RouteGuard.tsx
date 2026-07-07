"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources/once-ui.config";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();

  const checkRouteEnabled = (path: string | null) => {
    if (!path) return false;

    if (path in routes) {
      return routes[path as keyof typeof routes];
    }

    const dynamicRoutes = ["/blog", "/work"] as const;
    for (const route of dynamicRoutes) {
      if (path.startsWith(route) && routes[route]) {
        return true;
      }
    }

    return false;
  };

  const initialRouteEnabled = pathname ? checkRouteEnabled(pathname) : false;
  const isProtected = pathname ? !!protectedRoutes[pathname as keyof typeof protectedRoutes] : false;

  const [isRouteEnabled, setIsRouteEnabled] = useState(initialRouteEnabled);
  const [isPasswordRequired, setIsPasswordRequired] = useState(isProtected);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(isProtected);

  useEffect(() => {
    const performChecks = async () => {
      const routeEnabled = checkRouteEnabled(pathname);
      const isProtectedNow = pathname ? !!protectedRoutes[pathname as keyof typeof protectedRoutes] : false;

      setIsRouteEnabled(routeEnabled);
      setIsPasswordRequired(isProtectedNow);

      if (isProtectedNow) {
        setLoading(true);
        setIsAuthenticated(false);
        try {
          const response = await fetch("/api/check-auth");
          if (response.ok) {
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    performChecks();
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
