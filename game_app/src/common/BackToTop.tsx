import { ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      mt="10px"
      position="fixed"
      left="1rem"
      bottom="1rem"
    >
      {" "}
      {isVisible && (
        <IconButton
          aria-label="back to top"
          icon={<ChevronUpIcon />}
          size="lg"
          borderRadius="full"
          onClick={scrollToTop}
        />
      )}
    </Flex>
  );
};

export default BackToTop;
