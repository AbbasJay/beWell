import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastType } from "@/app/ui/toast/toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  const showToast = useCallback(
    (newMessage: string, newType: ToastType = "success") => {
      setMessage(newMessage);
      setType(newType);
      setVisible(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  const value = {
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
