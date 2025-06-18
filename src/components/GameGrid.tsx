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

  const totalGames = data?.pages.reduce((total, page) => total + (page.results?.length ?? 0), 0) ?? 0;
  const hasNoGames = !isLoading && data && totalGames === 0;

  if (hasNoGames) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="50vh"
        textAlign="center"
      >
        <Box fontSize="4xl" mb={4}>
          🎮
        </Box>
        <Box fontSize="xl" color="gray.400" mb={2}>
          No games found
        </Box>
        <Box color="gray.500" maxWidth="400px">
          Try adjusting your filters or search criteria to find more games.
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      h="100%" 
      position="relative"
    >
      {isLoading ? (
        <Box
          display="flex"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Box>
      ) : (
        <Box
          id="game-grid-scrollable"
          h="100%"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <InfiniteScroll
            dataLength={totalGames}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <Box display="flex" justifyContent="center" p={4}>
                <Spinner />
              </Box>
            }
            scrollableTarget="game-grid-scrollable"
          >
            <SimpleGrid
              mt="20px"
              columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
              spacing={10}
              pb={4}
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
        </Box>
      )}
      {isVisible && <ScrollToTopButton />}
    </Box>
  );
};

export default GameGrid;
