import { Image } from "@/app/(ui)/Image";
import { Markdown } from "@/app/(ui)/markdown/Markdown";
import { UserLink } from "@/app/u/UserLink";
import {
  Community,
  CommunityAggregates,
  Person,
  Site,
  SiteAggregates,
} from "lemmy-js-client";
import { memo, ReactNode } from "react";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { getRemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { MarkdownWithFetchedContent } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";

type SidebarProps = {
  children: ReactNode | ReactNode[];
};

type InstanceSidebarProps = {
  site: Site;
  admins: Person[];
  stats: SiteAggregates;
};

type CommunitySidebarProps = {
  community: Community;
  site?: Site;
  mods: Person[];
  stats: CommunityAggregates;
};

type Props = SidebarProps & (InstanceSidebarProps | CommunitySidebarProps);

export const PageWithSidebar = (props: Props) => {
  return (
    <div className="lg:flex w-full">
      <div className="p-1 lg:p-4 flex-grow">{props.children}</div>
      <SidebarToggleButton />
      <SidebarToggleContents {...props} />
    </div>
  );
};

const isCommunitySidebar = (
  props: SidebarContentProps,
): props is CommunitySidebarProps => {
  return (props as CommunitySidebarProps).community !== undefined;
};

const SidebarToggleButton = () => {
  return (
    <>
      <input
        type="checkbox"
        id="sidebar-toggle"
        className="absolute sr-only peer"
        defaultChecked={false}
      />
      <label
        htmlFor="sidebar-toggle"
        className="lg:hidden absolute cursor-pointer right-0 z-10 top-[42px] m-3 bg-neutral-900 group "
      >
        <span className="hover:brightness-125 flex items-center">
          <ChevronDoubleLeftIcon className="h-6 peer-checked:group-[]:hidden" />
          <ChevronDoubleRightIcon className="h-6 hidden peer-checked:group-[]:inline" />
        </span>
      </label>
    </>
  );
};

type SidebarContentProps = CommunitySidebarProps | InstanceSidebarProps;
const SidebarToggleContents = memo(
  (props: SidebarContentProps) => {
    return (
      <div className="max-w-[300px] min-w-[300px] absolute lg:relative top-[84px] lg:top-0 right-0 transition-transform duration-500 transform lg:peer-checked:translate-x-0 lg:translate-x-0 translate-x-[300px] peer-checked:translate-x-0">
        {isCommunitySidebar(props) && (
          <>
            <CommunityDetailsSection
              communityName={formatCommunityName(props.community)}
              communityId={props.community.id}
            />
            <StatsSection title={"Community stats"} stats={props.stats} />
          </>
        )}

        {isCommunitySidebar(props) && (
          <ContactsSection
            title={"Community moderators"}
            persons={props.mods}
          />
        )}

        {props.site && (
          <>
            <InstanceDetailsSection
              logoSrc={props.site.banner}
              siteName={props.site.name}
            >
              {isCommunitySidebar(props) ? (
                <MarkdownWithFetchedContent
                  type={"community_site"}
                  id={props.community.id}
                />
              ) : (
                <Markdown content={props.site.sidebar ?? ""} />
              )}
            </InstanceDetailsSection>
          </>
        )}

        {!isCommunitySidebar(props) && (
          <StatsSection title={"Instance stats"} stats={props.stats} />
        )}

        {!isCommunitySidebar(props) && (
          <ContactsSection title={"Instance admins"} persons={props.admins} />
        )}
      </div>
    );
  },
  (prevProps, newProps) =>
    isCommunitySidebar(prevProps)
      ? isCommunitySidebar(newProps) &&
        prevProps.community.id === newProps.community.id
      : prevProps.site?.id === newProps.site?.id,
);

SidebarToggleContents.displayName = "SidebarToggleContents";

const InstanceDetailsSection = async (props: {
  logoSrc?: string;
  siteName: string;
  children: ReactNode;
}) => {
  return (
    <SidebarSection>
      <header className="flex flex-col items-center mb-4">
        {props.logoSrc && (
          <Image
            className="mt-4 object-cover h-auto rounded"
            priority={true}
            alt="Logo"
            {...await getRemoteImageProps(props.logoSrc, 230)}
            placeholder={"empty"}
          />
        )}
        <h1 className="mt-4">{props.siteName}</h1>
      </header>
      {props.children}
    </SidebarSection>
  );
};

const CommunityDetailsSection = async (props: {
  communityName: string;
  communityId: number;
}) => {
  return (
    <SidebarSection>
      <header className="flex flex-col items-center mb-4">
        <h1 className="mt-4">{props.communityName}</h1>
      </header>

      <MarkdownWithFetchedContent type={"community"} id={props.communityId} />
    </SidebarSection>
  );
};

const StatsSection = (props: {
  title: string;
  stats: CommunityAggregates | SiteAggregates;
}) => {
  return (
    <SidebarSection>
      <h1 className="text-lg">{props.title}</h1>
      <ul>
        <StatItem
          label={"Monthly active users"}
          count={props.stats.users_active_month}
        />
        <StatItem label={"Posts"} count={props.stats.posts} />
        <StatItem label={"Comments"} count={props.stats.comments} />
      </ul>
    </SidebarSection>
  );
};

const StatItem = (props: { label: string; count: number }) => {
  return (
    <li className="flex items-center gap-2">
      <p>{formatCompactNumber(props.count)}</p>
      <p className="text-sm">{props.label}</p>
    </li>
  );
};

const ContactsSection = (props: { title: string; persons: Person[] }) => {
  return (
    <SidebarSection>
      <h1 className="text-lg">{props.title}</h1>
      <ul>
        {props.persons.map((person) => (
          <li key={person.id}>
            <UserLink person={person} />
          </li>
        ))}
      </ul>
    </SidebarSection>
  );
};

const SidebarSection = (props: { children: ReactNode[] | ReactNode }) => (
  <div className="bg-neutral-900 last-of-type:rounded-b shadow-lg p-4 w-full border-b border-neutral-700 last-of-type:border-0">
    {props.children}
  </div>
);
