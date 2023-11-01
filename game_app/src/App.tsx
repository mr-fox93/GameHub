import { Flex, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import Test from "./components/Test";
import BackToTop from "./common/BackToTop";
import Navbar from "./components/Navbar";
import SortSelector from "./components/SortSelector";
import PlatformSelectors from "./components/PlatformsSelector";
import RelesedDateSelector from "./components/RelesedDateSelector";

function App() {
  return (
    <Grid
      templateAreas={{
        base: `'nav' ' main'`,
        lg: `'nav nav' ' aside main'`,
      }}
    >
      <GridItem area="nav">
        <Navbar />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" width="220px" ml="5px">
          {/* <GenreList setSelectedGenre={setSelectedGenre} setGames={setGames} /> */}
          <RelesedDateSelector />
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
        <Test />
      </GridItem>
    </Grid>
  );
}

export default App;
