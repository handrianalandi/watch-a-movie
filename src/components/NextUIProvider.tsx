"use client";

import { NextUIProvider as NextUIProviderBase } from "@nextui-org/react";
import { ReactNode } from "react";

export default function NextUIProvider({ children }: { children: ReactNode }) {
  return <NextUIProviderBase>{children}</NextUIProviderBase>;
}
