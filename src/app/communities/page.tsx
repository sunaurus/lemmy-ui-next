import { apiClient } from "@/app/apiClient";
import { ReactNode } from "react";
import { CommunityLink } from "@/app/c/CommunityLink";
import classNames from "classnames";
import {
  CommunityView,
  ListingType,
  MyUserInfo,
  SortType,
} from "lemmy-js-client";
import { SubscribeButton } from "@/app/communities/SubscribeButton";
import { Pagination } from "@/app/(ui)/Pagination";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";

const CommunitiesListPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { my_user: loggedInUser } = await apiClient.getSite();

  const searchParamsSortType = searchParams["sortType"] as SortType;
  const currentSortType = searchParamsSortType ?? "NewComments";

  const searchParamsListingType = searchParams["listingType"] as ListingType;
  const currentListingType =
    searchParamsListingType ?? (loggedInUser ? "Subscribed" : "All");

  const currentPage = searchParams["page"] ? Number(searchParams["page"]) : 1;
  const { communities } = await apiClient.listCommunities({
    limit: 25,
    sort: currentSortType,
    type_: currentListingType,
    page: currentPage,
  });

  const availableSortOptions: SortType[] = [
    "NewComments",
    "TopAll",
    "TopYear",
    "TopMonth",
  ];

  let availableListingOptions: ListingType[] = ["Local", "All"];

  if (loggedInUser) {
    availableListingOptions = ["Subscribed", ...availableListingOptions];
  }

  return (
    <div className="flex w-full flex-col content-center items-start">
      <div className="m-2 flex flex-col gap-1">
        <SearchParamLinks
          label={"Sort"}
          searchParamKey={"sortType"}
          options={availableSortOptions}
          currentActiveValue={currentSortType}
        />
        <SearchParamLinks
          label={"Filter"}
          searchParamKey={"listingType"}
          options={availableListingOptions}
          currentActiveValue={currentListingType}
        />
      </div>
      <table className="w-full table-auto divide-y divide-neutral-700">
        <thead className="">
          <tr className="hidden lg:table-row">
            <ColumnHeader>Name</ColumnHeader>
            <ColumnHeader>Subscribers</ColumnHeader>
            <ColumnHeader>MAU</ColumnHeader>
            <ColumnHeader>Posts</ColumnHeader>
            <ColumnHeader>Comments</ColumnHeader>
            {loggedInUser && <ColumnHeader></ColumnHeader>}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-700">
          {communities.map((communityView) => (
            <Row
              key={communityView.community.id}
              communityView={communityView}
              loggedInUser={loggedInUser}
            />
          ))}
        </tbody>
      </table>
      <Pagination
        prevPage={currentPage > 1 ? currentPage - 1 : undefined}
        nextPage={currentPage + 1}
      />
    </div>
  );
};

const Row = (props: {
  communityView: CommunityView;
  loggedInUser?: MyUserInfo;
}) => {
  return (
    <tr key={props.communityView.community.id}>
      <Cell>
        <div className="flex flex-col">
          <CommunityLink community={props.communityView.community} />
          <div className={"flex flex-row"}>
            <div className={"flex flex-col lg:hidden"}>
              <div className="mt-1 text-xs">
                Subscribers:
                <span className="ml-1 font-bold">
                  {formatCompactNumber(props.communityView.counts.subscribers)}
                </span>
              </div>
              <div className="text-xs">
                MAU:
                <span className="ml-1 font-bold">
                  {formatCompactNumber(
                    props.communityView.counts.users_active_month,
                  )}
                </span>
              </div>
              <div className="text-xs">
                Posts:
                <span className="ml-1 font-bold">
                  {formatCompactNumber(props.communityView.counts.posts)}
                </span>
              </div>
              <div className="text-xs">
                Comments:
                <span className="ml-1 font-bold">
                  {formatCompactNumber(props.communityView.counts.comments)}
                </span>
              </div>
            </div>

            {props.loggedInUser && (
              <div className="ml-auto mr-2 mt-auto lg:hidden">
                <SubscribeButton
                  loggedInUser={props.loggedInUser}
                  currentStatus={props.communityView.subscribed}
                  communityId={props.communityView.community.id}
                />
              </div>
            )}
          </div>
        </div>
      </Cell>
      <Cell className="hidden lg:table-cell">
        {formatCompactNumber(props.communityView.counts.subscribers)}
      </Cell>
      <Cell className="hidden lg:table-cell">
        {formatCompactNumber(props.communityView.counts.users_active_month)}
      </Cell>
      <Cell className="hidden lg:table-cell">
        {formatCompactNumber(props.communityView.counts.posts)}
      </Cell>
      <Cell className="hidden lg:table-cell">
        {formatCompactNumber(props.communityView.counts.comments)}
      </Cell>
      {props.loggedInUser && (
        <Cell className="hidden lg:table-cell">
          <SubscribeButton
            loggedInUser={props.loggedInUser}
            currentStatus={props.communityView.subscribed}
            communityId={props.communityView.community.id}
          />
        </Cell>
      )}
    </tr>
  );
};

const ColumnHeader = (props: { children?: ReactNode; className?: string }) => {
  return (
    <th
      scope="col"
      className={classNames(
        `px-4 py-3 text-center text-xs font-medium uppercase tracking-wider
        text-neutral-300 first-of-type:text-left last-of-type:text-right`,
        props.className,
      )}
    >
      {props.children}
    </th>
  );
};

const Cell = (props: { children: ReactNode; className?: string }) => {
  return (
    <td
      className={classNames(
        `whitespace-nowrap px-4 py-2 text-center first-of-type:text-left
        last-of-type:text-right`,
        props.className,
      )}
    >
      {props.children}
    </td>
  );
};

export default CommunitiesListPage;
