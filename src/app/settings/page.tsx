import { isLoggedIn } from "@/app/login/auth";
import { redirect } from "next/navigation";
import { LogoutForm } from "@/app/settings/LogoutForm";

const SettingsPage = async () => {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Settings</h1>
      <LogoutForm />
    </div>
  );
};

export default SettingsPage;
