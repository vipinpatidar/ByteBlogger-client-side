import React, { useContext, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import LoadMoreDataBtn from "../components/load-more.component";
import NotificationCard from "../components/notification-card.component";
import { UserContext } from "../context/user.context";
import { useSearchParams } from "react-router-dom";

const NotificationsPage = () => {
  const [searchParams] = useSearchParams();

  const isEditor = searchParams.get("editor");
  const [filter, setFilter] = useState("all");

  const { userAuth } = useContext(UserContext);

  let filters = [
    "all",
    "like",
    "comment",
    "reply",
    `${userAuth.isAdmin ? "editor" : "admin"}`,
  ];
  const { setUserAuth, new_notification_available } = useContext(UserContext);

  const {
    data: notificationsData,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications", filter, isEditor],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/notification/get-notifications?filter=${
          isEditor ? "editor" : filter
        }&page=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  // console.log(new_notification_available);'
  // console.log(userAuth);

  useEffect(() => {
    setUserAuth((prevState) => ({
      ...prevState,
      new_notification_available: false,
    }));
  }, [notificationsData, filter]);

  return (
    <div className="max-w-[650px] mx-auto pb-12">
      <h1 className="text-2xl my-4">
        {isEditor ? "Editors Notifications" : "Recent Notifications"}
      </h1>

      {!isEditor && userAuth.isEditor && (
        <div className="my-8 flex gap-4 md:gap-6 flex-wrap">
          {filters.map((filterName, idx) => {
            return (
              <button
                key={idx}
                className={`py-2 ${
                  filter === filterName ? "btn-dark" : "btn-light"
                }`}
                onClick={() => setFilter(filterName)}
              >
                {filterName}
              </button>
            );
          })}
        </div>
      )}
      {!isFetching &&
      notificationsData?.pages[0]?.notifications?.length === 0 ? (
        <NoDataMessage message={"No notification yet :)"} error={error} />
      ) : !error && notificationsData?.pages[0]?.notifications?.length > 0 ? (
        notificationsData.pages?.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page?.notifications?.map((notification, idx) => (
              <AnimationWrapper
                key={notification._id}
                transition={{ duration: 1, delay: idx * 0.1 }}
              >
                <NotificationCard notification={notification} index={idx} />
              </AnimationWrapper>
            ))}
          </React.Fragment>
        ))
      ) : (
        <Loader />
      )}

      {hasNextPage && (
        <LoadMoreDataBtn
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
