import { Flex, Grid, GridItem, HStack, Hide, Show } from "@chakra-ui/react";
import GameGrid from "./components/GameGrid";
import BackToTop from "./common/BackToTop";
import Navbar from "./components/Navbar";
import SortSelector from "./components/SortSelector";
import PlatformSelectors from "./components/PlatformsSelector";
import RelesedDateSelector from "./components/RelesedDateSelector";
import GenreList from "./components/GenreList";
import Footer from "./components/Footer";

function App() {
  return (
    <Grid
      templateAreas={{
        base: `'nav' ' main' 'footer'  `,
        lg: `'nav nav' ' aside main'`,
      }}
    >
      <GridItem area="nav">
        <Navbar />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" width="220px" ml="5px">
          <RelesedDateSelector />
          <GenreList />

          <BackToTop />
        </GridItem>
      </Show>

      <GridItem area="main" padding="3">
        <HStack spacing={5}>
          <Flex gap="15px" flexDirection={{ base: "column", lg: "row" }}>
            <PlatformSelectors />
            <SortSelector />
          </Flex>
        </HStack>
        <GameGrid />
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
