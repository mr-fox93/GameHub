import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import PlatformIcons from "./PlatformIcons";
import { Game } from "../entities/Games";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <Card borderRadius={6} overflow="hidden">
      <Image
        width="100%"
        height="179px"
        src={game.background_image}
        alt="game image"
        loading="lazy"
      />
      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Flex alignItems="center" mb="6px" gap="6px">
            <PlatformIcons
              platforms={
                game.parent_platforms
                  ?.filter((p) => !!p.platform)
                  .map((p) => p.platform) || []
              }
            />
            <Flex flexGrow={1}></Flex>
            {/* <MetaCritic score={game.metacritic} /> */}
          </Flex>

          <Heading fontSize="2xl">
            {game.name.includes(":") ? (
              <>
                {game.name.split(":")[0]}:
                <br />
                {game.name.split(":")[1]}
              </>
            ) : (
              game.name
            )}
          </Heading>
        </Box>

        <Box mt="auto">
          {" "}
          <Text textDecoration="underline" fontSize="sm" color="gray.500">
            Relesed date: {game.released}
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};

export default GameCard;
