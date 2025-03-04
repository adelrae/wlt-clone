import { createContext, useContext, useState } from "react";

const Context = createContext();

export const ResponsiveProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Context.Provider value={{ isMobile, setIsMobile }}>
      {children}
    </Context.Provider>
  );
};

export const useResponsive = () => {
  const context = useContext(Context);

  if (context === undefined)
    throw new Error("useResponsive must be used within a CameraProvider");

  return context;
};
