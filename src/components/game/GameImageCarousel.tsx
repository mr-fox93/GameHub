import { Box, Flex, Image, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction } from "react";

interface Props {
  images: string[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  isHovered: boolean;
  onZoom: () => void;
}

const GameImageCarousel = ({ images, currentIndex, setCurrentIndex, isHovered, onZoom }: Props) => {
  if (!images.length) return null;

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box position="relative" height="179px" overflow="hidden">
      <Image
        width="100%"
        height="100%"
        src={images[currentIndex]}
        alt="game image"
        objectFit="cover"
        transition="all 0.4s ease"
        onClick={onZoom}
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
      {images.length > 1 && (
        <Flex
          className="image-controls"
          position="absolute"
          bottom={2}
          left="50%"
          transform="translateX(-50%)"
          gap={1}
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.3s ease"
          bg="blackAlpha.700"
          borderRadius="full"
          p={1}
        >
          <IconButton
            aria-label="previous"
            icon={<ChevronLeftIcon />}
            size="xs"
            variant="ghost"
            color="white"
            onClick={prev}
            _hover={{ bg: "whiteAlpha.200" }}
          />
          <Flex alignItems="center" gap={1} px={2}>
            {images.map((_, index) => (
              <Box
                key={index}
                w={1.5}
                h={1.5}
                borderRadius="full"
                bg={index === currentIndex ? "white" : "whiteAlpha.500"}
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </Flex>
          <IconButton
            aria-label="next"
            icon={<ChevronRightIcon />}
            size="xs"
            variant="ghost"
            color="white"
            onClick={next}
            _hover={{ bg: "whiteAlpha.200" }}
          />
        </Flex>
      )}
    </Box>
  );
};

export default GameImageCarousel; 