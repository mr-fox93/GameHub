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
} from "@chakra-ui/react";
import PlatformIcons from "./PlatformIcons";
import { Game } from "../entities/Games";
import MetaCritic from "./MetaCritic";
import noimage from "../assets/noimage.png";
import { AiFillStar } from "react-icons/ai";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useGameScreenshots } from "../hooks/useGames";

interface GameCardProps {
  game: Game;
}

const formatCount = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const GameCard = ({ game }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const shouldLoadScreens = isHovered || isOpen;
  const { data: screenshots, isLoading } = useGameScreenshots(shouldLoadScreens ? game.id : 0);

  const allImages = [
    game.background_image || noimage,
    ...(game.background_image_additional ? [game.background_image_additional] : []),
    ...(screenshots?.results?.map(s => s.image) || [])
  ].filter(Boolean);

  const shouldShowControls = allImages.length > 1 || (isHovered && isLoading && game.screenshots_count > 0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Ensure index is valid when image list shrinks (e.g., after closing modal)
  useEffect(() => {
    if (currentImageIndex >= allImages.length) {
      setCurrentImageIndex(0);
    }
  }, [allImages.length, currentImageIndex]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <>
      <Card
        borderRadius={6}
        overflow="hidden"
        h="100%"
        position="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
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
            src={allImages[currentImageIndex]}
            alt="game image"
            objectFit="cover"
            transition="all 0.4s ease"
            onClick={handleImageClick}
            cursor="zoom-in"
          />
          
          {isHovered && (
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
          
          {shouldShowControls && (
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
                      setCurrentImageIndex(index);
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

        <CardBody p={4} display="flex" flexDirection="column" h="200px">
          <Flex alignItems="center" mb={3} gap={2}>
            <PlatformIcons
              platforms={
                game.parent_platforms
                  ?.filter((p) => !!p.platform)
                  .map((p) => p.platform) || []
              }
            />
            <Flex flex="1" />
            <MetaCritic
              score={
                game.metacritic ||
                game.metacritic_platforms?.[0]?.metascore ||
                undefined
              }
            />
          </Flex>

          <Box flex="1" mb={3}>
            <Heading
              fontSize="xl"
              fontWeight="bold"
              lineHeight="1.3"
              noOfLines={2}
              color="white"
            >
              {game.name}
            </Heading>
          </Box>

          <Flex gap={1} alignItems="center" mb={3} fontSize="sm">
            <Icon as={AiFillStar} color="green.400" boxSize={3} />
            <Box bg="green.700" color="white" px={2} py={0.5} borderRadius="sm" fontWeight="bold" fontSize="xs">
              {game.rating?.toFixed(1) ?? "0.0"}
            </Box>
            <Text color="gray.400" fontSize="xs" mx={1}>
              rating
            </Text>
            <Text color="blue.300" fontWeight="bold" mx={1}>+</Text>
            <Box bg="blue.700" color="white" px={2} py={0.5} borderRadius="sm" fontWeight="bold" fontSize="xs">
              {formatCount(game.ratings_count ?? game.added ?? 0)}
            </Box>
            <Text color="gray.400" fontSize="xs" ml={1}>
              likes
            </Text>
          </Flex>

          <Text fontSize="sm" color="gray.500" mt="auto">
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
              src={allImages[currentImageIndex]}
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
                      onClick={() => setCurrentImageIndex(index)}
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
