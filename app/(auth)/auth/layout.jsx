import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/actions/auth.actions";

const AuthLayout = async ({ children }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return <div>{children}</div>;
};

export default AuthLayout;