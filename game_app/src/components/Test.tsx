import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

const Test = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGames();

  if (error) return <div>Error..</div>;

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          width="100%"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={data?.pages.length ?? 0}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={isFetchingNextPage && <Spinner />}
          //scrollThreshold={0.8}
        >
          <SimpleGrid
            mt="20px"
            columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing={10}
          >
            {data?.pages.map((page) => (
              <React.Fragment key={crypto.randomUUID()}>
                {page.results?.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </React.Fragment>
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </>
  );
};

export default Test;
