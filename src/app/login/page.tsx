import { apiClient } from "@/app/apiClient";
import Image from "next/image";
import { LoginForm } from "@/app/login/LoginForm";
import { StyledLink } from "@/app/(ui)/StyledLink";

const LoginPage = async () => {
  const { site_view: siteView } = await apiClient.getSite();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center py-12 px-4 lg:px-8">
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

      <div className="mt-8 mx-auto max-w-sm w-full">
        <LoginForm />

        <p className="mt-10 text-center text-sm">
          No account?{" "}
          <StyledLink
            href={"/signup"}
            className="font-semibold leading-6 hover:text-slate-400"
          >
            Sign up here
          </StyledLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
