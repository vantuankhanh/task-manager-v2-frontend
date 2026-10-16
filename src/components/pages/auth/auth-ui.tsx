import { ReactNode } from "react";
import { Button } from "rsuite";

export const AuthHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: ReactNode;
}) => (
  <div className="text-center mb-8">
    <div className="text-gray-900 text-3xl font-bold mb-3">{title}</div>
    <div className="text-gray-500 font-medium">{subtitle}</div>
  </div>
);

export const AuthSubmitButton = ({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <div className="mt-6">
    <Button
      disabled={disabled}
      className="w-full"
      color="blue"
      appearance="primary"
      onClick={onClick}
    >
      {children}
    </Button>
  </div>
);
