import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Text,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import PlatformIcons from "./PlatformIcons";
import { Game } from "../entities/Games";
import noimage from "../assets/noimage.png";
import { AiFillStar } from "react-icons/ai";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useReducer, useEffect } from "react";
import { useGameScreenshots } from "../hooks/useGames";
import { useMemo } from "react";

interface GameCardProps {
  game: Game;
}

const formatCount = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const GameCard = ({ game }: GameCardProps) => {

  interface CardState {
    hovered: boolean;
    index: number;
    adultRevealed: boolean;
  }

  const initialState: CardState = {
    hovered: false,
    index: 0,
    adultRevealed: false,
  };

  type Action =
    | { type: "hover"; value: boolean }
    | { type: "next"; total: number }
    | { type: "prev"; total: number }
    | { type: "setIndex"; index: number }
    | { type: "revealAdult" };

  const reducer = (state: CardState, action: Action): CardState => {
    switch (action.type) {
      case "hover":
        return { ...state, hovered: action.value };
      case "next":
        return { ...state, index: (state.index + 1) % action.total };
      case "prev":
        return { ...state, index: (state.index - 1 + action.total) % action.total };
      case "setIndex":
        return { ...state, index: action.index };
      case "revealAdult":
        return { ...state, adultRevealed: true };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { hovered: isHovered, index: currentImageIndex, adultRevealed: isAdultContentRevealed } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const gameTitleColor = useColorModeValue("gray.800", "white");
  const ratingTextColor = useColorModeValue("gray.600", "gray.400");
  const releaseDateColor = useColorModeValue("gray.500", "gray.500");

  const shouldLoadScreens = isHovered || isOpen;
  const { data: screenshots, isLoading } = useGameScreenshots(shouldLoadScreens ? game.id : 0);

  const hasAdultContent = game.name.toLowerCase().includes('sex');

  const allImages = useMemo(() => [
    game.background_image || noimage,
    ...(game.background_image_additional ? [game.background_image_additional] : []),
    ...(screenshots?.results?.map(s => s.image) || [])
  ].filter(Boolean), [game.background_image, game.background_image_additional, screenshots?.results]);

  const shouldShowControls = allImages.length > 1 || (isHovered && isLoading && game.screenshots_count > 0);

  const nextImage = () => {
    dispatch({ type: "next", total: allImages.length });
  };

  const prevImage = () => {
    dispatch({ type: "prev", total: allImages.length });
  };

  useEffect(() => {
    if (currentImageIndex >= allImages.length) {
      dispatch({ type: "setIndex", index: 0 });
    }
  }, [allImages.length, currentImageIndex]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasAdultContent && !isAdultContentRevealed) {
      return;
    }
    onOpen();
  };

  const handleAdultContentReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "revealAdult" });
  };

  return (
    <>
      <Card
        borderRadius={6}
        overflow="hidden"
        h="100%"
        position="relative"
        onMouseEnter={() => dispatch({ type: "hover", value: true })}
        onMouseLeave={() => dispatch({ type: "hover", value: false })}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        transform={isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)"}
        boxShadow={isHovered ? "0 20px 40px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.1)"}
        cursor="pointer"
        _hover={{
          "& .image-controls": {
            opacity: 1,
          }
        }}
      >
        <Box position="relative" height="179px" overflow="hidden">
          <Image
            width="100%"
            height="100%"
            src={allImages[currentImageIndex] || noimage}
            alt="game image"
            objectFit="cover"
            transition="all 0.4s ease"
            onClick={handleImageClick}
            cursor={hasAdultContent && !isAdultContentRevealed ? "pointer" : "zoom-in"}
            filter={hasAdultContent && !isAdultContentRevealed ? "blur(20px)" : "none"}
          />
          
          {hasAdultContent && !isAdultContentRevealed && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.800"
              display="flex"
              alignItems="center"
              justifyContent="center"
              backdropFilter="blur(10px)"
              onClick={handleAdultContentReveal}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                bg: "blackAlpha.900",
                transform: "scale(1.02)"
              }}
            >
              <VStack spacing={4} textAlign="center" color="white">
                <Box
                  fontSize="4xl"
                  fontWeight="black"
                  color="red.400"
                  textShadow="0 0 20px rgba(255, 0, 0, 0.5)"
                  letterSpacing="wider"
                >
                  +18
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="white"
                  textShadow="0 2px 4px rgba(0,0,0,0.8)"
                  maxW="200px"
                  lineHeight="1.2"
                >
                  Click if you have more than 18 years
                </Text>
                <Box
                  w="60px"
                  h="2px"
                  bg="red.400"
                  borderRadius="full"
                  boxShadow="0 0 10px rgba(255, 0, 0, 0.5)"
                />
              </VStack>
            </Box>
          )}
          
          {isHovered && (!hasAdultContent || isAdultContentRevealed) && (
            <Box
              position="absolute"
              top={2}
              left={2}
              bg="blackAlpha.700"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              opacity={0.8}
              pointerEvents="none"
            >
              Click to zoom
            </Box>
          )}
          
          {shouldShowControls && (!hasAdultContent || isAdultContentRevealed) && (
            <Flex
              className="image-controls"
              position="absolute"
              bottom={2}
              left="50%"
              transform="translateX(-50%)"
              gap={1}
              opacity={0}
              transition="opacity 0.3s ease"
              bg="blackAlpha.700"
              borderRadius="full"
              p={1}
            >
              <IconButton
                aria-label="Previous image"
                icon={<ChevronLeftIcon />}
                size="xs"
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              />
              
              <Flex alignItems="center" gap={1} px={2}>
                {allImages.map((_, index) => (
                  <Box
                    key={index}
                    w={1.5}
                    h={1.5}
                    borderRadius="full"
                    bg={index === currentImageIndex ? "white" : "whiteAlpha.500"}
                    transition="all 0.2s ease"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "setIndex", index });
                    }}
                  />
                ))}
              </Flex>
              
              <IconButton
                aria-label="Next image"
                icon={<ChevronRightIcon />}
                size="xs"
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              />
            </Flex>
          )}
        </Box>

        <CardBody 
          p={4} 
          display="flex" 
          flexDirection="column" 
          h="200px"
          filter={hasAdultContent && !isAdultContentRevealed ? "blur(3px)" : "none"}
          transition="filter 0.3s ease"
        >
          <Flex alignItems="center" mb={3} gap={2}>
            <PlatformIcons
              platforms={
                game.parent_platforms
                  ?.filter((p) => !!p.platform)
                  .map((p) => p.platform) || []
              }
            />
          </Flex>

          <Box flex="1" mb={3}>
            <Heading
              fontSize="xl"
              fontWeight="bold"
              lineHeight="1.3"
              noOfLines={2}
              color={gameTitleColor}
            >
              {game.name}
            </Heading>
          </Box>

          <Flex gap={1} alignItems="center" mb={3} fontSize="sm">
            <Icon as={AiFillStar} color="green.400" boxSize={3} />
            <Box bg="green.700" color="white" px={2} py={0.5} borderRadius="sm" fontWeight="bold" fontSize="xs">
              {game.rating?.toFixed(1) ?? "0.0"}
            </Box>
            <Text color={ratingTextColor} fontSize="xs" mx={1}>
              rating
            </Text>
            <Text color="blue.300" fontWeight="bold" mx={1}>+</Text>
            <Box bg="blue.700" color="white" px={2} py={0.5} borderRadius="sm" fontWeight="bold" fontSize="xs">
              {formatCount(game.ratings_count ?? game.added ?? 0)}
            </Box>
            <Text color={ratingTextColor} fontSize="xs" ml={1}>
              likes
            </Text>
          </Flex>

          <Text fontSize="sm" color={releaseDateColor} mt="auto">
            Released date: {game.released}
          </Text>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalCloseButton
            color="white"
            bg="blackAlpha.700"
            _hover={{ bg: "blackAlpha.800" }}
            size="lg"
            zIndex={2}
          />
          
          <Box position="relative" w="100%" h="100%">
            <Image
              src={allImages[currentImageIndex] || noimage}
              alt="game image zoomed"
              objectFit="contain"
              w="100%"
              h="100%"
              maxH="90vh"
            />
            
            {allImages.length > 1 && (
              <Flex
                position="absolute"
                bottom={4}
                left="50%"
                transform="translateX(-50%)"
                gap={2}
                bg="blackAlpha.800"
                borderRadius="full"
                p={3}
                opacity={1}
              >
                <IconButton
                  aria-label="Previous image"
                  icon={<ChevronLeftIcon />}
                  size="md"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={prevImage}
                />
                
                <Flex alignItems="center" gap={2} px={3}>
                  {allImages.map((_, index) => (
                    <Box
                      key={index}
                      w={2}
                      h={2}
                      borderRadius="full"
                      bg={index === currentImageIndex ? "white" : "whiteAlpha.500"}
                      transition="all 0.2s ease"
                      cursor="pointer"
                      onClick={() => dispatch({ type: "setIndex", index })}
                    />
                  ))}
                </Flex>
                
                <IconButton
                  aria-label="Next image"
                  icon={<ChevronRightIcon />}
                  size="md"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={nextImage}
                />
              </Flex>
            )}
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GameCard;
