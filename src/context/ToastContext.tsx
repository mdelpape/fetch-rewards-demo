'use client';
import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

// Types for Toast Options
interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  date?: Date;
  delay?: number;
}

// Types for Toast Content
interface ToastContent {
  title: string;
  description: string;
  action: React.ReactNode | null;
}

// Context type
interface ToastContextType {
  triggerToast: (options?: ToastOptions) => void;
}

// Create Context with explicit type
const ToastContext = React.createContext<ToastContextType | null>(null);

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [toastContent, setToastContent] = React.useState<ToastContent>({
    title: "",
    description: "",
    action: null,
  });
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef<number>(0);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Function to trigger toast
  const triggerToast = React.useCallback((options: ToastOptions = {}) => {
    const { title = "Scheduled: Catch up", description = "", action = null, delay = 100 } = options;

    setOpen(false);
    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      eventDateRef.current = options.date || oneWeekAway();
      setToastContent({
        title,
        description: description || prettyDate(eventDateRef.current),
        action,
      });
      setOpen(true);
    }, delay);
  }, []);

  // Render context provider with toast components
  return (
    <Toast.Provider swipeDirection="right">
      <ToastContext.Provider value={{ triggerToast }}>
        {children}
        <Toast.Root type="foreground" className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title className="ToastTitle">{toastContent.title}</Toast.Title>
          <Toast.Description asChild>
            <time className="ToastDescription" dateTime={eventDateRef.current.toISOString()}>
              {toastContent.description}
            </time>
          </Toast.Description>
          {toastContent.action && (
            <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
              {toastContent.action}
            </Toast.Action>
          )}
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </ToastContext.Provider>
    </Toast.Provider>
  );
};

// Custom Hook
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Utility Functions
function oneWeekAway(): Date {
  const now = new Date();
  const inOneWeek = now.setDate(now.getDate() + 7);
  return new Date(inOneWeek);
}

function prettyDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}
