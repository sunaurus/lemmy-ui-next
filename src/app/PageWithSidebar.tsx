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
    <div className="w-full lg:flex">
      <div className="flex-grow p-1 lg:p-4">{props.children}</div>
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
        className="peer sr-only absolute right-0 top-0"
        defaultChecked={false}
      />
      <label
        htmlFor="sidebar-toggle"
        className="group absolute right-0 top-[42px] z-10 m-3 cursor-pointer bg-neutral-900
          lg:hidden"
      >
        <span className="flex items-center hover:brightness-125">
          <ChevronDoubleLeftIcon className="h-6 peer-checked:group-[]:hidden" />
          <ChevronDoubleRightIcon className="hidden h-6 peer-checked:group-[]:inline" />
        </span>
      </label>
    </>
  );
};

type SidebarContentProps = CommunitySidebarProps | InstanceSidebarProps;
const SidebarToggleContents = memo(
  (props: SidebarContentProps) => {
    return (
      <div
        className="absolute right-0 top-[84px] min-w-[300px] max-w-[300px] translate-x-[300px]
          transform transition-transform duration-500 peer-checked:translate-x-0
          lg:relative lg:top-0 lg:translate-x-0 lg:peer-checked:translate-x-0"
      >
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
      <header className="mb-4 flex flex-col items-center">
        {props.logoSrc && (
          <Image
            className="mt-4 h-auto rounded object-cover"
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
      <header className="mb-4 flex flex-col items-center">
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
  <div
    className="w-full border-b border-neutral-700 bg-neutral-900 p-4 shadow-lg
      last-of-type:rounded-b last-of-type:border-0"
  >
    {props.children}
  </div>
);
