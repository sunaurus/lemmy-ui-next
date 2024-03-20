import { apiClient } from "@/app/apiClient";
import { ReactNode } from "react";
import { CommunityLink } from "@/app/c/CommunityLink";
import classNames from "classnames";
import { SortTypeLinks } from "@/app/(ui)/SortTypeLinks";
import { ListingType, SortType } from "lemmy-js-client";
import { ListingTypeLinks } from "@/app/(ui)/ListingTypeLinks";
import { SubscribeButton } from "@/app/communities/SubscribeButton";
import { Pagination } from "@/app/(ui)/Pagination";

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

  const currentPage = searchParams["page"]
    ? Number(searchParams["page"])
    : undefined;
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

  return (
    <div className="w-full flex flex-col items-start content-center">
      <div className="flex flex-col gap-1 m-2">
        <SortTypeLinks
          enabledSortOptions={availableSortOptions}
          currentSortType={currentSortType}
          basePath={"/communities"}
          searchParams={searchParams}
        />
        <ListingTypeLinks
          loggedInUser={loggedInUser}
          currentListingType={currentListingType}
          basePath={"/communities"}
          searchParams={searchParams}
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
            <tr key={communityView.community.id}>
              <Cell>
                <div className="flex flex-col">
                  <CommunityLink community={communityView.community} />
                  <div className={"flex flex-row"}>
                    <div className={"flex flex-col lg:hidden"}>
                      <div className="mt-1 text-xs">
                        Subscribers:
                        <span className="font-bold ml-1">
                          {communityView.counts.subscribers}
                        </span>
                      </div>
                      <div className="text-xs">
                        MAU:
                        <span className="font-bold ml-1">
                          {communityView.counts.users_active_month}
                        </span>
                      </div>
                      <div className="text-xs">
                        Posts:
                        <span className="font-bold ml-1">
                          {communityView.counts.posts}
                        </span>
                      </div>
                      <div className="text-xs">
                        Comments:
                        <span className="font-bold ml-1">
                          {communityView.counts.comments}
                        </span>
                      </div>
                    </div>

                    {loggedInUser && (
                      <div className="ml-auto mr-2 mt-auto  lg:hidden">
                        <SubscribeButton
                          loggedInUser={loggedInUser}
                          currentStatus={communityView.subscribed}
                          communityId={communityView.community.id}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Cell>
              <Cell className="hidden lg:table-cell">
                {communityView.counts.subscribers}
              </Cell>
              <Cell className="hidden lg:table-cell">
                {communityView.counts.users_active_month}
              </Cell>
              <Cell className="hidden lg:table-cell">
                {communityView.counts.posts}
              </Cell>
              <Cell className="hidden lg:table-cell">
                {communityView.counts.comments}
              </Cell>
              {loggedInUser && (
                <Cell className="hidden lg:table-cell">
                  <SubscribeButton
                    loggedInUser={loggedInUser}
                    currentStatus={communityView.subscribed}
                    communityId={communityView.community.id}
                  />
                </Cell>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        prevPage={
          currentPage && currentPage > 1 ? String(currentPage - 1) : undefined
        }
        nextPage={String((currentPage ?? 0) + 1)}
      />
    </div>
  );
};

const ColumnHeader = (props: { children?: ReactNode; className?: string }) => {
  return (
    <th
      scope="col"
      className={classNames(
        "px-4 py-3 text-xs font-medium text-neutral-300 uppercase tracking-wider text-center first-of-type:text-left last-of-type:text-right",
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
        "px-4 py-2 whitespace-nowrap text-center first-of-type:text-left last-of-type:text-right",
        props.className,
      )}
    >
      {props.children}
    </td>
  );
};

export default CommunitiesListPage;
