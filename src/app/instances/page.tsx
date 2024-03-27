import { apiClient } from "@/app/apiClient";
import { InstanceWithFederationState } from "lemmy-js-client";
import { StyledLink } from "@/app/(ui)/StyledLink";

const InstancesPage = async () => {
  const { federated_instances: federatedInstances } =
    await apiClient.getFederatedInstances();

  return (
    <div
      className={"m-2 flex w-full max-w-full flex-wrap justify-center gap-1"}
    >
      <InstanceList
        title={"Linked instances"}
        instances={federatedInstances?.linked}
      />
      <InstanceList
        title={"Blocked instances"}
        instances={federatedInstances?.blocked}
      />
    </div>
  );
};

const InstanceList = (props: {
  title: string;
  instances?: InstanceWithFederationState[];
}) => {
  if (!props.instances) {
    return null;
  }

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-bold">{props.title}</h1>
      {props.instances
        .sort((a, b) => {
          const aSoftware = a.software ?? "x";
          const bSoftware = b.software ?? "x";
          const aVersion = a.version?.split("-")[0] ?? "";
          const bVersion = b.version?.split("-")[0] ?? "";
          if (aSoftware === "lemmy" && bSoftware !== "lemmy") {
            return -1;
          } else if (aSoftware !== "lemmy" && bSoftware === "lemmy") {
            return 1;
          } else {
            if (aSoftware > bSoftware) {
              return 1;
            } else if (aSoftware < bSoftware) {
              return -1;
            } else {
              if (aVersion < bVersion) {
                return 1;
              }
              return -1;
            }
          }
        })
        .map((instance) => (
          <div
            key={instance.domain}
            className="flex max-w-full flex-wrap items-center gap-x-2 break-words"
          >
            <StyledLink
              href={"https://" + instance.domain}
              className="break-words"
            >
              {instance.domain}
            </StyledLink>
            <div className="break-words">
              {instance.software ? `• ${instance.software}` : ""}
            </div>
            <div className="break-words">
              {instance.version ? `• ${instance.version}` : ""}
            </div>
          </div>
        ))}
    </div>
  );
};

export default InstancesPage;
