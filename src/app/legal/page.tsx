import { Markdown } from "@/app/(ui)/Markdown";
import { apiClient } from "@/app/apiClient";

const LegalPage = async () => {
  const { site_view: siteView } = await apiClient.getSite();
  return (
    <div className={"m-2 lg:mx-4"}>
      <h1 className={"text-2xl font-bold my-2"}>Legal info</h1>
      <div className="max-w-[900px]">
        <Markdown content={siteView.local_site.legal_information ?? ""} />
      </div>
    </div>
  );
};

export default LegalPage;
