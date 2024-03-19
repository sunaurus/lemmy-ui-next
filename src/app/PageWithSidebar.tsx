import Image from "next/image";
import { Markdown } from "@/app/_ui/Markdown";
import { UserLink } from "@/app/u/UserLink";
import { Bars3Icon } from "@heroicons/react/24/solid";
import {
  Community,
  CommunityAggregates,
  Person,
  Site,
  SiteAggregates,
} from "lemmy-js-client";
import { ReactNode } from "react";
import { formatCompactNumber } from "@/utils/formatCompactNumber";

type Props = {
  community?: Community;
  site?: Site;
  admins?: Person[];
  mods?: Person[];
  stats: CommunityAggregates | SiteAggregates;
  children: ReactNode | ReactNode[];
};

export const PageWithSidebar = (props: Props) => {
  return (
    <div className="lg:flex w-full">
      <div className="p-4 mr-auto">{props.children}</div>
      <SidebarToggleButton />
      <SidebarToggleContents>
        {props.community && (
          <>
            <DetailsSection
              logoSrc={props.community.icon}
              name={props.community.name}
              markdownContent={props.community.description}
            />
            <StatsSection stats={props.stats} />
          </>
        )}

        {props.mods && (
          <ContactsSection title={"Moderators"} persons={props.mods} />
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

        {!props.community && <StatsSection stats={props.stats} />}

        {props.admins && (
          <ContactsSection title={"Admins"} persons={props.admins} />
        )}
      </SidebarToggleContents>
    </div>
  );
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
        className="lg:hidden absolute cursor-pointer right-0 z-10 top-0 inline-block p-3  bg-neutral-900 rounded"
      >
        <Bars3Icon className="h-6 peer-checked:rotate-180" />
      </label>
    </>
  );
};

const SidebarToggleContents = (props: { children: ReactNode[] }) => {
  return (
    <div className="max-w-[300px] min-w-[300px] absolute lg:relative top-[48px] lg:top-0 right-0 transition-transform duration-500 transform lg:peer-checked:translate-x-0 lg:translate-x-0 translate-x-[300px] peer-checked:translate-x-0">
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
      <header className="flex flex-col items-center">
        {props.logoSrc && (
          <Image
            className="mt-4"
            src={props.logoSrc}
            width={230}
            height={90}
            alt="Logo"
          />
        )}
        <h1 className="mt-4">{props.name}</h1>
      </header>

      <Markdown content={props.markdownContent ?? ""} />
    </SidebarSection>
  );
};

const StatsSection = (props: {
  stats: CommunityAggregates | SiteAggregates;
}) => {
  return (
    <SidebarSection>
      <h1 className="text-lg">Statistics</h1>
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
      <p>{formatCompactNumber.format(props.count)}</p>
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
  <div className="bg-neutral-900 rounded-b shadow-lg p-4 mb-4 w-full">
    {props.children}
  </div>
);
