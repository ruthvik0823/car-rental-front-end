import React from "react";
import { cn } from "../../utils/classNames";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-[#F5F5F5] rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
