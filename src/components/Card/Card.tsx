"use client";

import React from "react";
import { Card as NextCard, CardProps as NextCardProps } from "@nextui-org/react";

interface CardProps extends NextCardProps {
  children: React.ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <NextCard
      {...props}
      className={`bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all ${className}`}
    >
      {children}
    </NextCard>
  );
}
