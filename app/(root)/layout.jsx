import { ReactNode } from "react";

import { isAuthenticated } from "@/actions/auth.actions";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/auth");

  return <div>{children}</div>;
};

export default AuthLayout;