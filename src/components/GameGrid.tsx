import InfiniteScroll from "react-infinite-scroll-component";
import { Fragment } from "react";
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
  } = useGames();

  const isVisible = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="50vh"
        textAlign="center"
      >
        <Box fontSize="xl" color="red.500" mb={4}>
          ⚠️ Failed to load games
        </Box>
        <Box color="gray.500">
          Please check your internet connection and try again
        </Box>
      </Box>
    );
  }

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
          dataLength={data?.pages.reduce((total, page) => total + (page.results?.length ?? 0), 0) ?? 0}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<Spinner />}
        >
          <SimpleGrid
            mt="20px"
            columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing={10}
          >
            {data?.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.results?.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </Fragment>
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      )}
      {isVisible && <ScrollToTopButton />}
    </>
  );
};

export default GameGrid;
