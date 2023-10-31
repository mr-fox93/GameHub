import { IconButton } from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <IconButton
      aria-label="back to top"
      icon={<ChevronUpIcon />}
      size="lg"
      borderRadius="full"
      onClick={scrollToTop}
      position="fixed"
      bottom="6rem"
      right="2rem"
      zIndex="999"
      colorScheme="blue"
    />
  );
};

export default ScrollToTopButton;
