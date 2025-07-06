import React, { createContext, useContext, useState, ReactNode } from "react";

interface MapViewContextType {
  isMapView: boolean;
  setIsMapView: (isMapView: boolean) => void;
}

const MapViewContext = createContext<MapViewContextType | undefined>(undefined);

export const useMapView = () => {
  const context = useContext(MapViewContext);
  if (context === undefined) {
    throw new Error("useMapView must be used within a MapViewProvider");
  }
  return context;
};

interface MapViewProviderProps {
  children: ReactNode;
}

export const MapViewProvider: React.FC<MapViewProviderProps> = ({
  children,
}) => {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <MapViewContext.Provider value={{ isMapView, setIsMapView }}>
      {children}
    </MapViewContext.Provider>
  );
};
