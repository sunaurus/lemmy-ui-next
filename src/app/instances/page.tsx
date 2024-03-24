import { apiClient } from "@/app/apiClient";
import { InstanceWithFederationState } from "lemmy-js-client";
import { StyledLink } from "@/app/(ui)/StyledLink";

const InstancesPage = async () => {
  const { federated_instances: federatedInstances } =
    await apiClient.getFederatedInstances();

  return (
    <div className={"flex m-2 w-full justify-center gap-1 flex-wrap"}>
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
    <div>
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
          <div key={instance.domain} className="flex items-center gap-2">
            <StyledLink href={"https://" + instance.domain}>
              {instance.domain}
            </StyledLink>
            <div>{instance.software ? `• ${instance.software}` : ""}</div>
            <div>{instance.version ? `• ${instance.version}` : ""}</div>
          </div>
        ))}
    </div>
  );
};

export default InstancesPage;
