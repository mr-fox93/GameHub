import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import useGames from "../hooks/useGames";

const Test = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage } = useGames();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error..</div>;

  return (
    <>
      <InfiniteScroll
        dataLength={data?.pages.length ?? 0}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading...</h4>}
      >
        <ul>
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.results?.map((game) => (
                <li key={game.id}>{game.name}</li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </InfiniteScroll>
    </>
  );
};

export default Test;

// import React from "react";
// import useGames from "../hooks/useGames";

// const Test = () => {
//   const { data, isLoading, error, fetchNextPage } = useGames();

//   if (isLoading) return <div>Loading...</div>;

//   if (error) return <div>Error..</div>;

//   return (
//     <>
//       <ul>
//         {data?.pages.map((page, index) => (
//           <React.Fragment key={index}>
//             {page.results?.map((game) => (
//               <li key={game.id}>{game.name}</li>
//             ))}
//           </React.Fragment>
//         ))}
//       </ul>
//       <button
//         onClick={() => {
//           fetchNextPage();
//         }}
//       >
//         Get More games
//       </button>
//     </>
//   );
// };

// export default Test;
