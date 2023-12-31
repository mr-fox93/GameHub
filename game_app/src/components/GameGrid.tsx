import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import { Box, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import ScrollToTopButton from "../common/ScrottToTopButton";

const GameGrid = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGames();

  const isVisible = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

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
      {isVisible && <ScrollToTopButton />}
    </>
  );
};

export default GameGrid;
