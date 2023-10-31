import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import { SimpleGrid } from "@chakra-ui/react";

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
        <SimpleGrid
          mt="20px"
          columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
          spacing={10}
        >
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.results?.map((game) => (
                <GameCard game={game} />
              ))}
            </React.Fragment>
          ))}
        </SimpleGrid>
      </InfiniteScroll>
    </>
  );
};

export default Test;
