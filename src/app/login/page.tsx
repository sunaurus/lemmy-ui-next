import { apiClient } from "@/app/apiClient";
import { Image } from "@/app/(ui)/Image";
import { LoginForm } from "@/app/login/LoginForm";
import { StyledLink } from "@/app/(ui)/StyledLink";

const LoginPage = async (props: { searchParams: { redirect?: string } }) => {
  const { site_view: siteView } = await apiClient.getSite();
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12 lg:px-8">
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

      <div className="mx-auto mt-8 w-full max-w-sm">
        <LoginForm redirect={props.searchParams.redirect} />

        <p className="mt-10 text-center text-sm">
          No account?{" "}
          <StyledLink
            href={"/signup"}
            className="hover:text-primary-400 font-semibold leading-6"
          >
            Sign up here
          </StyledLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
