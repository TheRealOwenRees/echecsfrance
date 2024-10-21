import {
  HiCheckCircle,
  HiInformationCircle,
  HiXCircle,
  HiXMark,
} from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

export type InfoMessageType = "success" | "error" | "info";

const InfoMessage = ({
  message,
  type,
  className,
  onDismiss,
}: {
  message: React.ReactNode;
  type: "success" | "error" | "info";
  onDismiss?: () => void;
  className?: string;
}) => {
  const icons = {
    success: HiCheckCircle,
    error: HiXCircle,
    info: HiInformationCircle,
  };

  const colorClasses = {
    success: {
      text: "text-success",
      bg: "bg-success/30",
      button:
        "bg-transparent hover:bg-success hover:text-white focus:ring-success focus:ring-offset-success/50",
    },
    error: {
      text: "text-error",
      bg: "bg-error/30",
      button:
        "bg-transparent hover:bg-error hover:text-white focus:ring-error focus:ring-offset-error/50",
    },
    info: {
      text: "text-primary",
      bg: "bg-primary/30",
      button:
        "bg-transparent hover:bg-primary-800 hover:text-white focus:ring-primary-800 focus:ring-offset-primary-50",
    },
  };

  const Icon = icons[type];
  const { text, bg, button } = colorClasses[type];

  return (
    <div className={twMerge("rounded-md p-4", bg, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon aria-hidden="true" className={twMerge("h-5 w-5", text)} />
        </div>

        <div className="ml-3">
          <p className={twMerge("text-sm font-medium", text)}>{message}</p>
        </div>

        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={twMerge(
                  "inline-flex rounded-md border-0 p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  text,
                  bg,
                  button,
                )}
              >
                <HiXMark aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoMessage;
