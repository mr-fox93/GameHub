import { Flex, Grid, GridItem, HStack, Hide, Show, Box } from "@chakra-ui/react";
import GameGrid from "./components/GameGrid";
import BackToTop from "./common/BackToTop";
import Navbar from "./components/Navbar";
import SortSelector from "./components/SortSelector";
import PlatformSelectors from "./components/PlatformsSelector";
import RelesedDateSelector from "./components/RelesedDateSelector";
import GenreList from "./components/GenreList";
import Footer from "./components/Footer";
import GenreSelectors from "./components/GenreSelectors";

function App() {
  return (
    <Grid
      templateAreas={{
        base: `'nav' ' main' 'footer'  `,
        lg: `'nav nav' ' aside main'`,
      }}
      templateRows={{
        base: "auto 1fr auto",
        lg: "auto 1fr"
      }}
      h="100vh"
    >
      <GridItem area="nav">
        <Navbar />
      </GridItem>
      <Show above="lg">
        <GridItem 
          area="aside" 
          width="220px" 
          ml="5px"
          position="relative"
          overflow="hidden"
        >
          <Box
            h="100%"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <RelesedDateSelector />
            <GenreList />
            <BackToTop />
          </Box>
        </GridItem>
      </Show>

      <GridItem 
        area="main" 
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box p="3" flexShrink={0}>
          <HStack spacing={5}>
            <Flex gap="15px" flexDirection={{ base: "column", lg: "row" }}>
              <PlatformSelectors />
              <SortSelector />
              <Hide above="lg">
                <GenreSelectors />
              </Hide>
            </Flex>
          </HStack>
        </Box>
        
        <Box 
          flex="1" 
          overflow="hidden"
          px="3"
          pb="3"
        >
          <GameGrid />
        </Box>
      </GridItem>
      
      <GridItem area="footer" position="sticky" bottom="0" zIndex="sticky">
        <Hide above="md">
          <Footer />
        </Hide>
      </GridItem>
    </Grid>
  );
}

export default App;
