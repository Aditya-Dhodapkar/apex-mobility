import * as React from "react"

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return !!isMobile
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<"mobile" | "tablet" | "desktop">("desktop");

  React.useEffect(() => {
    const updateDeviceType = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setDeviceType("mobile");
      } else if (window.innerWidth < TABLET_BREAKPOINT) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    window.addEventListener("resize", updateDeviceType);
    updateDeviceType();
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  return deviceType;
}


type ResponsiveValue<T> = {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default?: T;
};

export function useResponsiveValue<T>(values: ResponsiveValue<T>): T | undefined {
  const deviceType = useDeviceType();
  if (deviceType === "mobile" && values.mobile !== undefined) return values.mobile;
  if (deviceType === "tablet" && values.tablet !== undefined) return values.tablet;
  if (deviceType === "desktop" && values.desktop !== undefined) return values.desktop;
  return values.default;
}

interface DeviceContextType {
  isMobile: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
}

const DeviceContext = React.createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  return (
    <DeviceContext.Provider value={{ isMobile, deviceType }}>
      {children}
    </DeviceContext.Provider>
  );
};

export function useDeviceContext() {
  const context = React.useContext(DeviceContext);
  if (!context) {
    throw new Error("useDeviceContext must be used within a DeviceProvider");
  }
  return context;
}

export function useResponsiveFontSize(): string {
  const fontSize = useResponsiveValue({
    mobile: "text-sm",
    tablet: "text-base",
    desktop: "text-lg",
    default: "text-md"
  });
  return fontSize || "text-md";
}

export function useResponsivePadding(): string {
  return useResponsiveValue({
    mobile: "p-2",
    tablet: "p-4",
    desktop: "p-6"
  }) || "p-4";
}

export function useLogDevice() {
  const { isMobile, deviceType } = useDeviceContext();

  React.useEffect(() => {
    console.log("Device Type:", deviceType, "| Is Mobile:", isMobile);
  }, [isMobile, deviceType]);
}

//hook to detect orientation
export function useOrientation(): "portrait" | "landscape" {
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">(
    window.innerWidth > window.innerHeight ? "landscape" : "portrait"
  );

  React.useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
}

//hook for applying classNames based on device type
export function useResponsiveClass(base: string, overrides?: ResponsiveValue<string>) {
  const deviceType = useDeviceType();

  if (deviceType === "mobile" && overrides?.mobile) return `${base} ${overrides.mobile}`;
  if (deviceType === "tablet" && overrides?.tablet) return `${base} ${overrides.tablet}`;
  if (deviceType === "desktop" && overrides?.desktop) return `${base} ${overrides.desktop}`;
  return base;
}

//hook to determine if screen is small (mobile or tablet)
export function useIsSmallScreen() {
  const deviceType = useDeviceType();
  return deviceType === "mobile" || deviceType === "tablet";
}