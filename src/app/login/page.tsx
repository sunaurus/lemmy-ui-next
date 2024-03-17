import { apiClient } from "@/app/apiClient";
import Image from "next/image";
import { LoginForm } from "@/app/login/LoginForm";

const LoginPage = async () => {
  const { site_view: siteView } = await apiClient.getSite();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      {siteView.site.banner && (
        <Image
          src={siteView.site.banner}
          width={230}
          height={90}
          alt="Instance banner"
        />
      )}
      <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight">
        Sign in to {siteView.site.name}
      </h2>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />

        <p className="mt-10 text-center text-sm">
          No account?{" "}
          <a
            href="#"
            className="font-semibold leading-6 text-slate-500 hover:text-slate-400"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
