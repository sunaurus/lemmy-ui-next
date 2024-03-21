import Image from "next/image";
import { Markdown } from "@/app/(ui)/Markdown";
import { UserLink } from "@/app/u/UserLink";
import {
  Community,
  CommunityAggregates,
  Person,
  Site,
  SiteAggregates,
} from "lemmy-js-client";
import { ReactNode } from "react";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";
import { formatCommunityName } from "@/app/c/formatCommunityName";

type SidebarProps = {
  children: ReactNode | ReactNode[];
};

type InstanceSidebarProps = SidebarProps & {
  site: Site;
  admins: Person[];
  stats: SiteAggregates;
};

type CommunitySidebarProps = SidebarProps & {
  community: Community;
  site?: Site;
  mods: Person[];
  stats: CommunityAggregates;
};

type Props = InstanceSidebarProps | CommunitySidebarProps;

export const PageWithSidebar = (props: Props) => {
  return (
    <div className="lg:flex w-full">
      <div className="p-1 lg:p-4 flex-grow">{props.children}</div>
      <SidebarToggleButton />
      <SidebarToggleContents>
        {isCommunitySidebar(props) && (
          <>
            <DetailsSection
              logoSrc={props.community.icon}
              name={formatCommunityName(props.community)}
              markdownContent={props.community.description}
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
            <DetailsSection
              logoSrc={props.site.banner}
              name={props.site.name}
              markdownContent={props.site.sidebar}
            />
          </>
        )}

        {!isCommunitySidebar(props) && (
          <StatsSection title={"Instance stats"} stats={props.stats} />
        )}

        {!isCommunitySidebar(props) && (
          <ContactsSection title={"Instance admins"} persons={props.admins} />
        )}
      </SidebarToggleContents>
    </div>
  );
};

const isCommunitySidebar = (props: Props): props is CommunitySidebarProps => {
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

const SidebarToggleContents = (props: { children: ReactNode[] }) => {
  return (
    <div className="max-w-[300px] min-w-[300px] absolute lg:relative top-[84px] lg:top-0 right-0 transition-transform duration-500 transform lg:peer-checked:translate-x-0 lg:translate-x-0 translate-x-[300px] peer-checked:translate-x-0">
      {props.children}
    </div>
  );
};

const DetailsSection = (props: {
  logoSrc?: string;
  name: string;
  markdownContent?: string;
}) => {
  return (
    <SidebarSection>
      <header className="flex flex-col items-center mb-4">
        {props.logoSrc && (
          <div className="relative h-[90px] w-[230px]">
            <Image
              className="mt-4 object-cover h-auto"
              src={props.logoSrc}
              priority={true}
              fill={true}
              sizes="230px"
              alt="Logo"
            />
          </div>
        )}
        <h1 className="mt-4">{props.name}</h1>
      </header>

      <Markdown content={props.markdownContent ?? ""} />
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
