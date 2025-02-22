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