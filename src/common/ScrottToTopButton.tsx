import { IconButton } from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    const scrollableElement = document.getElementById("game-grid-scrollable");

    if (scrollableElement) {
      scrollableElement.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <IconButton
      aria-label="back to top"
      icon={<ChevronUpIcon boxSize="30px" />}
      size="lg"
      borderRadius="full"
      onClick={scrollToTop}
      position="fixed"
      bottom="6rem"
      right="2rem"
      zIndex={999}
    />
  );
};

export default ScrollToTopButton;
